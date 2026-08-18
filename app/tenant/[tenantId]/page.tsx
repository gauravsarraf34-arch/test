import { notFound } from "next/navigation";
import { Metadata } from "next";
import { readData } from "@/lib/cms-store";
import { TenantPublicView } from "@/components/public/TenantPublicView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}): Promise<Metadata> {
  const { tenantId } = await params;
  const data = await readData();
  const tenant = data.tenants.find((entry) => entry.id === tenantId);

  if (!tenant) {
    return {
      title: "Tenant Not Found | TenantFlow CMS",
    };
  }

  const page = tenant.pages.find((entry) => entry.published) ?? tenant.pages[0];

  return {
    title: tenant.seoTitle || `${page?.title || tenant.name} | ${tenant.name}`,
    description: tenant.seoDescription || page?.description || page?.heroSubtitle,
    openGraph: {
      title: tenant.seoTitle || tenant.name,
      description: tenant.seoDescription || page?.heroSubtitle,
      images: page?.heroImage ? [page.heroImage] : [],
    },
  };
}

export default async function TenantDefaultPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  const data = await readData();
  const tenant = data.tenants.find((entry) => entry.id === tenantId);

  if (!tenant) {
    notFound();
  }

  const page = tenant.pages.find((entry) => entry.published) ?? tenant.pages[0];

  if (!page) {
    notFound();
  }

  return <TenantPublicView tenant={tenant} page={page} />;
}
