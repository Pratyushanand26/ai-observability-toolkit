import type { TelemetryEvent } from "./telemetryevent.js";

export interface LLMProvider {
  callModel(prompt: string,parent_call_id:string,filepath?:string, options?: Record<string, any>): Promise<TelemetryEvent>;
}
