import OpenAI from "openai";
import * as llm from "../interfaces/llmprovider.js";
import * as schema from "../interfaces/telemetryevent.js";
import { JSONStorage } from "../storage/jsonStorage.js";
import crypto from "crypto";

export class OpenAIProvider implements llm.LLMProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async callModel(
    prompt: string,
    parent_call_id: string = "",
    filepath: string = "telemetry.json",
    options?: Record<string, any>
  ): Promise<schema.TelemetryEvent> {
    const start = Date.now();

    const response = await this.client.chat.completions.create({
      model: options?.model ?? "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      ...options,
    });

    const end = Date.now();

    const choice = response.choices[0]?.message?.content ?? "";

    const telemetryResponse: schema.TelemetryEvent = {
      event_id: crypto.randomUUID(),
      parent_call_id,
      model_name: options?.model ?? "gpt-4o-mini",
      model_version: "2025-08",
      prompt,
      response: choice,
      input_token_count: String(response.usage?.prompt_tokens ?? 0),
      output_token_count: String(response.usage?.completion_tokens ?? 0),
      total_tokens: String(response.usage?.total_tokens ?? 0),
      latency_ms: end - start,
      timestamp: Date.now(),
      detector_signals: {},
      metadata: {
        request_id: response.id,
        finish_reason: response.choices[0]?.finish_reason,
      },
    };

    const storage = new JSONStorage(filepath);
    await storage.save(telemetryResponse);

    return telemetryResponse;
  }
}
