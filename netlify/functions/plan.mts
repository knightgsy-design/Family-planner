import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { getSessionUser } from "./lib/auth.mts";
import { DEFAULT_PLAN } from "./lib/seed.mts";

const STORE_NAME = "family-planner";
const PLAN_KEY = "plan";

export default async (req: Request) => {
  const user = getSessionUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Not logged in." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const existing = await store.get(PLAN_KEY, { type: "json" });
    const plan = existing ?? DEFAULT_PLAN;
    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "PUT") {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    if (!body || typeof body !== "object" || typeof body.grid !== "object" || typeof body.notes !== "object") {
      return new Response(JSON.stringify({ error: "Malformed plan." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const plan = {
      grid: body.grid,
      notes: body.notes,
      recipes: body.recipes && typeof body.recipes === "object" ? body.recipes : {},
      meals: body.meals && typeof body.meals === "object" ? body.meals : {},
      shoppingList: Array.isArray(body.shoppingList) ? body.shoppingList : [],
      updatedAt: new Date().toISOString(),
      updatedBy: user,
    };

    await store.setJSON(PLAN_KEY, plan);

    return new Response(JSON.stringify(plan), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/plan",
};
