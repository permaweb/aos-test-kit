import AOS from "./aos";
import { test } from "node:test";
import * as assert from "node:assert";
import fs from "fs";
test("load source", async () => {
  const source = fs.readFileSync("/./../src/main.lua", "utf-8");
  const env = new AOS(source);
  const data = await env.init();
  console.log(data);
});
