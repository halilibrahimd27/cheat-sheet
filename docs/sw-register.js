/* GENERATED FILE — DO NOT EDIT. Built from public/ + seed.js by scripts/build-static.js. */
// Service-worker registration. Lives in its own file (not inline in index.html)
// so the page can ship a CSP with script-src 'self' and no 'unsafe-inline'.
//
// The path is deliberately RELATIVE: it resolves against the document base URL,
// which is "/" for the Express build and "/<repo>/" for the static GitHub Pages
// build, so one line works for both without a build-time rewrite.
(function () {
  "use strict";
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").catch(function () {});
  });
})();
