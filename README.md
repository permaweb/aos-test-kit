# AOS Test Kit Template

This repository provides a simple template for building and testing AOS processes. The goal is to enable developers to use TDD (Test-Driven Development) to construct and validate their AOS processes efficiently. The template includes local test support and options for deployment via trunk-based development.

## How Does It Work?

Clone or create a new repository using this template, and you can begin using test-driven development to build your AOS processes. By writing tests for each step of your process, you ensure that your code is well-structured, testable, and easy to maintain. To Load aos environment paste the following code into your test file:

```ts
import aos from "aos";
const env = new aos(source_code);
```

## First Test

In the `test/main.test.ts` file, after setting up your environment, you can begin by loading a simple AOS source file, like `src/main.lua`. Here's an example test that checks for a response when sending the `Action: "hello"` command:

```ts
it("should respond with 'hello, world' for Action: hello", async () => {
  const response = await env.send({ Action: "hello" });
  assert.equal(response.Messages[0].Data, "hello, world");
});
```

Save and run your test suite using:

```bash
yarn test
```

## Writing More Tests

You can expand your test suite to cover a variety of actions, input data, and tags. Below are some additional test examples.

1. **Action: data** – Check for a response when sending some data:

```ts
it("should respond with 'You have send archlinux' for Action: data", async () => {
  const response = await env.send({ Action: "data", Data: "archlinux" });
  assert.equal(response.Messages[0].Data, "You have send archlinux");
});
```

2. **Action: tag** – Validate key-value pairs sent as tags:

```ts
it("should respond with the correct carname value for Action: tag", async () => {
  const response = await env.send({
    Action: "tag",
    Tags: [{ carname: "tesla" }],
  });
  assert.equal(
    response.Messages[0].Data,
    "The Key is `carname` and the value is tesla"
  );
});
```

3. **Action: set** – Add a key-value pair:

```ts
it("should add a key-value pair for Action: set", async () => {
  const response = await env.send({
    Action: "set",
    Tags: [{ key: "blockchain" }, { value: "aos" }],
  });
  assert.equal(
    response.Messages[0].Data,
    "Added blockchain as key and aos as value"
  );
});
```

4. **Action: get** – Retrieve the value of a specific key:

```ts
it("should retrieve the correct value for Action: get", async () => {
  const response = await env.send({
    Action: "get",
    Tags: [{ keys: "blockchain" }],
  });
  assert.equal(response.Messages[0].Data, "The value for blockchain is aos");
});
```

## Running Tests

You can run the test suite using Node Test runner or another testing framework by executing:

```bash
yarn test
```

Make sure that your src/main.lua file is properly loaded and contains the logic you're testing.

## Manual Deployment

You can manually deploy your AOS process by running the following commands:

```bash
yarn i --no-fund -g https://get_ao.g8way.io
aos --load src/main.lua
```

This command will load and deploy the process defined in src/main.lua onto your local AOS instance.

## Deployment to AOS

You can deploy your AOS process to the AOS instance by running the following commands:

```bash
yarn i --no-fund -g https://get_ao.g8way.io
aos --load src/main.lua
```

## Deployment Setup

To set up deployment for your AOS process using this repository, you'll need to configure a few secrets in your GitHub repository:

- **Process Identifier**: `AOS`
- **Deployment Key**: `KEYFILE` (you should base64 encode this key)

If you don't have a deployment key, use `~/.aos.json` as the default location for your key file.

## SQLite Process Testing and LLama Process Testing

For more advanced scenarios involving state management, you may use SQLite and LLama to test your process's interaction with data. This feature is coming soon, and more documentation will follow.

## Contributions

If you find this template useful or have suggestions for improvements, please feel free to submit issues or pull requests. We're committed to keeping the template simple and user-friendly.

### Principles

- **Ease of Use**: The process should be intuitive for developers of all experience levels.
- **AOS Console Emulation**: The tests should feel like typing commands into the AOS console.
- **Fun and Efficient Testing**: Building AOS processes should be enjoyable, and testing them should be smooth and hassle-free.
