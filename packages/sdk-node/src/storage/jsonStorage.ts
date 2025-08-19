import * as schema from "../interfaces/telemetryevent.js";
import * as storage from "../interfaces/storage.js";
import fs from "fs"

export class JSONStorage implements storage.StorageProvider {
  private file: string;

  constructor(filePath: string = "telemetry.json") {
    this.file = filePath;
  }

  async save(event:schema.TelemetryEvent) {
    const existing = fs.existsSync(this.file)
      ? JSON.parse(fs.readFileSync(this.file, "utf-8"))
      : [];
    existing.push(event);
    fs.writeFileSync(this.file, JSON.stringify(existing, null, 2));
  }
}
