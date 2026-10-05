# Web Games release 0.0.8

Phases 1, 2, 4 and 5 add a small static application at `/games/` to the existing Astro
site. Astro copies `public/games` into its output; no framework, third-party
runtime, ad SDK or new npm dependency is added to the games. The home page gets
one small Games link above its existing footer.

## What is delivered

- Three-column icon grid, catalog validation/filtering/sorting, nine SVG icons,
  hash routes, semantic theme tokens, localization and daily-content utilities.
- Word Match: match four words to their meanings, with retry after mistakes.
- Word Scramble: solve three clued words by selecting shuffled letter tiles.
- Daily completion badges, themed result screen, reduced-motion support,
  loading failures with retry, and standalone local-storage persistence.
- English, Hindi and Marathi UI/content. All other requested language codes
  fall back to English; missing individual UI strings also fall back to English.
- Mini Sudoku: a 4 × 4 board with 2 × 2 boxes, fixed clues, uniqueness checking,
  conflict feedback and editable/erasable answers using an on-screen keypad.
- Sequence: three multiple-choice patterns with explicit rule-family hints.
- Maze: a solvable 6 × 6 maze, directional controls, keyboard and adjacent-cell
  tapping; move the dot to the vector flag.
- Number Grid: tap shuffled numbers 1–16 in order, without a countdown.
- Shape Fit, Pipe Connect and Code Breaker: daily touch-friendly puzzles (details below).
- All nine games are enabled. The summary counts enabled/compatible games.
- Compact landing cards use distinct theme tokens, names and tick-only completion
  badges, with circular daily progress above. Programmatically focused titles have no outline;
  interactive controls retain visible keyboard focus.

## WebView layout

The landing page has top spacing, circular progress and compact three-column cards;
there is no visible Games heading, subtitle or promotional line. The Android
app bar belongs to the host. A screen-reader-only heading preserves structure.
Card descriptions and visible completion labels are omitted; tick badges and
accessible completion labels remain. The return message appears only when every
enabled game is complete: “Come back tomorrow to play again”. Empty catalogs
never show that message. The layout is tested with all nine catalog entries.

Game pages use one compact row for back, game name and Reset, in the same place
for every game. Reset restarts the same daily puzzle, clears unfinished moves and
rounds, and preserves other completion badges. It does not emit another start
or completion event or unlock a completed game. Answer/cell clearing stays local
to its keypad with an explicit label, distinct from resetting the entire game.
A collapsed How to play box below the toolbar contains three numbered steps,
game-specific caveats and the daily/reset rules in English, Hindi and Marathi.
Expanding it reveals instructions inline; long instructions scroll within the
panel and short viewports may scroll while expanded. Collapse it to restore
the full no-scroll playing surface. CSS sizes boards against the actual viewport height
using dynamic viewport units, with a fallback for older engines. Resizing does
not restart the game. Standard controls keep a minimum 44px touch height.

Android must give the WebView only the space between its native app bar and
bottom navigation, and apply system insets outside it. Embedded pages do not
add those vertical insets again. Do not wrap the WebView in a native ScrollView.
No host-bar height is guessed or subtracted in JavaScript. Browser tests verify
landing and all nine games at usable sizes 320×440, 360×480, 390×560 and 412×620
in English, Hindi, Marathi and English-fallback Gujarati, with no page overflow
or clipped controls. Extremely small windows or enlarged accessibility text may
scroll so content stays reachable; scrolling is never disabled to hide overflow.

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
Optional `tone` selects a validated decorative category token. Standalone themes
provide six subdued palettes. Embedded hosts can supply category Accent/Surface
tokens; otherwise these derive from the host accent and surface.

`words-1` datasets have six distinct daily sets per language per game. A
date-indexed rotation selects a set without adjacent-day repeats; a seed derived
from game ID, date, content version and language shuffles its order. Thus sets
cycle after six days, while tile/order arrangements vary. Expand the datasets
in a new content version when adding longer-term variety. Unicode grapheme
segmentation keeps vowel signs and conjuncts together. Engines without
`Intl.Segmenter` use English puzzles. Hints define the intended scramble answer.

`puzzles-1` generates the four numeric/spatial games from game ID, date and
generator version. Sudoku removes clues only while retaining one solution;
its first clue cycles daily, preventing identical consecutive puzzles. Sequence
uses addition, multiplication and consecutive squares, with one correct option
per round. Maze uses a spanning-tree traversal with alternating start exits;
all cells are reachable and consecutive layouts differ. Number Grid shuffles
all 16 values and rotates the position of 1 each day. No puzzle requires a timer.

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

The catalog now contains nine games. Shape Fit uses a daily connected-piece
partition of a 4×4 square, with pointer dragging and keyboard/tap placement.
The selected cell anchors the top-left of the piece bounding box; pieces keep
their orientation. Reset restarts placements. Any non-overlapping full tiling wins.
Pipe Connect rotates a solvable daily 4×4 pipe layout clockwise. Any connected
route from S to E wins; unused pipes need not connect. Code Breaker uses four
distinct digits from 1–6, unlimited guesses, exact/misplaced clues and the last
three guesses in a fixed-height history. No game needs a native keyboard.
All three reuse daily completion, host events, semantic themes and localized
English/Hindi/Marathi UI (other languages use the existing English fallback).
Generator tests cover 800 dates; browser checks play all nine games to completion,
including dragging, and check the new surfaces at 320×440 and larger WebViews.

Local Node tests pass, including 800 consecutive dates for four language codes,
catalog validation, leap dates, host validation, answer checking, translation
fallback and corrupt/unavailable storage. Generator tests cover another 800
dates for Sudoku uniqueness, maze connectivity and symmetric walls, sequence
answers, complete number permutations and non-consecutive repeats. Full Astro build and browser tests
are also required CI gates; see the pull request checks for their final results.
Native integration and physical-device testing remain Phase 3 work.
