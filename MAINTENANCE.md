# Dependency maintenance

This update uses Node 24.21.0 LTS, Astro 7.3.5, the current React integration,
React 19.3, Firebase 12.19, Vitest 5 and current compatible test/format tooling.
TypeScript stays on 6.0.3 because Astro Check currently supports versions 5/6.

The existing Pages deployment workflow keeps its manual/main-branch triggers,
environment and permissions; its obsolete Node 20 and action versions are
updated. A separate pull-request workflow is read-only and never deploys.

`npm ci --no-audit --no-fund` keeps installation separate from the explicit
full registry audit. The approved audit identified patched transitive issues:
`fast-uri` is now 3.1.8 within AJV's supported range, and a Firestore-scoped
override selects `@grpc/grpc-js` 1.14.5. Current Firebase 12.19/Firestore 4.17.2
still declare grpc `~1.9.0`; the override needs review when upstream changes.
[grpc 1.14.5](https://github.com/grpc/grpc-node/releases/tag/@grpc%2Fgrpc-js@1.14.5)
and [fast-uri 3.1.8](https://github.com/fastify/fast-uri/releases/tag/v3.1.8)
are their upstream security releases. Tests exercise Firestore's actual
proto-loader/grpc API boundary through a synthetic loopback RPC, plus offline
SDK construction/termination. This does not validate production Firebase access.

The full audit still reports two high package findings for one unpatched
[http-cache-semantics advisory](https://github.com/advisories/GHSA-ch52-4w7c-c8xp).
The narrow gate expires on 2026-11-03 and requires Astro 7.3.5, cache 4.2.0,
exact dependency paths and the SHA-256 of Astro's installed remote-image call
site. That call site only calculates image expiry with `storable/timeToLive`;
it does not invoke the affected request-matching/max-stale method. The static
build is additionally scanned for the held implementation/import and grpc.
Changed/new findings, paths, versions or call-site content fail the gate.
Full audit JSON and reachability evidence are archived in CI; this is not a
zero-vulnerability result. A synthetic regression suite covers exception expiry
and fail-closed handling of additional findings and invalid reports.

Type checks, unit tests, build and preview inherit a verification-only Node
fetch/socket guard, with intentional forbidden-request regressions. Production
configuration is unchanged. Browser traffic is loopback-only through a closed
proxy; existing remote Google Fonts CSS is blocked and recorded, so screenshots
show the system-font fallback. No Firebase or customer services are contacted.

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
