import fs from "fs";
import AoLoader, { handleFunction } from "@permaweb/ao-loader";
import path from "path";
interface Tag {
  name: string;
  value: string;
}

interface InputData {
  Data?: string;
  Tags?: Array<{ [key: string]: string | undefined }>;
  [key: string]:
    | string
    | Array<{ [key: string]: string | undefined }>
    | undefined;
}

interface OutputData {
  Data?: string;
  Tags: Tag[];
}

export default class aos {
  wasm = fs.readFileSync(path.join(__dirname) + "/../process.wasm");
  code: string;
  process_id: string;
  module_id: string;
  owner: string;
  from: string;
  height: number;
  memory: null | ArrayBuffer;
  handle: null | handleFunction;
  constructor(
    code: string,
    process_id = "4567",
    module_id = "9876",
    owner = "FOOBAR",
    from = "FOOBAR"
  ) {
    this.code = code;
    this.process_id = process_id;
    this.module_id = module_id;
    this.height = 0;
    this.owner = owner;
    this.from = from;
    this.memory = null;
    this.handle = null;
  }
  async init() {
    this.handle = await AoLoader(this.wasm, {
      format: "wasm64-unknown-emscripten-draft_2024_02_15",
    });
    const env = this.createEnv();
    const msg = this.createMsg(this.code, [{ name: "Action", value: "Eval" }]);
    const result = await this.handle(null, msg, env);
    this.memory = result.Memory;
    return result;
  }
  async send(DataItem: InputData) {
    if (this.handle) {
      const data = this.transformData(DataItem);
      const msg = this.createMsg(data.Data, data.Tags);
      const env = this.createEnv();
      const result = await this.handle(this.memory, msg, env);
      this.memory = result.Memory;
      return result;
    } else {
      throw new Error("handle not initalized");
    }
  }
  private createMsg(
    data?: string,
    Tags?: Array<{ name: string; value: string }>
  ) {
    this.height += 1;
    return {
      Id: this.height,
      Target: this.process_id,
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
  private transformData(input: InputData): OutputData {
    const output: OutputData = { Tags: [] };
    if (input.Data) output.Data = input.Data;
    Object.entries(input).forEach(([key, value]) => {
      if (key !== "Data" && key !== "Tags" && typeof value === "string") {
        output.Tags.push({ name: key, value });
      }
    });
    input.Tags?.forEach((tag) => {
      const tagKey = Object.keys(tag)[0];
      const tagValue = tag[tagKey];
      if (typeof tagValue === "string") {
        output.Tags.push({ name: tagKey, value: tagValue });
      }
    });

    return output;
  }
}
