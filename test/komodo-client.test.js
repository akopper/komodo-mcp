import assert from "node:assert/strict";
import { test } from "node:test";
import { KomodoClient } from "../dist/komodo-client.js";

const originalFetch = global.fetch;

function restoreFetch() {
  global.fetch = originalFetch;
}

test("request returns parsed JSON on success", async (t) => {
  t.after(restoreFetch);
  let calls = 0;
  global.fetch = async (_input, _init) => {
    calls++;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const client = new KomodoClient({
    address: "http://example.com",
    apiKey: "key",
    apiSecret: "secret",
  });

  const result = await client.listServers();
  assert.deepEqual(result, { ok: true });
  assert.equal(calls, 1);
});

test("request aborts after timeout", async (t) => {
  t.after(restoreFetch);
  global.fetch = (_input, init) =>
    new Promise((_, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    });

  const client = new KomodoClient({
    address: "http://example.com",
    apiKey: "key",
    apiSecret: "secret",
    timeoutMs: 10,
  });

  await assert.rejects(client.listServers(), /timed out/);
});

test("retries transient read failures and eventually succeeds", async (t) => {
  t.after(restoreFetch);
  let calls = 0;
  global.fetch = async (_input, _init) => {
    calls++;
    if (calls === 1) {
      return new Response(JSON.stringify({ message: "server busy" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };

  const client = new KomodoClient({
    address: "http://example.com",
    apiKey: "key",
    apiSecret: "secret",
  });

  const result = await client.listServers();
  assert.deepEqual(result, { ok: true });
  assert.equal(calls, 2);
});

test("non-OK responses include parsed error context", async (t) => {
  t.after(restoreFetch);
  global.fetch = async (_input, _init) =>
    new Response(JSON.stringify({ error: "invalid request" }), { status: 400 });

  const client = new KomodoClient({
    address: "http://example.com",
    apiKey: "key",
    apiSecret: "secret",
  });

  await assert.rejects(
    client.listServers(),
    /Komodo API read \(ListServers\) returned 400: invalid request/
  );
});
