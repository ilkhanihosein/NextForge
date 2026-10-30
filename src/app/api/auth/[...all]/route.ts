import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/features/auth/server";

const handler = toNextJsHandler(auth);

/**
 * The admin plugin's HTTP endpoints (/api/auth/admin/*) stay closed: a stolen admin
 * session could otherwise call them directly and skip every rule the panel enforces
 * (owner-only changes, password re-checks, the activity log). Admin work runs through the
 * users feature's server actions, whose `auth.api.*` calls don't go over HTTP.
 */
const closed = (request: Request) => {
  // Decoded and lower-cased, so "/%61dmin/" or "/Admin/" can't slip past.
  let path = new URL(request.url).pathname;
  try {
    path = decodeURIComponent(path);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  return /\/api\/auth\/+admin\//i.test(path)
    ? new Response("Not Found", { status: 404 })
    : null;
};

export const GET = (request: Request) => closed(request) ?? handler.GET(request);
export const POST = (request: Request) => closed(request) ?? handler.POST(request);
