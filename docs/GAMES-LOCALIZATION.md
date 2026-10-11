# Games localization and durable progress

Implementation branch: `codex/games-localization-progress`, based on
`0cf1dbb41430f1fa88aa60ae69aa9392925fae94`. This baseline identifies inspected
source, **not a verified deployment**. No deployment or merge is part of this work.

## Language resources and editing

The supported content languages are exactly English (`en`), Hindi (`hi`), French
(`fr`), German (`de`), Italian (`it`), Dutch (`nl`), Portuguese (`pt`), Greek (`el`),
Romanian (`ro`), and Spanish (`es`). English is the fallback, including for the
previously supported Marathi locale.

- `public/games/i18n.mjs`: central message/instruction registry and translator.
- `public/games/base-resources.mjs`: English/Hindi messages and detailed guides.
- `public/games/translations.mjs`: eight additional message packs. Each table row
  contains a key followed by French, German, Italian, Dutch, Portuguese, Greek,
  Romanian and Spanish translations. Preserve named placeholders.
- `public/games/games/word-data.mjs`: immutable `words-2` dictionaries, clues,
  accepted answers, stable content IDs and explicit grapheme tile boundaries.
- `public/games/games.json`: stable game IDs and `nameKey` references; never
  translate IDs or use locale in completion eligibility.

All ten packs provide 24 matching pairs and 18 clued scramble answers: six daily
sets per game/language. Answer matching uses NFC and the puzzle's explicit
content locale; meaningful accents are preserved. Tiles use the stored grapheme
boundaries even without `Intl.Segmenter`. Tests compare those boundaries with
the available segmenter; that is not linguistic review. Dataset revisions must
remain immutable. Introduce a new revision and retain compatible readers when
changing puzzle definitions in a later release.

There is no existing share feature or share text. This change does not add one.
The seven numeric/spatial games have language-neutral puzzle definitions; Word
Match and Word Scramble carry language-specific definitions and answers.

Regional tags such as `fr-CA`, `pt-PT`, `en-IN` and `en-GB` retain their canonical
locale for document language and numeric UI formatting. Content uses the base
language. Invalid/missing/unsupported language values select English. Other
host validation remains strict. Embedded configuration wins over URL preferences;
standalone retains its existing `lang`/`theme` query and preview settings.

## Session and integration behavior

`SmartUpGames.configure(JSON_STRING)` and object input both remain supported.
The call returns JavaScript boolean `true` synchronously after valid input;
invalid non-locale configuration returns `false`. `SmartUpGames.back()` still
returns to the catalog. Bridge event envelopes and `bridgeVersion: 1` are unchanged.
No Android source, permissions, ad requests, reservations, entitlement, or billing
rules are changed.

Same-app, same-date configuration updates the existing session's UI/theme and
host completions. The game controller keeps its puzzle and mutable state and
refreshes its view; it does not mount a new puzzle or announce another start.
The active route stays fixed. Confirmed same-day completions cannot be removed
by an incomplete language-refresh mapping. App-version and timezone changes
alone do not create a new opportunity.

Word puzzles pin their language, clues, answer sets and shuffled tiles when first
started. Their surrounding UI follows later language changes. A localized notice
explains this; puzzle text has its own language markup for assistive technology.
Reset uses that same pinned puzzle. New eligible puzzles use the new language.

The host's date string is authoritative in embedded mode. Date changes exit the
old session under its old date and apply existing new-day rules, including when
the date moves backwards. Standalone keeps its device-local day check, disabled
stale input and explicit refresh. No locale or UTC-derived date replaces the
host date. Existing standalone completion storage remains
`smartup.games.completions.v1`.

## Snapshot schema and migration

The storage schema version is independent of bridge v1.

```
smartup.games.progress.v1:<embedded|standalone>:<appId>:<YYYY-MM-DD>:<gameId>
smartup.games.progress.v1:<embedded|standalone>:<appId>:<YYYY-MM-DD>:_route
```

