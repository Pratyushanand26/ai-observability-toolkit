import type schema = require("./telemetryevent.js");

export interface StorageProvider {
  save(event: schema.TelemetryEvent): Promise<void>;
}
