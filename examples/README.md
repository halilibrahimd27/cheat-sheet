# A box, solved end to end

Everything else in this repository describes the tool. This directory shows what
comes out of it.

One fictional lab machine and one OSCP sitting, taken from first scan to finished
report — as a file you can import and click through, not a screenshot.

| File | What it is |
|---|---|
| [`oscp-lab.json`](oscp-lab.json) | An importable backup: the machine, and the session that graded it. |
| [`sentinel-nmap.txt`](sentinel-nmap.txt) | The raw scan. Paste it into **Import nmap** and the services table fills itself in. |
| [`sentinel-machine.md`](sentinel-machine.md) | What the machine's **Report** tab generates. |
| [`oscp-session-report.md`](oscp-session-report.md) | What the session's **Report** button generates. |

Neither `.md` file was written by hand. Both are produced by the same code that
runs in the app, and `test/examples.test.js` regenerates them from the JSON on
every test run — so if a generator changes and these stop matching, the build
goes red rather than the example quietly becoming a lie.

## Load it

Open the app and use **Import** in the top bar, or:

```sh
curl -X POST http://localhost:3000/api/import \
     -H 'Content-Type: application/json' \
     --data-binary @examples/oscp-lab.json
```

The bundle contains only `machines` and `exam`. It adds a box and a session; it
does **not** touch your commands, notes or write-ups.

## Walk the loop

The point of this tool is a loop, not a list. This example is that loop, already
gone round once:

1. **Machines → Sentinel → Set as active target.** From here on, every command
   you copy anywhere in the app logs itself to this box's timeline. The twelve
   entries already in the example's timeline are what that leaves behind.
2. **Services → Import nmap → paste [`sentinel-nmap.txt`](sentinel-nmap.txt).**
   Three rows appear, exactly the three already in the bundle — the same parser
   backs Next Move's own paste box, so pasting there gives it the same picture.
3. **Credentials.** Three entries, one of them marked invalid. The dead `admin`
   guess is in there on purpose: what did *not* work is half of what you need at
   hour 19, and the thing nobody writes down.
4. **Sessions → the OSCP session → resume.** Six targets, five of them taken.
   The AD set counts as one all-or-nothing block.
5. **Report.** [`oscp-session-report.md`](oscp-session-report.md) is what comes
   out — the OffSec section skeleton, then every target with its flags, its
   evidence checklist, the machine behind it, and the attempts that failed.

## What the example is actually teaching

**The route, not the score.** In the legacy OSCP format the three standalone
targets are worth 60 between them and the Active Directory set is worth 40 as a
single block with no partial credit. 70 passes. So the pass mark *cannot* be
reached from the standalones alone — a candidate who runs out of clock before
starting the AD set cannot pass, however many boxes they rooted. This example takes the AD chain first (40), then
two standalones (40). The third standalone got two hours and never fell. 80, with
one target unsolved and five failed attempts on the record.

**Failures are evidence.** The session's attempts table has five rows and none of
them worked. One of them is re-running the port scan at hour 20, with the reason
written down: *"identical result — rescanning is what running out of ideas looks
like, and it cost 20 minutes."* That row is worth more than any single capture
in the same report.

**Evidence rules are ticked per flag, or the report says they were not.** Each
capture in the report carries the preset's own evidence requirements as
checkboxes. When a candidate overrides an unmet rule the report prints the
override rather than hiding it. A report that silently claims compliance it does
not have is worse than one that admits the gap.

## Reproducing it

`Sentinel` is fictional and `10.10.11.42` is a private RFC 1918 address. Nothing
here points at a host anyone would need permission to touch, and the test suite
enforces that — see `the bundle carries no real secret and no routable target` in
`test/examples.test.js`.

To regenerate the two reports after an intentional change to a generator:

```sh
UPDATE_EXAMPLES=1 node --test test/examples.test.js
```

That rewrites them from `oscp-lab.json`, so the diff is reviewable instead of
typed.
