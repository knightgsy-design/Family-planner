# Our Weekly Planner

A small private web app for two people to log in and edit a shared weekly
family schedule — the grid (time slots × days), plus editable notes for
running, Oscar, housework, dog walks, and Imogen's commitments. Whoever
saves last wins, and the page quietly polls for the other person's edits
every 15 seconds without disturbing whatever you're currently typing.

It's a static front end (`public/`) backed by a few Netlify Functions
(`netlify/functions/`) for login and saving the plan. Data is stored in
[Netlify Blobs](https://docs.netlify.com/blobs/overview/) — no separate
database to set up.

This is a **weekly template**, not a dated calendar — every Monday repeats
the same plan rather than tracking specific dates. A few features borrowed
from shared family calendars (Cozi, in particular) are layered on top of
that template:

- **Color-coded people** — tap the small dots above any cell's text to tag
  it with Jo, Adam, Oscar, Imogen, or All; each gets its own color, and the
  cell tints to match so you can scan who's doing what at a glance.
- **Daily view** — an agenda above the grid for one day at a time, defaulting
  to today. Step through the week with the ‹ › arrows (it wraps around), jump
  back to today with one tap, and filter to one or more people to see just
  their entries for that day.
- **Search** — the box in the header highlights matching cells and notes
  and dims everything else, so a search across a page full of small text
  is easy to scan.
- **Meal plan, recipe box, and shopping list** — pick lunch and dinner for
  each day from a shared recipe box (or type a one-off "something else"),
  and hit **Generate from meals** to turn everything planned that week into
  a shopping list, with ingredient counts combined (e.g. "onion ×2") when
  more than one meal needs it. Items can also be added by hand, checked off,
  or cleared once bought — re-generating never unchecks anything already
  ticked. Recipes can be flagged **⚡ Quick** (fine for a busy weeknight);
  Monday–Friday dinners only offer quick-tagged recipes (weekends and lunch
  are unrestricted), so a rushed evening never turns up a recipe that needs
  an hour. A recipe can optionally link to its original source (shown as
  the recipe's name being clickable).

  Meal planning covers **breakfast, lunch, and dinner** — breakfast has no
  day-specific picks seeded in yet, just recipes to choose from whenever.

  The recipe box has 41 recipes: 29 real [BBC Good Food](https://www.bbcgoodfood.com/)
  ones (13 quick, 16 not), each linking back to the original page, plus 12
  family staples (salmon & veg, chicken wraps, overnight oats, etc.) with no
  source link since they're not from a specific site. The BBC Good Food
  ingredient lists were reconstructed from what search results surfaced
  rather than copied from a direct page fetch (this environment can't
  browse their site directly) — a solid starting point, but worth a quick
  check against the source link the first time you cook something new from
  them. This is a hand-picked list, not a live scrape: an automated
  scraper that pulls and stores BBC Good Food's content in bulk would be a
  meaningfully bigger step than linking out to a handful of recipes, and
  isn't something this app does.

  Since seed data only applies automatically to a plan that's never been
  saved, an already-saved plan won't just pick up new seed content on its
  own — two buttons pull from it explicitly (both backed by `GET
  /api/seed-data`):
  - **Load starter recipes** (in the Recipe box) — adds whichever starter
    recipes you don't already have, matched by id. Never overwrites or
    removes a recipe you've added or edited, so it's safe to click any time.
  - **Import latest schedule** (above the weekly grid) — replaces the grid
    and meal plan with the current seed version, after a confirmation
    prompt (this one *does* overwrite, since a schedule import is meant to
    replace, not merge). Shopping-list items from the seed are still only
    ever added, never replacing what's already on your list.

## Deploying to Netlify

1. **Create a new Netlify site from this repo** (via the Netlify UI —
   "Add new site" → "Import an existing project" → pick this GitHub repo
   and branch). No build command is needed; the publish directory
   (`public`) and functions directory (`netlify/functions`) are already set
   in `netlify.toml`.

2. **Set three environment variables** on the site (Site configuration →
   Environment variables):

   | Key | Value |
   |---|---|
   | `AUTH_SECRET` | any long random string (used to sign login sessions) |
   | `PLANNER_PASSWORD_JO` | the password Jo will log in with |
   | `PLANNER_PASSWORD_ADAM` | the password Adam will log in with |

   Only accounts with a password set will be available to log in with —
   you don't need both if only one of you wants an account.

3. **Deploy.** Once it's live, open the site, choose your name, enter your
   password, and you're in. Netlify Blobs needs no extra configuration.

## Local development

```bash
npm install
netlify dev
```

`netlify dev` runs the static site and functions together (with a
sandboxed local Blobs store) at `http://localhost:8888`. Set the same
three environment variables in a `.env` file or via `netlify env:set`
before running it locally.

## How the data is structured

`netlify/functions/lib/seed.mts` holds the starting plan (the corrected
September schedule) that's used the very first time the planner is opened,
before anyone has saved a change. After that, every edit is saved as one
JSON document in a Netlify Blobs store called `family-planner`, under the
key `plan`, via `PUT /api/plan`.

## Notes on the seed data

The weekly grid, meal plan, and shopping list are imported from the
family's own September 2026 planning spreadsheet (Sheet1 + Meals), not
hand-written — 23 time slots instead of the original 13, running from
6:00am to 8:15pm onwards. A few things worth knowing about that import:

- **Person tags were added automatically**, not hand-picked — any cell
  mentioning "Adam", "Jo", "Oscar", "Imogen"/"Immy", or "Family" (→ All) by
  name got that tag. Worth a skim rather than assumed correct.
- **Saturday and Sunday are looser** in the source spreadsheet than
  Monday–Friday — entries sit in whichever row had space rather than one
  that strictly matches its time label, so a couple of weekend items
  (Immy's Saturday class, Sunday's family dinner) currently show up under
  an early-morning time slot rather than their real time. Preserved as
  given rather than guessed at; easy to drag to a better slot in the app.
- **The meal plan's dinner picks link to matching recipes** where one
  already existed in the box (Tuesday's chilli, Sunday's roast); the rest
  are either a new recipe added for this import or a one-off "custom" entry
  (the Wednesday/Thursday leftovers, since those aren't a base recipe).
- **The shopping list is imported as-is** from the spreadsheet's list —
  it's a snapshot of what was needed at the time, not tied to the meal
  plan's ingredients, so it won't shrink as you check things off the way a
  freshly-generated list would track against recipes.

Everything is editable from day one — treat all of this as a starting
point, not the last word, especially the auto-tagged people and the
loosely-timed weekend rows.
