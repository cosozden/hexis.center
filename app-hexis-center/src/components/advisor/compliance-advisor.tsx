/**
 * Compliance Advisor — Streaming Multi-turn Claude Conversation
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Floatable panel that provides context-aware guidance at every ORIENT step.
 * This is the "Claude IS the Consultant" feature — the platform's soul.
 *
 * v2 Features:
 * - STREAMING: Real-time token display via SSE (advisor-stream endpoint)
 * - Graceful fallback to non-streaming if SSE fails
 * - Typewriter effect with cursor animation
 * - Multi-turn conversation with persistence
 * - Full ORIENT context awareness
 * - Mobile responsive (w-[min(420px,90vw)])
 * - Keyboard shortcuts (Cmd+K to toggle)
 *
 * Usage:
 *   <ComplianceAdvisor
 *     systemId="uuid"
 *     orientStep="identify"
 *     contextHint="User is reviewing Art. 9 obligation for risk management"
 *   />
 */

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Separator } from "@/components/ui";
import { handleApiError } from "@/lib/api/handle-api-error";

// ━━━ TYPES ━━━

type OrientStep = "observe" | "risk" | "identify" | "evaluate" | "navigate" | "track";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface AdvisorProps {
  systemId: string;
  orientStep: OrientStep;
  /** Optional hint about what the user is currently looking at */
  contextHint?: string;
}

// ━━━ SUGGESTED QUESTIONS PER STEP ━━━

const SUGGESTIONS: Record<OrientStep, string[]> = {
  observe: [
    "What information should I capture about this AI system?",
    "How do I determine if I'm a provider or deployer?",
    "Does this system fall under EU AI Act scope?",
  ],
  risk: [
    "Why was my system classified at this risk level?",
    "Does the Art. 6(3) exception apply to my case?",
    "What are the penalties for my risk category?",
  ],
  identify: [
    "Which obligation should I prioritize first?",
    "How do I implement this obligation practically?",
    "What evidence should I keep for audit purposes?",
  ],
  evaluate: [
    "What does my governance posture mean?",
    "How can I improve my weakest dimension?",
    "What should my 30-day improvement target be?",
  ],
  navigate: [
    "My team is small — how do we prioritize this plan?",
    "Which actions have the highest compliance impact?",
    "Can we start with documentation while planning oversight?",
  ],
  track: [
    "How should I present this score to the board?",
    "What does this compliance score actually mean?",
    "When should I schedule the next governance review?",
  ],
};

const STEP_LABELS: Record<OrientStep, string> = {
  observe: "Observe",
  risk: "Risk",
  identify: "Identify",
  evaluate: "Evaluate",
  navigate: "Navigate",
  track: "Track",
};

// ━━━ STREAMING HOOK ━━━

function useStreamingMessage() {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startStream = useCallback(
    async (
      body: Record<string, unknown>,
      onComplete: (fullText: string) => void,
      onError: (error: string) => void,
    ) => {
      // Cancel any existing stream
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setStreamingText("");
      setIsStreaming(true);

      try {
        const res = await fetch("/api/ai/advisor-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (handleApiError(res)) return;

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to connect to advisor");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream reader available");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "text") {
                accumulated += data.text;
                setStreamingText(accumulated);
              }

              if (data.type === "error") {
                throw new Error(data.message);
              }

              if (data.type === "done") {
                onComplete(accumulated);
                setIsStreaming(false);
                setStreamingText("");
                return;
              }
            } catch (parseErr) {
              // Skip non-JSON lines
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }

        // Stream ended without "done" event
        if (accumulated) {
          onComplete(accumulated);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        onError(err instanceof Error ? err.message : "Stream failed");
      } finally {
        setIsStreaming(false);
        setStreamingText("");
      }
    },
    [],
  );

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
    setStreamingText("");
  }, []);

  return { streamingText, isStreaming, startStream, cancelStream };
}

// ━━━ COMPONENT ━━━

