import { NextResponse } from "next/server";

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

  const user = {
    id: 1,
    email: DEMO_EMAIL,
    name: "Demo User",
  };

  const payload = JSON.stringify({ user });
  const accessToken = `demo.${Buffer.from(payload, "utf8").toString("base64url")}`;

  return NextResponse.json({
    accessToken,
    refreshToken: null,
    user,
  });
}
