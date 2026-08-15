import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { readData } from "@/lib/cms-store";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const data = await readData();
    const user = data.users.find((entry) => entry.id === userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantIds: user.tenantIds,
      },
    });
  } catch (error) {
    console.error("Session GET error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
