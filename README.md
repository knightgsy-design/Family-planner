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
  the recipe's name being clickable) — the starter set is seeded with 9
  real [BBC Good Food](https://www.bbcgoodfood.com/) recipes (5 quick, 4
  not) rather than an empty box, each linking back to the original page.
  Their ingredient lists were reconstructed from what BBC Good Food's own
  search results surfaced (this environment can't browse their site
  directly to copy the exact list) — they should be a solid starting point,
  but worth a quick check against the source link the first time you cook
  something new from them.

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

A few small corrections were made versus the original draft, per what was
flagged when it was written:

- Monday's old 11:00–12:30 exercise class and 2:00–3:30 baby class slots
  were removed — those classes moved to **Wednesday** (Mummy & Baby,
  11–12) and **Thursday** (baby yoga, 11:30–12:30) from September, and
  Wednesday's baby class replaces the old Wednesday exercise class.
- Monday and Friday evenings (5:30–7:00) now include the dog walk that the
  dog-walking routine allocates to those evenings, which the original grid
  had left out.

Everything else is editable from day one, so treat the seed data as a
starting point, not the last word.
