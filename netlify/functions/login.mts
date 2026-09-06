import type { Config } from "@netlify/functions";
import { buildSessionCookie, getUsers, safeEqual } from "./lib/auth.mts";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Netlify.env.get("AUTH_SECRET");
  if (!secret) {
    return new Response(
      JSON.stringify({
        error:
          "This planner isn't set up yet: an AUTH_SECRET environment variable is missing. Add it in your Netlify site settings and redeploy.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  const users = getUsers();
  if (Object.keys(users).length === 0) {
    return new Response(
      JSON.stringify({
        error:
          "No login accounts are configured yet. Set PLANNER_PASSWORD_JO and/or PLANNER_PASSWORD_ADAM in your Netlify site's environment variables, then redeploy.",
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";
  const expected = users[username];

  if (!expected || !safeEqual(password, expected)) {
    return new Response(JSON.stringify({ error: "Incorrect name or password." }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, user: username }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": buildSessionCookie(username, secret),
    },
  });
};

export const config: Config = {
  path: "/api/login",
};
