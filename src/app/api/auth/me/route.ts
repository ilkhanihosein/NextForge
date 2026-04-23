import { NextResponse } from "next/server";
import { decodeAccessToken } from "@/app/api/auth/_payload";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const raw = header.slice(7).trim();
  const user = decodeAccessToken(raw);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(user);
}
