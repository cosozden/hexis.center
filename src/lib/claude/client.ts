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
 */

import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam, ContentBlock, Tool } from '@anthropic-ai/sdk/resources/messages';
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
}

export interface ClaudeResponse {
  /** The content blocks from Claude's response */
  content: ContentBlock[];
  /** Extracted tool use result (if tool was called) */
  toolResult: Record<string, unknown> | null;
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

// ━━━ CORE FUNCTION ━━━

/**
 * Send a request to Claude API with Hexis defaults
 * - Always server-side
 * - Always includes EU AI Act grounding (unless opt-out)
 * - Always tracks token usage
 * - Always uses structured output when tools provided
 */
export async function callClaude(request: ClaudeRequest): Promise<ClaudeResponse> {
  const anthropic = getClient();
  const model = MODELS[request.model ?? DEFAULT_MODEL];

  // Build system prompt with grounding
  const systemParts: string[] = [];

  if (request.includeGrounding !== false) {
    systemParts.push(EU_AI_ACT_GROUNDING);
  }

  systemParts.push(request.systemPrompt);

  // Hallucination prevention instructions — always included
  systemParts.push(HALLUCINATION_RULES);

  const systemPrompt = systemParts.join('\n\n---\n\n');

  const response = await anthropic.messages.create({
    model,
    max_tokens: request.maxTokens ?? MAX_TOKENS,
    system: systemPrompt,
    messages: request.messages,
    tools: request.tools,
    tool_choice: request.toolChoice,
  });

  // Extract tool result if present
  let toolResult: Record<string, unknown> | null = null;
  for (const block of response.content) {
    if (block.type === 'tool_use') {
      toolResult = block.input as Record<string, unknown>;
      break;
    }
  }

  return {
    content: response.content,
    toolResult,
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
