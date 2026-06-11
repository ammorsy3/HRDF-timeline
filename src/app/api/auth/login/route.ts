import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { type SessionData, sessionOptions, type SessionRole } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  let role: SessionRole | null = null;
  if (password === process.env.ADMIN_PASSWORD) role = "admin";
  else if (password === process.env.LOGIN_PASSWORD) role = "client";

  if (!role) {
    return NextResponse.json(
      { error: "كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true, role });
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.isLoggedIn = true;
  session.role = role;
  await session.save();

  return response;
}
