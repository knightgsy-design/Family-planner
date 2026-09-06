import type { Config } from "@netlify/functions";
import { getSessionUser } from "./lib/auth.mts";
import { DEFAULT_PLAN } from "./lib/seed.mts";

// Exposes the seed recipe box so the "Load starter recipes" button can pull
// it in even when the saved plan predates these recipes (or predates the
// feature entirely) — seed data only applies automatically to a plan
// that's never been saved, so this is the way to backfill an existing one.
export default async (req: Request) => {
  const user = getSessionUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not logged in." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify(DEFAULT_PLAN.recipes), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/starter-recipes",
};
