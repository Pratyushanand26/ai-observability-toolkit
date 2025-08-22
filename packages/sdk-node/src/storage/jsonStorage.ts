// storage/jsonStorage.ts
import fs from "fs/promises";
import path from "path";
import * as schema from "../interfaces/telemetryevent.js";

export class JSONStorage {
  private filePath: string;

  constructor(filePath: string = "./telemetry.jsonl") {
    this.filePath = filePath;
  }

  // Ensure the directory exists
  private async ensureDir() {
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
  }

  // Save a single event (append to JSONL)
  async save(event: schema.TelemetryEvent) {
    await this.ensureDir();
    try {
      await fs.appendFile(this.filePath, JSON.stringify(event) + "\n");
    } catch (err) {
      console.error("Failed to save event:", err);
      throw err;
    }
  }

  // Save multiple events at once (batch append)
  async saveBatch(events: schema.TelemetryEvent[]) {
    if (events.length === 0) return;
    await this.ensureDir();
    const payload = events.map(e => JSON.stringify(e)).join("\n") + "\n";
    try {
      await fs.appendFile(this.filePath, payload);
    } catch (err) {
      console.error("Failed to save batch events:", err);
      throw err;
    }
  }

  // Read all events from JSONL file (for dashboard / dev)
  async readAll(): Promise<schema.TelemetryEvent[]> {
    try {
      const text = await fs.readFile(this.filePath, "utf-8");
      if (!text.trim()) return [];
      return text
        .trim()
        .split("\n")
        .map(line => JSON.parse(line) as schema.TelemetryEvent);
    } catch (err: any) {
      if (err.code === "ENOENT") return []; // file doesn't exist yet
      throw err;
    }
  }
}
