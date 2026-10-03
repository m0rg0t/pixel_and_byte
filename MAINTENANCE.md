# Dependency maintenance

This update uses Node 24.21.0 LTS, Astro 7.3.5, the current React integration,
React 19.3, Firebase 12.19, Vitest 5 and current compatible test/format tooling.
TypeScript stays on 6.0.3 because Astro Check currently supports versions 5/6.

The existing Pages deployment workflow keeps its manual/main-branch triggers,
environment and permissions; its obsolete Node 20 and action versions are
updated. A separate pull-request workflow is read-only and never deploys.

`npm ci --no-audit --no-fund`, `npm run check`, `npm test` and `npm run build`
verify the maintained lockfile. Installation does not perform an implicit
registry graph audit. No live registry audit result or clean-audit claim is
included. Astro's dependency graph still includes the unpatched build-time
[http-cache-semantics advisory](https://github.com/advisories/GHSA-ch52-4w7c-c8xp);
the published site is static and does not ship the Node build dependencies.

New regression coverage verifies:

- Smooth glitch colors keep interpolating after the first `rgb()` frame
- Palette changes take effect; empty palettes remain usable
- Missing canvas contexts avoid useless animation work
- StrictMode, pending resize and unmount leave no duplicate/restarted frame loop
- Repeated batched accordion clicks use current state, with collapsed content
  correctly hidden from assistive technology

The browser gate starts its own loopback preview, uses sandbox-enabled Chrome,
blocks third-party requests and checks hydrated widgets, mobile/desktop layout,
team navigation/Back, the application catalog, article routes and RSS. It does
not use Firebase services, customer data or external communication APIs.

Source-only local verification uses hash-verified original imported PNGs. Full
public artwork is available in the GitHub checkout used for browser evidence.
Source content, brand artwork, routes and hosting configuration are preserved.