export function ComplianceAdvisor({ systemId, orientStep, contextHint }: AdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { streamingText, isStreaming, startStream, cancelStream } = useStreamingMessage();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard shortcut: Cmd/Ctrl+K to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setError(null);

      const messageToSend = contextHint && messages.length === 0
        ? `[Context: ${contextHint}]\n\n${text.trim()}`
        : text.trim();

      startStream(
        {
          systemId,
          orientStep,
          message: messageToSend,
          conversationId,
        },
        // onComplete
        (fullText) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: fullText },
          ]);
        },
        // onError — fallback to non-streaming
        async (streamError) => {
          console.warn("[ComplianceAdvisor] Stream failed, falling back:", streamError);
          try {
            const res = await fetch("/api/ai/advisor", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemId,
                orientStep,
                message: messageToSend,
                conversationId,
              }),
            });

            if (handleApiError(res)) return;

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.error || "Failed to get response");
            }

            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: data.message },
            ]);
            setConversationId(data.conversationId);
          } catch (fallbackErr) {
            setError(fallbackErr instanceof Error ? fallbackErr.message : "Something went wrong");
          }
        },
      );
    },
    [systemId, orientStep, contextHint, conversationId, messages.length, isStreaming, startStream],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startNewConversation = () => {
    cancelStream();
    setMessages([]);
    setConversationId(undefined);
    setError(null);
  };

  // ━━━ FLOATING TRIGGER BUTTON ━━━
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#1C1E23] border border-[#B2986C] text-[#E8E6E2] text-xs hover:bg-[#B2986C]/10 transition-colors"
        title="Open Compliance Advisor (Cmd+K)"
        aria-label="Open Compliance Advisor"
      >
        <span
          className="text-[#B2986C]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          H
        </span>
        <span>Ask Advisor</span>
        <span className="text-[8px] text-[#8A8884] ml-1">⌘K</span>
      </button>
    );
  }

  // ━━━ ADVISOR PANEL ━━━
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col bg-[#16181C] border border-[rgba(232,230,226,0.10)]"
      style={{ width: "min(420px, 90vw)", maxHeight: "min(600px, 80vh)" }}
      role="dialog"
      aria-label="Compliance Advisor"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(232,230,226,0.10)]">
        <div>
          <p
            className="text-sm text-[#E8E6E2]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Compliance Advisor
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[9px] uppercase tracking-[0.12em] text-[#B2986C]">
              {STEP_LABELS[orientStep]} Step
            </p>
            {isStreaming && (
              <span className="text-[8px] text-[#B2986C] animate-pulse">
                streaming
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {isStreaming && (
            <button
              onClick={cancelStream}
              className="text-[10px] text-red-400 hover:text-red-300 px-2 py-1 border border-red-500/30 transition-colors"
              aria-label="Stop generating"
            >
              Stop
            </button>
          )}
          {messages.length > 0 && !isStreaming && (
            <button
              onClick={startNewConversation}
              className="text-[10px] text-[#8A8884] hover:text-[#E8E6E2] px-2 py-1 border border-[rgba(232,230,226,0.10)] transition-colors"
            >
              New
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#8A8884] hover:text-[#E8E6E2] px-2 py-1 transition-colors"
            aria-label="Close advisor"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px]" style={{ maxHeight: "min(400px, 60vh)" }}>
        {messages.length === 0 && !isStreaming ? (
          // Welcome + suggestions
          <div className="space-y-3">
            <p className="text-xs text-[#8A8884]">
              Ask me anything about EU AI Act compliance for this system. I have
              full context from your ORIENT journey.
            </p>
            <Separator className="bg-[rgba(232,230,226,0.06)]" />
            <p className="text-[9px] uppercase tracking-[0.1em] text-[#8A8884]">
              Suggested questions
            </p>
            <div className="space-y-1.5">
              {SUGGESTIONS[orientStep].map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="w-full text-left text-xs text-[#8A8884] hover:text-[#E8E6E2] px-3 py-2 border border-[rgba(232,230,226,0.06)] hover:border-[rgba(232,230,226,0.18)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Conversation
          <>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "text-[#E8E6E2] bg-[rgba(232,230,226,0.04)] px-3 py-2 border-l-2 border-[#B2986C]"
                    : "text-[#8A8884] px-3 py-2"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="space-y-2">
                    {msg.content.split("\n\n").map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            ))}

            {/* Streaming response */}
            {isStreaming && streamingText && (
              <div className="text-xs leading-relaxed text-[#8A8884] px-3 py-2">
                <div className="space-y-2">
                  {streamingText.split("\n\n").map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                  <span className="streaming-cursor" />
                </div>
              </div>
            )}

            {/* Streaming with no text yet */}
            {isStreaming && !streamingText && (
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#B2986C] animate-pulse" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#B2986C] animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-[#B2986C] animate-pulse" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-[10px] text-[#8A8884]">Connecting...</span>
              </div>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <div className="px-3 py-2 border border-red-500/30 bg-red-500/5">
            <p className="text-[10px] text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-[rgba(232,230,226,0.10)] px-3 py-2">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about compliance..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-xs text-[#E8E6E2] placeholder:text-[#8A8884]/50 resize-none focus:outline-none py-1.5"
            aria-label="Type your question"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="text-[10px] px-3 py-1 h-auto border border-[rgba(232,230,226,0.18)] bg-transparent text-[#8A8884] hover:text-[#E8E6E2] hover:border-[#E8E6E2] disabled:opacity-30"
          >
            Send
          </Button>
        </div>
        <p className="text-[8px] text-[#8A8884]/50 mt-1">
          AI guidance — not legal advice. Verify with qualified counsel.
        </p>
      </form>

    </div>
  );
}
