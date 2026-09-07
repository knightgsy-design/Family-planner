import type { Config } from "@netlify/functions";
import { getSessionUser } from "./lib/auth.mts";
import { DEFAULT_PLAN } from "./lib/seed.mts";

// Exposes the full seed plan (grid, meals, recipes, shoppingList) so the
// app can pull specific pieces into an already-saved plan on demand —
// seed data only applies automatically to a plan that's never been saved,
// so this is the way to backfill or refresh one that has been (via the
// "Load starter recipes" and "Import latest schedule" buttons).
export default async (req: Request) => {
  const user = getSessionUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not logged in." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      grid: DEFAULT_PLAN.grid,
      meals: DEFAULT_PLAN.meals,
      recipes: DEFAULT_PLAN.recipes,
      shoppingList: DEFAULT_PLAN.shoppingList,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
};

export const config: Config = {
  path: "/api/seed-data",
};
