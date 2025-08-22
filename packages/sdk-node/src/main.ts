import { OpenAIProvider } from "./providers/OpenAIprovider.js";
import { JSONStorage } from "./storage/jsonStorage.js";
import { TelemetryManager } from "./Telemetrymanager.js";

async function main(prompt: string, apikey: string) {
  const storage = new JSONStorage("./telemetry.jsonl");
  const manager = new TelemetryManager(storage, 5000);
  const provider = new OpenAIProvider(apikey);

  const event = await provider.callModel(prompt);
  manager.addEvent(event);

  // For a single-shot run
  await manager.shutdown();

  console.log("Telemetry saved. Event:", event);
}
