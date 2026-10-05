# Web Games release 0.0.8

Phases 1 and 2 add a small static application at `/games/` to the existing Astro
site. Astro copies `public/games` into its output; no framework, third-party
runtime, ad SDK or new npm dependency is added to the games. The home page gets
one small Games link above its existing footer.

## What is delivered

- Two-column icon grid, catalog validation/filtering/sorting, six SVG icons,
  hash routes, semantic theme tokens, localization and daily-content utilities.
- Word Match: match four words to their meanings, with retry after mistakes.
- Word Scramble: solve three clued words by selecting shuffled letter tiles.
- Daily completion badges, themed result screen, reduced-motion support,
  loading failures with retry, and standalone local-storage persistence.
- English, Hindi and Marathi UI/content. All other requested language codes
  fall back to English; missing individual UI strings also fall back to English.
- Mini Sudoku, Sequence, Maze and Number Grid remain disabled in the catalog.
  The summary counts enabled/compatible games, so this release shows “of 2”.

## Run and verify

Use the repository's normal `npm ci` and `npm run dev`. Visit `/games/`.
`/games/?test=1` reveals standalone test settings: light/dark, language,
one temporary completion badge, and clearing test progress. These controls are
never shown in embedded mode. Ordinary standalone use has no rewarded-ad gate.

Run `npm run test:games` for Node unit tests. Run
`npx playwright install chromium` once, then `npm run test:games:mobile` for
browser checks. The browser suite starts its own ephemeral local static server.
It covers widths 320, 360, 390, 412 and 480, light/dark, gameplay, persistence,
localization, host state, date changes and resource retry. Screenshots go to
ignored `test-results/games/`. The Games checks workflow runs tests and the full
Astro build on the release branch and on pull requests to main.

## Content and caching

`games.json` owns IDs, names, icons, enabled flags, ordering and compatibility.
Optional `apps` and `languages` arrays restrict visibility; omitting them allows
all hosts/languages. Routes and icons must be local identifiers, never URLs.
Each enabled route lazy-loads `games/<path>.mjs` with the shared mount contract.

`words-1` datasets have six distinct daily sets per language per game. A
date-indexed rotation selects a set without adjacent-day repeats; a seed derived
from game ID, date, content version and language shuffles its order. Thus sets
cycle after six days, while tile/order arrangements vary. Expand the datasets
in a new content version when adding longer-term variety. Unicode grapheme
segmentation keeps vowel signs and conjuncts together. Engines without
`Intl.Segmenter` use English puzzles. Hints define the intended scramble answer.

Keep assets under stable `public/games/` paths. Release numbers belong in Git
branch names, not directory names. Shared modules, styles and the catalog live
directly in this directory; game implementations and icons have their own
subdirectories. The catalog is fetched with revalidation. Dataset/generator
versions remain independent of release branches to control daily puzzle content.

## Future native bridge contract

Phase 3 still needs the Android module, secure WebView configuration,
rewarded-ad gate, native persistence and testing in all five apps.

Load `/games/?embedded=1`. Embedded mode waits for native configuration and
does not read browser storage or browser dates for completion entitlement.
Native code should install `AndroidGames.postMessage(json)` before loading the
page, listen for `onReady`, then call `window.SmartUpGames.configure(config)`.
Use safe JSON serialization/evaluation, not string interpolation of untrusted
values. The web API accepts an object or serialized JSON and returns success.

Example configuration:

```json
{
  "bridgeVersion": 1,
  "appId": "net.smartlogic.example",
  "appVersion": "1.0",
  "language": "hi-IN",
  "locale": "hi-IN",
  "date": "2026-10-05",
  "timezone": "Asia/Kolkata",
  "completions": {"word_match": "2026-10-05"},
  "theme": {
    "mode": "light",
    "background": "#FAF9F6",
    "surface": "#FFFFFF",
    "primaryText": "#252B2B",
    "secondaryText": "#626B68",
    "accent": "#276653",
    "divider": "#D8DFDA"
  }
}
```

Theme colors accept six-digit hex. Host tokens replace standalone defaults;
native owners must supply accessible contrasts. Completion state is a generic
mapping from safe permanent game IDs to host-local completion dates.

All outbound events use one JSON envelope: `type`, `bridgeVersion`, optional
`gameId`, authoritative `date`, and optional `result` or `errorCode`. Types are
`onReady`, `onGameStarted`, `onGameCompleted`, `onGameExited`, `onError`.
The same envelope is dispatched as browser `games:event` CustomEvents for
testing. Progress emits a local `games:progress` event; it is not a new required
native bridge method. Completion is emitted once per current in-memory daily
session and native persistence must also be idempotent across reloads.

The host must persist completion on callback and include the current mapping
in every configuration after reload. Web memory provides an immediate badge
until native state is received; browser persistence is only for standalone
testing. Exiting or opening a game never marks it complete. Partial answers
reset on reload/re-entry. Clearing browser storage resets standalone history.

Native date changes should send a fresh configuration. Configuration exits an
active game under its previous date before switching to the new day; theme or
language reconfiguration also restarts partial play. Standalone midnight shows
an explicit refresh prompt and rejects old-day completion. Native lifecycle,
clock policy and runtime updates belong to Phase 3.

Only expose the native bridge on an exact allowlisted HTTPS origin and `/games/`
path; restrict navigation, reject arbitrary messages and never compile a game
enum into Android. No web code grants native ad rewards.

## Verification record

Local Node tests pass, including 800 consecutive dates for four language codes,
catalog validation, leap dates, host validation, answer checking, translation
fallback and corrupt/unavailable storage. Full Astro build and browser tests
are also required CI gates; see the pull request checks for their final results.
Native integration and device testing are outside Phases 1 and 2.
