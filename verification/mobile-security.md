# Ghana mobile map pass

- One visible Explore action. Search, zoom and reset are inside one explicit panel, with no drop-downs or auto-hiding controls.
- Warm OpenFreeMap style, content, palette and attribution preserved. Closer places form tappable clusters; individual place dots retain 44px hit areas.
- Calm motion is the default. Search, selection and reset use immediate camera changes.
- Details fit 320px, scroll to the final actions, keep Close available and return keyboard focus after closing.
- Existing static photos now bypass the server-only image optimizer, so the static export serves its own images. Existing missing-photo placeholders remain where the dataset has no photo.
- MapLibre pinned to 6.18.0; its module worker is copied from the installed package during prebuild. Read-only `_warmMap` handle lets browser checks reject a blank canvas using loaded style and rendered features.
- Next, lint and transitive dependencies updated for a zero-finding pnpm audit. The ESLint flat config keeps the prior Next core checks; four newly introduced compiler rules are not enabled on legacy components. The existing sidebar skeleton's random render width is now deterministic.
- Validation: frozen install, lint, TypeScript, production export, audit, then six Chromium production-browser scenarios covering every dataset place at 320/390/1280 in normal and reduced motion, search/no-results/clear, reset/zoom, cluster activation, close/Escape/focus return and loaded map features.
- Browser suite uses the built static export, not a dev server. No physical iPhone/Safari claim.
- Before and after 390px evidence is in `verification/mobile/`.

Security reference: https://github.com/advisories/GHSA-jrc7-96c5-q579 (affected <=6.4.0, first patched 6.4.1).
