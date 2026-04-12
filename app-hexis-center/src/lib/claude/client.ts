/**
 * HEXIS Claude API Client
 * ━━━━━━━━━━━━━━━━━━━━━━━━
 * Server-side only — API key never exposed to browser.
 *
 * Architecture:
 * - Haiku 4.5: default model (Risk, Identify, Evaluate, general)
 * - Sonnet 4.6: complex reasoning (Navigate, Track reports)
 * - All calls include EU AI Act grounding via system prompts
 * - Structured output via tool_use for every endpoint
 * - Token usage tracked for cost monitoring
 *
 * Advanced Features:
 * - Prompt Caching: EU AI Act grounding (~32.5K tokens) cached with
 *   cache_control ephemeral — 90% cost reduction on repeated calls
 * - Streaming: SSE-based streaming for ComplianceAdvisor real-time display
 * - Extended Thinking: Enabled for Navigate/Track complex reasoning
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  MessageParam,
  ContentBlock,
  Tool,
  TextBlock,
  ToolUseBlock,
} from '@anthropic-ai/sdk/resources/messages';
import { EU_AI_ACT_GROUNDING } from './grounding';

// ━━━ CONFIGURATION ━━━

const MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6-20260327',
} as const;

type ModelKey = keyof typeof MODELS;

const DEFAULT_MODEL: ModelKey = 'haiku';
const MAX_TOKENS = 4096;

// Rate limiting: per user per day
const DAILY_REQUEST_LIMIT = 50;

// ━━━ CLIENT SINGLETON ━━━

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY is not set. Add it to .env.local'
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

// ━━━ TYPES ━━━

export interface ClaudeRequest {
  /** System prompt — will be prepended with EU AI Act grounding */
  systemPrompt: string;
  /** User messages */
  messages: MessageParam[];
  /** Tool definitions for structured output */
  tools?: Tool[];
  /** Force a specific tool to be used */
  toolChoice?: { type: 'tool'; name: string } | { type: 'auto' };
  /** Model override (default: haiku) */
  model?: ModelKey;
  /** Max output tokens (default: 4096) */
  maxTokens?: number;
  /** Include EU AI Act grounding in system prompt */
  includeGrounding?: boolean;
  /** Enable extended thinking (for complex Navigate/Track reasoning) */
  enableThinking?: boolean;
  /** Budget tokens for extended thinking (default: 10000) */
  thinkingBudget?: number;
}

export interface ClaudeResponse {
  /** The content blocks from Claude's response */
  content: ContentBlock[];
  /** Extracted tool use result (if tool was called) */
  toolResult: Record<string, unknown> | null;
  /** Extracted text content (convenience) */
  textContent: string;
  /** Token usage for cost tracking */
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheCreationTokens: number;
  };
  /** Model used */
  model: string;
  /** Stop reason */
  stopReason: string | null;
}

// ━━━ SYSTEM PROMPT BUILDER (with Prompt Caching) ━━━

/**
 * Build system prompt blocks with cache_control for prompt caching.
 * The EU AI Act grounding (~32.5K tokens) is marked as ephemeral cache.
 * Cache TTL: 5 minutes — repeated calls within that window get 90% cost savings.
 *
 * Returns structured blocks for the Anthropic API system parameter.
 */
function buildSystemBlocks(
  systemPrompt: string,
  includeGrounding: boolean,
): Anthropic.Messages.TextBlockParam[] {
  const blocks: Anthropic.Messages.TextBlockParam[] = [];

  if (includeGrounding) {
    // EU AI Act grounding — cached (largest block, ~32.5K tokens)
    blocks.push({
      type: 'text',
      text: EU_AI_ACT_GROUNDING,
      cache_control: { type: 'ephemeral' },
    });
  }

  // Step-specific system prompt
  blocks.push({
    type: 'text',
    text: systemPrompt,
  });

  // Hallucination prevention — always included, cached with prompt
  blocks.push({
    type: 'text',
    text: HALLUCINATION_RULES,
    cache_control: { type: 'ephemeral' },
  });

  return blocks;
}

// ━━━ CORE FUNCTION ━━━

/**
 * Send a request to Claude API with Hexis defaults
 * - Always server-side
 * - Always includes EU AI Act grounding (unless opt-out)
 * - Prompt caching on grounding text (90% cost reduction)
 * - Always tracks token usage
 * - Always uses structured output when tools provided
 * - Optional extended thinking for complex reasoning
 */
