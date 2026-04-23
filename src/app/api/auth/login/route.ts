import { NextResponse } from "next/server";
import { encodeAccessToken, encodeRefreshToken } from "@/app/api/auth/_payload";
import type { AuthUser } from "@/features/auth/types/auth.types";

export const runtime = "nodejs";

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo123";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (body.email !== DEMO_EMAIL || body.password !== DEMO_PASSWORD) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const user: AuthUser = {
    id: 1,
    email: DEMO_EMAIL,
    name: "Demo User",
    role: "admin",
  };

  const accessToken = encodeAccessToken(user);
  const refreshToken = encodeRefreshToken({ sub: user.id, role: user.role, v: 1 });

  return NextResponse.json({
    accessToken,
    refreshToken,
    user,
  });
}
