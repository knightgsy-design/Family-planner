import type { Config } from "@netlify/functions";
import { buildLogoutCookie } from "./lib/auth.mts";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": buildLogoutCookie(),
    },
  });
};

export const config: Config = {
  path: "/api/logout",
};
