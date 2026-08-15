import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { readData, writeData } from "@/lib/cms-store";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tenantId, pageId } = (await request.json()) as { tenantId?: string; pageId?: string };
  const data = await readData();
  const tenant = data.tenants.find((entry) => entry.id === tenantId);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
  }

  const page = tenant.pages.find((entry) => entry.id === pageId);
  if (!page) {
    return NextResponse.json({ error: "Page not found." }, { status: 404 });
  }

  page.published = true;
  tenant.status = "Active";

  await writeData(data);
  return NextResponse.json({ ok: true, tenant, page });
}
