import { OpenAIProvider } from "./providers/OpenAIprovider.js";
import { JSONStorage } from "./storage/jsonStorage.js";
import { TelemetryManager } from "./Telemetrymanager.js";

async function main(filepath:string,apikey:string,prompt:string,parent_call_id?:string){
    const storage=new JSONStorage(filepath ?? "./telemetry.json")
    const manager=new TelemetryManager(storage)
    const provider= new OpenAIProvider(apikey)
    const event=await provider.callModel(prompt,parent_call_id)

    manager.addEvent(event)
    manager.shutdown()

}