import aos from "aos";
import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "node:path";

describe("AOS Tests", () => {
  let env: aos;

  beforeAll(async () => {
    const source = fs.readFileSync(
      path.join(__dirname, "./../src/main.lua"),
      "utf-8"
    );
    env = new aos(source);
    await env.init();
  });

  it("should respond with 'hello, world' for Action: hello", async () => {
    const response = await env.send({ Action: "hello" });
    expect(response.Messages[0].Data).toBe("hello, world");
  });

  it("should respond with 'You have send archlinux' for Action: data", async () => {
    const response = await env.send({ Action: "data", Data: "archlinux" });
    expect(response.Messages[0].Data).toBe("You have send archlinux");
  });

  it("should respond with the correct carname value for Action: tag", async () => {
    const response = await env.send({
      Action: "tag",
      Tags: [{ carname: "tesla" }],
    });
    expect(response.Messages[0].Data).toBe(
      "The Key is `carname` and the value is tesla"
    );
  });

  it("should add a key-value pair for Action: set", async () => {
    const response = await env.send({
      Action: "set",
      Tags: [{ key: "blockchain" }, { value: "aos" }],
    });
    expect(response.Messages[0].Data).toBe(
      "Added blockchain as key and aos as value"
    );
  });

  it("should retrieve the correct value for Action: get", async () => {
    const response = await env.send({
      Action: "get",
      Tags: [{ keys: "blockchain" }],
    });
    expect(response.Messages[0].Data).toBe("The value for blockchain is aos");
  });
});
