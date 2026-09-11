"use strict";
// Boot server.js as a real child process on an isolated DATA_DIR.
//
// The auth gate is installed at require() time from a module-level constant, so
// it simply cannot be exercised by require()-ing the app into the test process:
// only a fresh process with AUTH_PASS set in its environment reaches that code.
const { spawn } = require("child_process");
const net = require("net");
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { childEnv } = require("./env.js");

const SERVER_JS = path.join(__dirname, "..", "..", "server.js");

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const p = probe.address().port;
      probe.close(() => resolve(p));
    });
  });
}

async function startServer(overrides) {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "cheatsheet-child-"));
  const port = await freePort();
  const env = childEnv(Object.assign({ DATA_DIR: dataDir, HOST: "127.0.0.1", PORT: String(port) }, overrides));
  const child = spawn(process.execPath, [SERVER_JS], { env, stdio: ["ignore", "pipe", "pipe"] });
  let out = "";
  child.stdout.on("data", (d) => { out += d; });
  child.stderr.on("data", (d) => { out += d; });

  await new Promise((resolve, reject) => {
    const onExit = (code) => { clearTimeout(timer); reject(new Error("server exited early (" + code + "):\n" + out)); };
    const timer = setTimeout(() => { child.off("exit", onExit); reject(new Error("server did not start:\n" + out)); }, 20000);
    child.on("exit", onExit);
    const tick = () => {
      if (/running on/.test(out)) { clearTimeout(timer); child.off("exit", onExit); return resolve(); }
      setTimeout(tick, 20);
    };
    tick();
  });

  return {
    base: "http://127.0.0.1:" + port,
    port,
    dataDir,
    output: () => out,
    async stop() {
      await new Promise((resolve) => { child.once("exit", resolve); child.kill(); });
      fs.rmSync(dataDir, { recursive: true, force: true });
    },
  };
}

// fetch() normalises "/../x" out of a URL before it ever hits the wire, which is
// exactly the thing a traversal test needs to send. http.request passes the raw
// request-target through untouched.
function rawRequest(port, method, requestPath, opts) {
  const o = opts || {};
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port, method, path: requestPath, headers: o.headers || {} },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON body */ }
          resolve({ status: res.statusCode, headers: res.headers, text, json });
        });
      }
    );
    req.on("error", reject);
    if (o.body !== undefined) req.write(o.body);
    req.end();
  });
}

module.exports = { startServer, rawRequest, freePort };
