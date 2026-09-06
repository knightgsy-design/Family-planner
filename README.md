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
