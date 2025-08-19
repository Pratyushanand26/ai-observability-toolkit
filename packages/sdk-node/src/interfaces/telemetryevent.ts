export interface TelemetryEvent {
  event_id: string;
  parent_call_id:string;
  model_name: string;
  model_version:string;
  prompt: string;
  response: string;
  input_token_count: string;
  output_token_count:string;
  total_tokens:string;
  latency_ms: number;
  timestamp: number;
  hallucination_score?: number;
  detector_signals?:Record<string,any>;
  metadata?:Record<string,any>;
}
