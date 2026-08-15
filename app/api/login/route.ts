import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, signSession } from "@/lib/auth";
import { readData } from "@/lib/cms-store";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const data = await readData();
  const user = data.users.find(
    (entry) =>
      entry.email.toLowerCase() === email.trim().toLowerCase() && entry.password === password,
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = signSession(user.id);
  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantIds: user.tenantIds,
    },
  });

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: token ? { id: "session" } : null }, { status: 200 });
}
