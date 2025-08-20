import * as schema from "./interfaces/telemetryevent.js";
import * as storage from "./interfaces/storage.js";

export class TelemetryManager {
  private buffer: schema.TelemetryEvent[] = [];
  private storage: storage.StorageProvider;
  private flushInterval: number;
  private timer?: NodeJS.Timeout;

  constructor(storage: storage.StorageProvider, flushInterval: number = 5000) {
    this.storage = storage;
    this.flushInterval = flushInterval;

    // Auto flush every X ms
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }

  addEvent(event: schema.TelemetryEvent) {
    this.buffer.push(event);

    // Optional: flush immediately if buffer is big
    if (this.buffer.length >= 10) {
      this.flush();
    }
  }

  async flush() {
    if (this.buffer.length === 0) return;

    const eventsToSave = [...this.buffer];
    this.buffer = [];

    for (const e of eventsToSave) {
      await this.storage.save(e);
    }
  }

  shutdown() {
    if (this.timer) clearInterval(this.timer);
    this.flush();
  }
}
