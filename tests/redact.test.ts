import test from "node:test";
import assert from "node:assert/strict";
import { redactContent } from "../src/redact.js";

test("redacts secret-looking assignments", () => {
  const result = redactContent("config.txt", "API_TOKEN=super-secret-token-value\nplain=value\n");
  assert.match(result.content, /API_TOKEN=\[REDACTED:secret\]/);
  assert.doesNotMatch(result.content, /super-secret-token-value/);
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0]?.pattern, "token-assignment");
});

test("redacts private key blocks", () => {
  const input = "-----BEGIN PRIVATE KEY-----\nabc123secret\n-----END PRIVATE KEY-----";
  const result = redactContent("key.pem", input);
  assert.equal(result.content, "[REDACTED:private-key-block]");
  assert.equal(result.findings[0]?.count, 1);
});
