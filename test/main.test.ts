import aos from "aos";
import fs from "fs";
import path from "node:path";
import assert from "node:assert";
import { describe, test, before } from "node:test";
describe("AOS Tests", () => {
  let env: aos;

  before(async () => {
    const source = fs.readFileSync(
      path.join(__dirname, "./../src/main.lua"),
      "utf-8"
    );

    env = new aos(source);
    await env.init();
  });

  test("should respond with 'hello, world' for Action: hello", async () => {
    const response = await env.send({ Action: "hello" });
    assert.equal(response.Messages[0].Data, "hello, world");
  });

  test("should respond with 'You have send archlinux' for Action: data", async () => {
    const response = await env.send({ Action: "data", Data: "archlinux" });
    assert.equal(response.Messages[0].Data, "You have send archlinux");
  });

  test("should respond with the correct carname value for Action: tag", async () => {
    const response = await env.send({
      Action: "tag",
      Tags: [{ carname: "tesla" }],
    });
    assert.equal(
      response.Messages[0].Data,
      "The Key is `carname` and the value is tesla"
    );
  });

  test("should add a key-value pair for Action: set", async () => {
    const response = await env.send({
      Action: "set",
      Tags: [{ key: "blockchain" }, { value: "aos" }],
    });
    assert.equal(
      response.Messages[0].Data,
      "Added blockchain as key and aos as value"
    );
  });

  test("should retrieve the correct value for Action: get", async () => {
    const response = await env.send({
      Action: "get",
      Tags: [{ keys: "blockchain" }],
    });
    assert.equal(response.Messages[0].Data, "The value for blockchain is aos");
  });
});