Each game record contains:

| Field | Meaning |
| --- | --- |
| `schema`, `mode`, `appId`, `date` | Validated storage version and host/day scope |
| `gameId`, `puzzleRevision`, `puzzleId` | Canonical game and immutable puzzle identity |
| `seedInputs`, `seed` | Deterministic generator inputs and actual seed(s) |
| `contentLanguage`, `puzzle` | Pinned content and full puzzle definition |
| `state` | Game-owned mutable fields listed below |
| `feedback`, `helpOpen` | Message key/parameters/kind and expanded instructions |
| `timer` | `{ "mode": "none" }`; none of the nine games measures elapsed time |
| `started` | Start dispatch has been reserved; hydration never announces it again |
| `status`, `result`, `completionDispatched` | Playing/finished state and reserved completion dispatch |

| Game | Mutable state |
| --- | --- |
| `word_match` | Matched pair IDs, left/right selection |
| `word_scramble` | Round and ordered chosen tile indices |
| `mini_sudoku` | Board and selected cell |
| `sequence` | Round and rejected answers |
| `maze` | Position and move count |
| `number_grid` | Next number; found cells derive from it |
| `shape_fit` | Placements and selected piece; no transient drag coordinates |
| `pipe_connect` | Pipe masks and move count |
| `code_breaker` | Current guess, attempt count and last three guesses; clues derive from those guesses |

The route record contains scope fields plus `route`, an enabled game path or the
empty home route. An explicit valid URL hash wins over the saved route. Visiting
home saves home without erasing individual games.

Game modules own state extraction, reset and rendering. Their shared session
helper checkpoints synchronously after click/key/pointer handlers, including
non-progress interactions, and completion explicitly snapshots before dispatch.
Initial state/start reservation and finished state/completion reservation are
saved before native notification. Pagehide/visibility saves are supplementary.

Limits: 64 KiB UTF-8 per game record and 2 KiB per route record, checked before
JSON parsing. Records validate scope, allowed fields, schema, revision, canonical
definition/seed, bounded values, board constraints, feedback, and finished result.
Bad or unsupported records are ignored and replaced by safe initial state; no
completion is sent because of a rejected record. Only obsolete dates in the
current mode/app namespace are pruned. No native payload, theme, appVersion,
timezone, authentication, or personal data is persisted in snapshots.

There was no earlier unfinished-state schema, so there is no legacy progress to
migrate. Unknown schema/puzzle revisions are rejected; completion keys are never
migrated or cleared. Corrupt records, denied/quota-limited storage, storage
eviction, cleared app data and incompatible future revisions can lose unfinished
progress. Localized notices accompany detected failures; current in-memory play
remains usable. Browser storage is not an entitlement/security boundary.

### Bridge-v1 completion limitation

Native daily completions remain authoritative. A finished embedded snapshot
without native confirmation restores a usable locked result with a localized
pending-confirmation notice. It does not replay `onGameCompleted`, create a
native completion, or grant another opportunity. The existing in-session pending
completion behavior remains; it is not an acknowledgement.

Local storage and native message delivery cannot be one atomic transaction. A
crash between saving the dispatch reservation and native receipt can leave an
unconfirmed result. Reserving after delivery would instead risk replaying the
event. This implementation chooses no replay. Failed storage can also prevent
cross-process deduplication. Native idempotence remains required. Durable
acknowledgement/retry requires the separate protocol proposal below.

## Compatibility and evidence

`tests/fixtures/games-hosts.json` records deterministic **synthetic** old/new host
payloads based on the documented v1 contract. They are not device captures and
do not identify real Android builds. The recording stub never makes ad requests.

