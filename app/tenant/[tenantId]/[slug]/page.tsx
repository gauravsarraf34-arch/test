import { notFound } from "next/navigation";
import { Metadata } from "next";
import { readData, CmsTenant, CmsPage, CmsMenuItem } from "@/lib/cms-store";
import { TenantPublicView } from "@/components/public/TenantPublicView";
import { Tenant, Page } from "@/types/cms";

function resolvePage(tenant: CmsTenant, slug: string): Page | null {
  const normSlug = slug.toLowerCase().trim();

  // 1. Direct page match by slug
  const directPage = tenant.pages.find(
    (p) => p.slug.toLowerCase() === normSlug
  );
  if (directPage) return directPage as unknown as Page;

  // 2. Search in navigation tree (top-level and submenus)
  const findInNav = (items: CmsMenuItem[] = []): CmsMenuItem | null => {
    for (const item of items) {
      const itemLinkSlug = item.link?.split("/").filter(Boolean).pop()?.toLowerCase();
      const itemLabelSlug = item.label?.toLowerCase().replace(/[^a-z0-9-_]/g, "-");

      if (itemLinkSlug === normSlug || itemLabelSlug === normSlug) {
        return item;
      }
      if (item.children && item.children.length > 0) {
        const sub = findInNav(item.children);
        if (sub) return sub;
      }
    }
    return null;
  };

  const matchedItem = findInNav(tenant.navigation || []);
  if (matchedItem) {
    if (matchedItem.pageId) {
      const linked = tenant.pages.find((p) => p.id === matchedItem.pageId);
      if (linked) return linked as unknown as Page;
    }

    // Synthesize working page for submenu item
    const syntheticPage: Page = {
      id: matchedItem.id || `page-${slug}`,
      slug,
      title: matchedItem.label || slug,
      description: `${matchedItem.label} page for ${tenant.name}`,
      heroTitle: matchedItem.label || slug,
      heroSubtitle: `Explore our ${matchedItem.label} details and offerings.`,
      buttonText: "Contact Us",
      heroImage: "",
      published: true,
      sections: [],
      customHtml: matchedItem.content || "",
      useCustomHtml: Boolean(matchedItem.content),
    };
    return syntheticPage;
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenantId: string; slug: string }>;
}): Promise<Metadata> {
  const { tenantId, slug } = await params;
  const data = await readData();
  const tenant = data.tenants.find((entry) => entry.id === tenantId);

  if (!tenant) {
    return { title: "Not Found" };
  }

  const page = resolvePage(tenant, slug);

  if (!page) {
    return { title: `${tenant.name} | Page Not Found` };
  }

  return {
    title: `${page.title} | ${tenant.name}`,
    description: page.description || page.heroSubtitle || tenant.seoDescription,
    openGraph: {
      title: `${page.title} | ${tenant.name}`,
      description: page.heroSubtitle || tenant.seoDescription,
      images: page.heroImage ? [page.heroImage] : [],
    },
  };
}

export default async function TenantSubPage({
  params,
}: {
  params: Promise<{ tenantId: string; slug: string }>;
}) {
  const { tenantId, slug } = await params;
  const data = await readData();
  const tenant = data.tenants.find((entry) => entry.id === tenantId);

  if (!tenant) {
    notFound();
  }

  const page = resolvePage(tenant, slug);

  if (!page) {
    notFound();
  }

  return <TenantPublicView tenant={tenant as unknown as Tenant} page={page} />;
}
