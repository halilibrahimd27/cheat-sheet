"use strict";
// Environment variables that reconfigure server.js. A developer with any of these
// exported in their shell would silently reconfigure the whole suite — AUTH_PASS
// alone turns every request into a 401 — so tests clear them and opt back in
// explicitly, per test, instead of inheriting whatever the shell happens to hold.
const CONFIG_VARS = ["AUTH_PASS", "AUTH_USER", "HOST", "PORT", "JSON_LIMIT", "DATA_DIR", "ALLOWED_HOSTS"];

// Strip the config vars from THIS process. Must run before require("../server.js"),
// because server.js snapshots them into module-level constants at require time.
function scrubProcessEnv() {
  for (const k of CONFIG_VARS) delete process.env[k];
}

// A child-process env with the config vars cleared, plus this test's own overrides.
function childEnv(overrides) {
  const env = Object.assign({}, process.env);
  for (const k of CONFIG_VARS) delete env[k];
  return Object.assign(env, overrides || {});
}

module.exports = { CONFIG_VARS, scrubProcessEnv, childEnv };