| Combination | Automated coverage | Required external evidence |
| --- | --- | --- |
| Old Android / new site | Old-host v1 fixture, JSON-string configure, unchanged events and restore | Actual old host build and WebView version |
| New Android / old site | New-host fixture against Git artifact `0cf1dbb41430f1fa88aa60ae69aa9392925fae94`; JSON-string/back contract | Actual new Android build; old site still loses unfinished state |
| New Android / new site | New-host fixture, locale changes, persisted moves/results, recreation and renderer-crash harness | Actual locale-induced Activity/WebView recreation and process-kill/relaunch |
| Standalone / new site | Browser locale preference, completion storage and unfinished-state restoration | Manual browser/assistive-technology review |

The reproducible commands are `npm run test:games`, `npm run test:games:mobile`,
`npm run test:games:restoration`, and `npm run build`. Browser suites use an
ephemeral local server; the compatibility server reads the pinned old artifact
from Git, so its commit must be available locally. CI fetches full history.
Screenshots and machine-readable evidence are written to ignored
`test-results/games/`, and uploaded by Games CI. Do not confuse the synthetic
Chromium lifecycle tests with Android device evidence.

## Review ledger and release gates

| Language | UI, clues, accepted answers and tile boundaries |
| --- | --- |
| en | Existing content plus new strings; native-language sign-off pending |
| hi | Existing content plus completed UI coverage; native-language sign-off pending |
| fr | Draft; native-language sign-off pending |
| de | Draft; native-language sign-off pending |
| it | Draft; native-language sign-off pending |
| nl | Draft; native-language sign-off pending |
| pt | Draft; native-language sign-off pending |
| el | Draft; native-language sign-off pending |
| ro | Draft; native-language sign-off pending |
| es | Draft; native-language sign-off pending |

Reviewers must approve natural wording, unambiguous matching/clues, valid-answer
sets, spelling/diacritics, Hindi grapheme boundaries, and screenshots at normal
and enlarged text. Record reviewer, resource revision, date and corrections.
No row is certified by automated generation or validation.

The Android team must provide actual build IDs and confirm existing origin/path
allowlisting, safe JSON-string evaluation, boolean return handling, DOM storage
availability, persistent WebView profile, current completions on every configure,
and refresh at foreground/midnight/clock/timezone changes. Test every game through
language-induced recreation, background/foreground and process-kill/relaunch;
compare seed, moves, route, native event counts, completion and ad reservation
keys. Include TalkBack and supported minimum WebView versions. This repository
does not inspect or modify the native `AndroidGames.postMessage` receiver.

**Release is blocked pending native-language review, manual screen-reader review,
and actual Android recreation testing. Do not claim the Android multilingual
release preserves progress based on this browser evidence.**

## Separate protocol proposals

The referenced Android `docs/REQUIRED_WEB_GAMES_CHANGES.md` was read as contextual
requirements. Its completion-acknowledgement and host-date-refresh requests are
not silently implemented as new bridge-v1 messages.

1. Completion acknowledgement: agree a versioned, capability-negotiated request
   identity and success/retry response. Persist native completion idempotently
   before acknowledging; web results stay usable while retrying. Preserve all
   existing completion/ad reservation keys. Define crash recovery and retry
   bounds jointly with Android before implementing it.
2. Host refresh: agree a capability-negotiated request/response on foreground and
   suspected day rollover. Disable stale puzzle input while awaiting fresh
   authoritative context, with timeout/error recovery and an older-host fallback.
   Until then, the host must continue sending fresh v1 configure payloads itself.

These are future proposals, with no new messages or bridge version in this diff.

## Deployment order and rollback

After all release gates pass and deployment is separately approved: publish the
backward-compatible site first, smoke-test existing hosts, then release the
Android localization change. Record the deployed site commit and host build IDs.
Watch for game load/invalid-host errors, storage failures and unconfirmed results
using existing diagnostics; do not add sensitive telemetry or new ad triggers.

Rollback the site to the previous immutable artifact. Preserve completion keys
and the new snapshot namespace; the old site ignores snapshots and cannot
preserve unfinished progress. Releasing this implementation again can restore
still-compatible same-day records. Roll back Android separately if required.
