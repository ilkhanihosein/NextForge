import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PREFIX = "Bearer demo.";

export async function GET(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith(PREFIX)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const encoded = header.slice(PREFIX.length);
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as { user?: unknown };
    if (!parsed.user || typeof parsed.user !== "object") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(parsed.user);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
