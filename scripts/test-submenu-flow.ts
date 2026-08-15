import { readData, writeData } from "../lib/cms-store";

async function runTest() {
  console.log("--- STARTING SUBMENU CREATION & CONTENT TEST ---");
  
  const data = await readData();
  const tenant = data.tenants[0];
  console.log(`[1] Selected Tenant: ${tenant.name} (${tenant.id})`);
  console.log(`[2] Existing Pages Count: ${tenant.pages.length}`);
  console.log(`[3] Existing Navigation Items:`, tenant.navigation?.map(n => ({ label: n.label, link: n.link, submenus: n.children?.length })));

  // Simulate user creating a submenu under 'service' or top-level item
  const parent = tenant.navigation?.[0] || { id: "menu-1", label: "Services", link: "#", children: [] };
  const newSubmenuId = `menu-sub-${Date.now().toString(36)}`;
  const newPageId = `page-sub-${Date.now().toString(36)}`;
  const subLabel = "Mobile App Design";
  const subSlug = "mobile-app-design";
  const sampleHtml = `<div class="p-8 rounded-3xl bg-indigo-900 text-white text-center">
    <h2 class="text-3xl font-black">Mobile App Design Solutions</h2>
    <p class="mt-2 text-indigo-200">Custom iOS and Android application UI/UX design.</p>
  </div>`;

  // Create new page
  const newPage = {
    id: newPageId,
    slug: subSlug,
    title: subLabel,
    description: `${subLabel} for ${tenant.name}`,
    heroTitle: subLabel,
    heroSubtitle: "Dedicated native mobile app design services",
    buttonText: "Request Quote",
    heroImage: "",
    published: true,
    sections: [],
    customHtml: sampleHtml,
    useCustomHtml: true,
  };

  const newSubmenuItem = {
    id: newSubmenuId,
    label: subLabel,
    link: `/tenant/${tenant.id}/${subSlug}`,
    pageId: newPageId,
    content: sampleHtml,
    children: [],
  };

  // Attach submenu
  parent.children = [...(parent.children || []), newSubmenuItem];
  tenant.pages.push(newPage);

  // Write back to DB
  await writeData(data);
  console.log(`[4] Successfully saved submenu '${subLabel}' and page '/${subSlug}' to SQLite!`);

  // Verify by re-reading DB
  const reRead = await readData();
  const verifyTenant = reRead.tenants.find(t => t.id === tenant.id);
  const verifyPage = verifyTenant?.pages.find(p => p.slug === subSlug);
  const verifySubmenu = verifyTenant?.navigation?.flatMap(n => [n, ...(n.children || [])]).find(m => m.label === subLabel);

  if (verifyPage && verifySubmenu && verifySubmenu.link === `/tenant/${tenant.id}/${subSlug}`) {
    console.log("✅ TEST PASSED: Submenu created, auto-linked to page, and content persisted in DB!");
    console.log("  - Submenu Link:", verifySubmenu.link);
    console.log("  - Linked Page ID:", verifyPage.id);
    console.log("  - Has HTML Content:", Boolean(verifyPage.customHtml));
  } else {
    console.error("❌ TEST FAILED: Verification failed", { verifyPage, verifySubmenu });
    process.exit(1);
  }
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
