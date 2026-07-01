// Flat ESLint config (ESLint v9). Catches real bugs (dupe keys, unreachable
// code, undeclared vars) across the Node backend and the browser frontend
// without pulling in extra dependencies.
"use strict";

const nodeGlobals = {
  require: "readonly", module: "writable", exports: "writable",
  process: "readonly", __dirname: "readonly", __filename: "readonly",
  console: "readonly", Buffer: "readonly", URL: "readonly", fetch: "readonly",
  setTimeout: "readonly", clearTimeout: "readonly",
  setInterval: "readonly", clearInterval: "readonly",
};

const browserGlobals = {
  window: "readonly", document: "readonly", navigator: "readonly",
  localStorage: "readonly", fetch: "readonly", FileReader: "readonly",
  Blob: "readonly", URL: "readonly", alert: "readonly", confirm: "readonly",
  prompt: "readonly", console: "readonly",
  setTimeout: "readonly", clearTimeout: "readonly",
};

const swGlobals = {
  self: "readonly", caches: "readonly", fetch: "readonly",
  Promise: "readonly", URL: "readonly", console: "readonly",
  Response: "readonly",
};

const commonRules = {
  "no-undef": "error",
  "no-dupe-keys": "error",
  "no-dupe-args": "error",
  "no-unreachable": "error",
  "no-cond-assign": "error",
  "no-constant-condition": ["error", { checkLoops: false }],
  "no-unused-vars": ["warn", { args: "none" }],
};

module.exports = [
  { ignores: ["node_modules/**", "data/**", "seed.js"] },
  {
    files: ["server.js", "scripts/**/*.js", "test/**/*.js", "eslint.config.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: nodeGlobals },
    rules: commonRules,
  },
  {
    files: ["public/app.js", "public/checklist-templates.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: browserGlobals },
    rules: commonRules,
  },
  {
    files: ["public/service-worker.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: swGlobals },
    rules: commonRules,
  },
];
