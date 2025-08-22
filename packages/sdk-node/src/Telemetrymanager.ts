// TelemetryManager.ts
import * as schema from "./interfaces/telemetryevent.js";
import * as storage from "./interfaces/storage.js";

export class TelemetryManager {
  private buffer: schema.TelemetryEvent[] = [];
  private isFlushing = false;
  private timer?: NodeJS.Timeout;

  constructor(
    private storage: storage.StorageProvider,
    private flushInterval: number = 5000 // ms
  ) {
    // auto flush every flushInterval
    this.timer = setInterval(() => void this.flush(), this.flushInterval);
  }

  // add event to buffer, optionally flush if buffer too big
  addEvent(event: schema.TelemetryEvent) {
    this.buffer.push(event);
    if (this.buffer.length >= 10) {
      void this.flush();
    }
  }

  // flush buffer to storage
  async flush() {
    if (this.isFlushing) return; // prevent concurrent flush
    if (this.buffer.length === 0) return;

    this.isFlushing = true;

    // atomic buffer swap
    const toSave = this.buffer.splice(0, this.buffer.length);

    try {
      if (typeof this.storage.saveBatch === "function") {
        await this.storage.saveBatch(toSave);
      } else {
        // fallback: call save individually
        await Promise.all(toSave.map(e => this.storage.save(e)));
      }
    } catch (err) {
      console.error("Flush failed:", err);
    } finally {
      this.isFlushing = false;
    }
  }

  // shutdown: stop timer + flush pending events
  async shutdown() {
    if (this.timer) clearInterval(this.timer);
    await this.flush();
  }
}
