import { NextResponse } from "next/server";
import type { ApiTokens } from "@/lib/api/types";
import {
  appendAuthCookieHeaders,
  appendClearAuthCookieHeaders,
} from "@/lib/auth/session-cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ApiTokens;
  try {
    body = (await request.json()) as ApiTokens;
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  if (!body.accessToken) {
    return NextResponse.json({ message: "accessToken required" }, { status: 400 });
  }

  const headers = new Headers();
  appendAuthCookieHeaders(headers, {
    accessToken: body.accessToken,
    refreshToken: body.refreshToken ?? null,
  });

  return NextResponse.json({ ok: true }, { headers });
}

export async function DELETE() {
  const headers = new Headers();
  appendClearAuthCookieHeaders(headers);
  return NextResponse.json({ ok: true }, { headers });
}
