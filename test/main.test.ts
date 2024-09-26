import AOS from "./aos";
import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "node:path";

describe("AOS Tests", () => {
  it("load source", async () => {
    const source = fs.readFileSync(
      path.join(__dirname, "./../src/main.lua"),
      "utf-8"
    );
    const env = new AOS(source);
    await env.init();
    expect((await env.send({ Action: "hello" })).Messages[0].Data).toBe(
      "hello, world"
    );
    expect(
      (await env.send({ Action: "data", Data: "archlinux" })).Messages[0].Data
    ).toBe("You have send archlinux");
    expect(
      (await env.send({ Action: "tag", Tags: [{ carname: "tesla" }] }))
        .Messages[0].Data
    ).toBe("The Key is `carname` and the value is tesla");
  });
});
