import fs from "fs";
import AoLoader from "@permaweb/ao-loader";
export default class AOS {
  wasm = fs.readFileSync("/./../process.wasm");
  code: string;
  process_id: string;
  module_id: string;
  owner: string;
  from: string;
  height: number;
  memory: null | ArrayBuffer;
  constructor(
    code: string,
    process_id = "9876",
    module_id = "9876",
    owner = "Arweave",
    from = "John"
  ) {
    this.code = code;
    this.process_id = process_id;
    this.module_id = module_id;
    this.height = 1;
    this.owner = owner;
    this.from = from;
    this.memory = null;
  }
  async init() {
    const handle = await AoLoader(this.wasm, {
      format: "wasm64-unknown-emscripten-draft_2024_02_15",
    });
    const env = this.createEnv();
    const msg = this.createMsg(this.code, [{ name: "Action", value: "Eval" }]);
    const result = await handle(null, msg, env);
    this.memory = result.Memory;
    return result;
  }
  private createMsg(
    data?: string,
    Tags?: Array<{ name: string; value: string }>
  ) {
    return {
      Id: this.height,
      Target: "AOS",
      Owner: this.owner,
      Data: data?.length ? data : "",
      "Block-Height": this.height.toString(),
      Timestamp: Date.now().toString(),
      Module: this.module_id,
      From: this.from,
      Cron: false,
      Tags: Tags?.length ? Tags : [],
    };
  }
  private createEnv() {
    return {
      Process: {
        Id: this.process_id,
        Tags: [
          { name: "Data-Protocol", value: "ao" },
          { name: "Variant", value: "ao.TN.1" },
          { name: "Type", value: "Process" },
        ],
        Owner: this.owner,
      },
      Module: {
        Id: this.module_id,
        Tags: [
          { name: "Data-Protocol", value: "ao" },
          { name: "Variant", value: "ao.TN.1" },
          { name: "Type", value: "Module" },
        ],
      },
    };
  }
}
