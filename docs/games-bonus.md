# Optional rewarded Games set

The daily standalone experience and older Android hosts remain unchanged. This
change never loads ad SDKs or grants rewards in JavaScript. Android owns consent,
purchase restoration, Pro checks, SDK rewards and durable entitlement.

## Bridge version 1 extension

Hosts may supply `bonusRound` (0 or 1) plus `bonus` with boolean `enabled`,
`eligible`, `busy` and localized `title`, `message`, `watch`, `finished` strings.
Missing capability means no card. The card appears only after the whole catalog
is completed, when enabled/eligible and still on round 0. Pro hosts must send
`enabled:false`. All strings use textContent, never host-provided HTML.

The website emits `onCatalogReady` with `result.gameIds` and emits an explicit
`onBonusRequested` when the card button is tapped. All events include `date` and
`round`; old hosts may ignore new event types/fields. Android validates the
catalog and original completions and grants the bonus only on SDK earned reward.
It then configures round 1 with the second set's completion map. No second
reward card is rendered in round 1, even after every bonus game is completed.

Bonus puzzles select a deterministic different seed date but keep the real host
date for completion, bridge events and snapshot scope. Snapshots use a separate
`:bonus:` namespace, preserve first-set snapshots, and reject cross-round reuse.
Language/theme configuration does not reset a game. Unlock transitions to the
bonus catalog. Day rollover returns to the regular daily set under host control.

## Delivery

Requires the corresponding Today Android change. Keep this change in a separate
PR and release it deliberately before enabling Games bonuses in the app. This
PR does not deploy anything. The production rewarded AdMob unit is supplied
separately in Android; no ad IDs or ad scripts belong in this website.

## Verification

- `npm run test:games`: existing puzzle/state coverage plus fresh/deterministic
  second sets for all nine games and all ten languages, isolated snapshots,
  old-host compatibility and unsupported-round rejection.
- `npm run test:games:bonus`: browser coverage for Pro/legacy suppression,
  duplicate opt-in, busy/failure recovery, light/dark responsive result cards,
  a playable new bonus puzzle, reload restoration and no third-set offer.
- Full Android/WebView/AdMob device verification is separate from browser tests.

The browser script accepts optional `BROWSER_EXECUTABLE_PATH` for an existing
Chromium installation. Otherwise it uses Playwright's installed default browser.
