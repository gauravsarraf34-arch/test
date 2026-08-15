import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { CmsData, CmsTenant, readData, writeData } from "@/lib/cms-store";

export async function GET() {
  let userId: string;
  try {
    userId = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await readData();
    const currentUser = data.users.find((u) => u.id === userId);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Scoped tenants if not admin
    const accessibleTenants =
      currentUser.role === "admin"
        ? data.tenants
        : data.tenants.filter((t) => currentUser.tenantIds.includes(t.id));

    return NextResponse.json({
      tenants: accessibleTenants,
      users: currentUser.role === "admin" ? data.users : [currentUser],
    });
  } catch (error) {
    console.error("Tenants GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tenant data." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let userId: string;
  try {
    userId = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await readData();
    const currentUser = data.users.find((u) => u.id === userId);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = (await request.json().catch(() => ({}))) as { tenants?: unknown; users?: unknown };

    let updatedTenants: CmsTenant[] = data.tenants;

    if (Array.isArray(body.tenants)) {
      const incomingTenants = body.tenants as CmsTenant[];
      if (currentUser.role === "admin") {
        updatedTenants = incomingTenants;
      } else {
        // Non-admins can only update tenants assigned to them
        updatedTenants = data.tenants.map((existingTenant) => {
          if (currentUser.tenantIds.includes(existingTenant.id)) {
            const matching = incomingTenants.find((t) => t.id === existingTenant.id);
            return matching || existingTenant;
          }
          return existingTenant;
        });
      }
    }

    const nextData: CmsData = {
      // Only admins can modify the users array
      users:
        currentUser.role === "admin" && Array.isArray(body.users)
          ? (body.users as CmsData["users"])
          : data.users,
      tenants: updatedTenants,
    };

    await writeData(nextData);
    return NextResponse.json({ ok: true, data: nextData });
  } catch (error) {
    console.error("Tenants POST error:", error);
    return NextResponse.json({ error: "Failed to update tenant data." }, { status: 500 });
  }
}
