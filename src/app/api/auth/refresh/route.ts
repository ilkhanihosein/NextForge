import { NextResponse } from "next/server";
import type { ApiTokens } from "@/lib/api/types";
import {
  decodeRefreshToken,
  demoUserFromPayload,
  encodeAccessToken,
  encodeRefreshToken,
} from "@/app/api/auth/_payload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let refreshToken: string | undefined;
  try {
    const body = (await request.json()) as { refreshToken?: string };
    refreshToken = body.refreshToken;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  if (!refreshToken) {
    return NextResponse.json({ message: "refreshToken required" }, { status: 400 });
  }

  const payload = decodeRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
  }

  const user = demoUserFromPayload(payload);
  const nextV = payload.v + 1;
  const tokens: ApiTokens = {
    accessToken: encodeAccessToken(user),
    refreshToken: encodeRefreshToken({ sub: user.id, role: user.role, v: nextV }),
  };

  return NextResponse.json(tokens);
}
