import type { Config } from "@netlify/functions";
import { getSessionUser } from "./lib/auth.mts";

export default async (req: Request) => {
  const user = getSessionUser(req);
  return new Response(JSON.stringify({ loggedIn: !!user, user }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/session",
};