export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  const anthropic = getClient();
  const model = MODELS[request.model ?? DEFAULT_MODEL];
  const includeGrounding = request.includeGrounding !== false;

  // Build system prompt with cache_control blocks
  const systemBlocks = buildSystemBlocks(request.systemPrompt, includeGrounding);

  // Build API parameters
  const apiParams: Anthropic.Messages.MessageCreateParams = {
    model,
    max_tokens: request.maxTokens ?? MAX_TOKENS,
    system: systemBlocks,
    messages: request.messages,
    tools: request.tools,
    tool_choice: request.toolChoice,
  };

  // Extended thinking for complex reasoning (Navigate/Track)
  if (request.enableThinking) {
    apiParams.thinking = {
      type: 'enabled',
      budget_tokens: request.thinkingBudget ?? 10000,
    };
    // Extended thinking requires higher max_tokens
    apiParams.max_tokens = Math.max(apiParams.max_tokens, 16000);
  }

  const response = await anthropic.messages.create(apiParams);

  // Extract tool result and text content
  let toolResult: Record<string, unknown> | null = null;
  let textContent = '';

  for (const block of response.content) {
    if (block.type === 'tool_use') {
      toolResult = (block as ToolUseBlock).input as Record<string, unknown>;
    }
    if (block.type === 'text') {
      textContent += (block as TextBlock).text;
    }
  }

  return {
    content: response.content,
    toolResult,
    textContent,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: (response.usage as Record<string, number>).cache_read_input_tokens ?? 0,
      cacheCreationTokens: (response.usage as Record<string, number>).cache_creation_input_tokens ?? 0,
    },
    model,
    stopReason: response.stop_reason,
  };
}

// ━━━ STREAMING FUNCTION ━━━

/**
 * Stream a request to Claude API with Hexis defaults.
 * Returns a ReadableStream that emits SSE-formatted chunks.
 *
 * Events:
 * - data: {"type":"text","text":"..."} — text delta
 * - data: {"type":"thinking","text":"..."} — thinking delta (if enabled)
 * - data: {"type":"tool","name":"...","input":{}} — tool use result
 * - data: {"type":"usage","usage":{}} — final usage stats
 * - data: {"type":"done"} — stream complete
 * - data: {"type":"error","message":"..."} — error
 */
export function streamClaude(request: ClaudeRequest): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const anthropic = getClient();
        const model = MODELS[request.model ?? DEFAULT_MODEL];
        const includeGrounding = request.includeGrounding !== false;
        const systemBlocks = buildSystemBlocks(request.systemPrompt, includeGrounding);

        const apiParams: Anthropic.Messages.MessageCreateParams = {
          model,
          max_tokens: request.maxTokens ?? MAX_TOKENS,
          system: systemBlocks,
          messages: request.messages,
          tools: request.tools,
          tool_choice: request.toolChoice,
          stream: true,
        };

        if (request.enableThinking) {
          apiParams.thinking = {
            type: 'enabled',
            budget_tokens: request.thinkingBudget ?? 10000,
          };
          apiParams.max_tokens = Math.max(apiParams.max_tokens, 16000);
        }

        const stream = anthropic.messages.stream(apiParams);
        let toolInput: Record<string, unknown> | null = null;
        let toolName = '';

        stream.on('text', (text) => {
          const event = `data: ${JSON.stringify({ type: 'text', text })}\n\n`;
          controller.enqueue(encoder.encode(event));
        });

        // Collect tool use blocks
        stream.on('contentBlock', (block) => {
          if (block.type === 'tool_use') {
            toolName = (block as ToolUseBlock).name;
            toolInput = (block as ToolUseBlock).input as Record<string, unknown>;
          }
        });

        const finalMessage = await stream.finalMessage();

        // Emit tool result if present
        if (toolInput && toolName) {
          const event = `data: ${JSON.stringify({ type: 'tool', name: toolName, input: toolInput })}\n\n`;
          controller.enqueue(encoder.encode(event));
        }

        // Emit usage stats
        const usage = {
          inputTokens: finalMessage.usage.input_tokens,
          outputTokens: finalMessage.usage.output_tokens,
          cacheReadTokens: (finalMessage.usage as Record<string, number>).cache_read_input_tokens ?? 0,
          cacheCreationTokens: (finalMessage.usage as Record<string, number>).cache_creation_input_tokens ?? 0,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'usage', usage, model })}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Claude API error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message })}\n\n`));
        controller.close();
      }
    },
  });
}

// ━━━ HALLUCINATION PREVENTION ━━━

const HALLUCINATION_RULES = `
<hexis_rules>
CRITICAL RULES — ALWAYS FOLLOW:

1. SOURCE GROUNDING: Only cite EU AI Act articles that exist in the provided reference text.
   Never invent article numbers. If unsure, say "this may require legal review."

2. CALIBRATED UNCERTAINTY — use exactly these levels:
   - "clearly required" — explicit in the regulation text
   - "likely applies" — strong interpretive basis
   - "gray area" — reasonable arguments both ways
   - "seek legal counsel" — complex, context-dependent

3. NEVER override deterministic outputs (risk classification, matrix scores, obligation lists).
   Your role is to ENRICH and EXPLAIN, not to replace the engine.

4. Always include a brief disclaimer: "This is AI-assisted guidance, not legal advice."

5. When citing articles, use exact format: "Article X(Y)" or "Art. X(Y)(z)"

6. If the user's system falls into a gray area, explicitly say so.
   Do not force a classification — ambiguity is valuable information.
</hexis_rules>
`;

// ━━━ EXPORTS ━━━

export { MODELS, DEFAULT_MODEL, DAILY_REQUEST_LIMIT };
export type { ModelKey };
