"use client";

import React, { useState } from "react";
import { Tenant, Page, MenuItem } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { RichHtmlEditor } from "./RichHtmlEditor";

interface NavigationMenuEditorProps {
  tenant: Tenant;
  canEdit: boolean;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
  onSelectPage: (pageId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
}

export function NavigationMenuEditor({
  tenant,
  canEdit,
  onUpdateTenant,
  onSelectPage,
  onAddPage,
  onDeletePage,
}: NavigationMenuEditorProps) {
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [parentIdForSubmenu, setParentIdForSubmenu] = useState<string | null>(null);

  // Content Editor Modal for Menu/Submenu
  const [editingContentTarget, setEditingContentTarget] = useState<{
    menuItem: MenuItem;
    parentId?: string;
  } | null>(null);

  // Modal Form State
  const [menuLabel, setMenuLabel] = useState("");
  const [linkType, setLinkType] = useState<"new_page" | "page" | "custom" | "group">("new_page");
  const [selectedPageId, setSelectedPageId] = useState(tenant.pages[0]?.id || "");
  const [customUrl, setCustomUrl] = useState("");

  const menuItems: MenuItem[] = tenant.navigation || [];

  const generateId = (prefix: string) =>
    `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "page";

  // Open modal for top-level item
  const handleOpenAddTopLevel = () => {
    setParentIdForSubmenu(null);
    setMenuLabel("");
    setLinkType("new_page");
    setSelectedPageId(tenant.pages[0]?.id || "");
    setCustomUrl("");
    setShowAddMenuModal(true);
  };

  // Open modal for submenu item
  const handleOpenAddSubmenu = (parentId: string) => {
    setParentIdForSubmenu(parentId);
    setMenuLabel("");
    setLinkType("new_page");
    setSelectedPageId(tenant.pages[0]?.id || "");
    setCustomUrl("");
    setShowAddMenuModal(true);
  };

  // Save new menu or submenu item
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    const label = menuLabel.trim() || "New Menu";
    let computedLink = "#";
    let pageId: string | undefined = undefined;
    let newPageToAdd: Page | null = null;

    if (linkType === "new_page") {
      const slug = slugify(label);
      const newPageId = generateId("page");
      newPageToAdd = {
        id: newPageId,
        slug,
        title: label,
        description: `${label} page for ${tenant.name}`,
        heroTitle: label,
        heroSubtitle: `Explore our ${label} offerings and services.`,
        buttonText: "Contact Us",
        heroImage: "",
        published: true,
        sections: [],
        customHtml: "",
        useCustomHtml: false,
      };

      computedLink = `/tenant/${tenant.id}/${slug}`;
      pageId = newPageId;
    } else if (linkType === "page") {
      const targetPage = tenant.pages.find((p) => p.id === selectedPageId);
      if (targetPage) {
        computedLink =
          targetPage.slug === "home"
            ? `/tenant/${tenant.id}`
            : `/tenant/${tenant.id}/${targetPage.slug}`;
        pageId = targetPage.id;
      }
    } else if (linkType === "custom") {
      computedLink = customUrl || "#";
    }

    const newItem: MenuItem = {
      id: generateId("menu"),
      label,
      link: computedLink,
      pageId,
      children: [],
    };

    onUpdateTenant((t) => {
      const updatedPages = newPageToAdd ? [...t.pages, newPageToAdd] : t.pages;

      let updatedNav: MenuItem[];
      if (parentIdForSubmenu) {
        updatedNav = (t.navigation || []).map((item) => {
          if (item.id === parentIdForSubmenu) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            };
          }
          return item;
        });
      } else {
        updatedNav = [...(t.navigation || []), newItem];
      }

      return {
        ...t,
        pages: updatedPages,
        navigation: updatedNav,
      };
    });

    setShowAddMenuModal(false);
  };

  // Convert an unlinked menu or submenu item into a live page
  const handleBindNewPageToMenuItem = (itemToBind: MenuItem) => {
    if (!canEdit) return;
    const slug = slugify(itemToBind.label);
    const newPageId = generateId("page");
    const newPage: Page = {
      id: newPageId,
      slug,
      title: itemToBind.label,
      description: `${itemToBind.label} page for ${tenant.name}`,
      heroTitle: itemToBind.label,
      heroSubtitle: `Explore our ${itemToBind.label} offerings and services.`,
      buttonText: "Contact Us",
      heroImage: "",
      published: true,
      sections: [],
      customHtml: itemToBind.content || "",
      useCustomHtml: Boolean(itemToBind.content),
    };

    const newLink = `/tenant/${tenant.id}/${slug}`;

    onUpdateTenant((t) => {
      const updateTree = (list: MenuItem[]): MenuItem[] => {
        return list.map((item) => {
          if (item.id === itemToBind.id) {
            return {
              ...item,
              pageId: newPageId,
              link: newLink,
            };
          }
          if (item.children) {
            return { ...item, children: updateTree(item.children) };
          }
          return item;
        });
      };

      return {
        ...t,
        pages: [...t.pages, newPage],
        navigation: updateTree(t.navigation || []),
      };
    });
  };

  // Delete Menu Item
  const handleDeleteMenuItem = (itemId: string, parentId?: string) => {
    if (!canEdit) return;
    if (parentId) {
      onUpdateTenant((t) => ({
        ...t,
        navigation: (t.navigation || []).map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: (item.children || []).filter((c) => c.id !== itemId),
            };
          }
          return item;
        }),
      }));
    } else {
      onUpdateTenant((t) => ({
        ...t,
        navigation: (t.navigation || []).filter((item) => item.id !== itemId),
      }));
    }
  };

  // Move Menu Item Up/Down
  const handleMoveMenuItem = (index: number, direction: "up" | "down", parentId?: string) => {
    if (!canEdit) return;
    if (parentId) {
      onUpdateTenant((t) => ({
        ...t,
        navigation: (t.navigation || []).map((item) => {
          if (item.id === parentId) {
            const list = [...(item.children || [])];
            const target = direction === "up" ? index - 1 : index + 1;
            if (target < 0 || target >= list.length) return item;
            const [moved] = list.splice(index, 1);
            list.splice(target, 0, moved);
            return { ...item, children: list };
          }
          return item;
        }),
      }));
    } else {
      const list = [...(tenant.navigation || [])];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= list.length) return;
      const [moved] = list.splice(index, 1);
      list.splice(target, 0, moved);
      onUpdateTenant((t) => ({ ...t, navigation: list }));
    }
  };

  // Move a submenu item up to become a top-level item
  const handlePromoteSubmenuToTopLevel = (subItemId: string, parentId: string) => {
    if (!canEdit) return;
    onUpdateTenant((t) => {
      let promotedItem: MenuItem | null = null;

      const updatedNav = (t.navigation || []).map((item) => {
        if (item.id === parentId) {
          const found = (item.children || []).find((c) => c.id === subItemId);
          if (found) promotedItem = found;
          return {
            ...item,
            children: (item.children || []).filter((c) => c.id !== subItemId),
          };
        }
        return item;
      });

      if (promotedItem) {
        updatedNav.push(promotedItem);
      }

      return { ...t, navigation: updatedNav };
    });
  };

  // Nest a top-level menu item under another item as a submenu
  const handleNestUnderParent = (itemId: string, targetParentId: string) => {
    if (!canEdit || itemId === targetParentId) return;
    onUpdateTenant((t) => {
      const itemToNest = (t.navigation || []).find((i) => i.id === itemId);
      if (!itemToNest) return t;

      const filteredNav = (t.navigation || []).filter((i) => i.id !== itemId);
      const updatedNav = filteredNav.map((item) => {
        if (item.id === targetParentId) {
          return {
            ...item,
            children: [...(item.children || []), itemToNest],
          };
        }
        return item;
      });

      return { ...t, navigation: updatedNav };
    });
  };

  // Sync menu from published pages WITHOUT destroying submenus
  const handleAutoGenerateFromPages = () => {
    if (!canEdit) return;

    onUpdateTenant((t) => {
      const presentPageIds = new Set<string>();
      const presentSlugs = new Set<string>();

      const scanItems = (items: MenuItem[]) => {
        for (const it of items) {
          if (it.pageId) presentPageIds.add(it.pageId);
          const slug = it.link?.split("/").filter(Boolean).pop()?.toLowerCase();
          if (slug) presentSlugs.add(slug);
          if (it.children && it.children.length > 0) {
            scanItems(it.children);
          }
        }
      };

      scanItems(t.navigation || []);

      // 1. Keep existing hierarchy intact and sync any updated links/titles
      const updateExisting = (items: MenuItem[]): MenuItem[] => {
        return items.map((it) => {
          let updatedItem = { ...it };
          if (it.pageId) {
            const linked = t.pages.find((p) => p.id === it.pageId);
            if (linked) {
              updatedItem.link =
                linked.slug === "home" ? `/tenant/${t.id}` : `/tenant/${t.id}/${linked.slug}`;
            }
          }
          if (it.children && it.children.length > 0) {
            updatedItem.children = updateExisting(it.children);
          }
          return updatedItem;
        });
      };

      const updatedNavigation = updateExisting(t.navigation || []);

      // 2. Find published pages not yet anywhere in the menu tree
      const unmappedPages = t.pages.filter(
        (p) =>
          p.published &&
          !presentPageIds.has(p.id) &&
          !presentSlugs.has(p.slug.toLowerCase())
      );

      // 3. Only append unmapped pages
      for (const p of unmappedPages) {
        updatedNavigation.push({
          id: generateId("menu"),
          label: p.title,
          link: p.slug === "home" ? `/tenant/${t.id}` : `/tenant/${t.id}/${p.slug}`,
          pageId: p.id,
          children: [],
        });
      }

      return {
        ...t,
        navigation: updatedNavigation,
      };
    });
  };

  // Save Content from RichHtmlEditor
  const handleSaveMenuContent = (html: string) => {
    if (!editingContentTarget || !canEdit) return;

    const { menuItem } = editingContentTarget;

    onUpdateTenant((t) => {
      let pages = [...t.pages];
      let targetPageId = menuItem.pageId;
      let targetSlug = "";

      // If menuItem doesn't have a linked page, create a page for it!
      if (!targetPageId || !pages.some((p) => p.id === targetPageId)) {
        const slug = slugify(menuItem.label);
        let existing = pages.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

        if (!existing) {
          const newPage: Page = {
            id: generateId("page"),
            slug,
            title: menuItem.label,
            description: `${menuItem.label} page for ${t.name}`,
            heroTitle: menuItem.label,
            heroSubtitle: `Explore our ${menuItem.label} offerings and details.`,
            buttonText: "Contact Us",
            heroImage: "",
            published: true,
            sections: [],
            customHtml: html,
            useCustomHtml: true,
          };
          pages.push(newPage);
          targetPageId = newPage.id;
          targetSlug = newPage.slug;
        } else {
          existing.customHtml = html;
          existing.useCustomHtml = true;
          existing.published = true;
          targetPageId = existing.id;
          targetSlug = existing.slug;
        }
      } else {
        pages = pages.map((p) =>
          p.id === targetPageId
            ? { ...p, customHtml: html, useCustomHtml: true, published: true }
            : p
        );
        const linked = pages.find((p) => p.id === targetPageId);
        targetSlug = linked ? linked.slug : "";
      }

      // Update menuItem with pageId, link, and content
      const updateTree = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
          if (item.id === menuItem.id) {
            return {
              ...item,
              pageId: targetPageId,
              link: targetSlug === "home" ? `/tenant/${t.id}` : `/tenant/${t.id}/${targetSlug}`,
              content: html,
            };
          }
          if (item.children && item.children.length > 0) {
            return { ...item, children: updateTree(item.children) };
          }
          return item;
        });
      };

      return {
        ...t,
        pages,
        navigation: updateTree(t.navigation || []),
      };
    });
  };

  // Get current HTML for the editing target
  const getCurrentTargetHtml = () => {
    if (!editingContentTarget) return "";
    const { menuItem } = editingContentTarget;
    if (menuItem.pageId) {
      const linked = tenant.pages.find((p) => p.id === menuItem.pageId);
      if (linked && linked.customHtml) return linked.customHtml;
    }
    return menuItem.content || "";
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Navigation Menu & Submenu Manager</h3>
            <p className="text-xs text-slate-500">
              Build your website header menu hierarchy with working dropdown submenus, direct page editing, and pre-built templates
            </p>
          </div>
          <HelpTooltip tooltip="Every menu and submenu item connects to a real page URL. Click '✏️ Content / HTML' to load pre-built templates or format with visual CKEditor tools." />

          {canEdit && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoGenerateFromPages}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                🔄 Auto-Sync from Pages
              </button>
              <button
                type="button"
                onClick={handleOpenAddTopLevel}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                <span>+ Add Menu Item</span>
              </button>
            </div>
          )}
        </div>

        {/* Menu Items Hierarchy Tree */}
        <div className="mt-5 space-y-3">
          {menuItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
              <span className="text-3xl">🧭</span>
              <h4 className="mt-2 text-sm font-bold text-slate-800">No Navigation Menu Items</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Click "+ Add Menu Item" to create top-level navigation links, or "Auto-Sync from Pages" to build a menu from all published pages.
              </p>
            </div>
          ) : (
            menuItems.map((item, index) => {
              const hasChildren = item.children && item.children.length > 0;
              const isUnlinked = !item.pageId && (item.link === "#" || !item.link);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition hover:border-indigo-200"
                >
                  {/* Top Level Item Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{item.label}</span>
                          {hasChildren && (
                            <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
                              {item.children?.length} Submenu{item.children?.length === 1 ? "" : "s"} ▾
                            </span>
                          )}
                          {item.pageId ? (
                            <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                              Linked Page
                            </span>
                          ) : isUnlinked ? (
                            <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              Unlinked
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 truncate max-w-xs sm:max-w-md">
                          {item.link}
                        </p>
                      </div>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1.5">
                        {/* Auto-Bind Button if unlinked */}
                        {isUnlinked && (
                          <button
                            type="button"
                            onClick={() => handleBindNewPageToMenuItem(item)}
                            className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
                            title="Generate a live page for this menu link"
                          >
                            🔗 Bind to Page
                          </button>
                        )}

                        {/* Nest under another top-level item */}
                        {menuItems.length > 1 && (
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleNestUnderParent(item.id, e.target.value);
                              }
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            title="Move this menu item to become a submenu dropdown inside another menu"
                          >
                            <option value="" disabled>
                              ↳ Nest under...
                            </option>
                            {menuItems
                              .filter((m) => m.id !== item.id)
                              .map((m) => (
                                <option key={m.id} value={m.id}>
                                  ↳ Under {m.label}
                                </option>
                              ))}
                          </select>
                        )}

                        {/* Edit Content / HTML button */}
                        <button
                          type="button"
                          onClick={() => setEditingContentTarget({ menuItem: item })}
                          className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                          title="Edit page content or pre-built HTML template for this menu"
                        >
                          <span>✏️ Content / HTML</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAddSubmenu(item.id)}
                          className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 hover:bg-indigo-100"
                          title="Add dropdown item under this menu"
                        >
                          + Add Submenu
                        </button>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveMenuItem(index, "up")}
                          className="rounded-lg p-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === menuItems.length - 1}
                          onClick={() => handleMoveMenuItem(index, "down")}
                          className="rounded-lg p-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete menu item"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Nested Submenus List */}
                  {hasChildren && (
                    <div className="mt-3 pl-6 sm:pl-10 space-y-2 border-l-2 border-indigo-200 ml-3">
                      {item.children!.map((subItem, subIndex) => {
                        const isSubUnlinked = !subItem.pageId && (subItem.link === "#" || !subItem.link);

                        return (
                          <div
                            key={subItem.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-bold">↳</span>
                              <span className="font-semibold text-slate-800">{subItem.label}</span>
                              <span className="text-[10px] font-mono text-slate-400">{subItem.link}</span>
                              {isSubUnlinked && (
                                <span className="rounded bg-amber-50 px-1 py-0.2 text-[9px] font-bold text-amber-700">
                                  # Unlinked
                                </span>
                              )}
                            </div>

                            {canEdit && (
                              <div className="flex items-center gap-1">
                                {isSubUnlinked && (
                                  <button
                                    type="button"
                                    onClick={() => handleBindNewPageToMenuItem(subItem)}
                                    className="rounded px-2 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100"
                                    title="Create working page for this submenu link"
                                  >
                                    🔗 Create Page
                                  </button>
                                )}

                                {/* Edit Submenu Content */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingContentTarget({ menuItem: subItem, parentId: item.id })
                                  }
                                  className="rounded px-2 py-0.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                                >
                                  ✏️ Content / HTML
                                </button>

                                {/* Promote Submenu to Top-Level */}
                                <button
                                  type="button"
                                  onClick={() => handlePromoteSubmenuToTopLevel(subItem.id, item.id)}
                                  className="rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                                  title="Move out of dropdown to become a top-level menu"
                                >
                                  ↖ Make Top-Level
                                </button>

                                <button
                                  type="button"
                                  disabled={subIndex === 0}
                                  onClick={() => handleMoveMenuItem(subIndex, "up", item.id)}
                                  className="rounded p-0.5 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  disabled={subIndex === (item.children?.length || 0) - 1}
                                  onClick={() => handleMoveMenuItem(subIndex, "down", item.id)}
                                  className="rounded p-0.5 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMenuItem(subItem.id, item.id)}
                                  className="rounded p-0.5 text-slate-400 hover:text-rose-600"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. All Pages Overview & Controls */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Website Pages ({tenant.pages.length})</h3>
            <p className="text-xs text-slate-500">Create, publish, and link landing pages for this brand</p>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={onAddPage}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              + Create New Page
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tenant.pages.map((p) => {
            const isHomePage = p.slug === "home";
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:shadow-md hover:border-indigo-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{p.title}</span>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">/{p.slug}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.published ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => onSelectPage(p.id)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    ✏️ Edit Content →
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={isHomePage ? `/tenant/${tenant.id}` : `/tenant/${tenant.id}/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-400 hover:text-slate-700"
                      title="View page"
                    >
                      ↗
                    </a>
                    {canEdit && tenant.pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeletePage(p.id)}
                        className="text-xs text-rose-500 hover:text-rose-700"
                        title="Delete page"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Menu Item Modal Dialog */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {parentIdForSubmenu ? "Add Submenu Dropdown Item" : "Add Navigation Menu Item"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMenuModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Menu / Submenu Label</label>
                <input
                  type="text"
                  required
                  value={menuLabel}
                  onChange={(e) => setMenuLabel(e.target.value)}
                  placeholder="e.g. Website Development, BCA, About Us"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link Destination Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType("new_page")}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition text-left ${
                      linkType === "new_page"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">✨ Create New Page</div>
                    <div className="text-[10px] text-slate-500">Auto-generates live URL</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("page")}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition text-left ${
                      linkType === "page"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">📄 Existing Page</div>
                    <div className="text-[10px] text-slate-500">Link to created page</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("custom")}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition text-left ${
                      linkType === "custom"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">🔗 Custom Link</div>
                    <div className="text-[10px] text-slate-500">https:// or #anchor</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLinkType("group")}
                    className={`rounded-xl border p-2.5 text-xs font-semibold transition text-left ${
                      linkType === "group"
                        ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold">📂 Dropdown Only</div>
                    <div className="text-[10px] text-slate-500">Parent container</div>
                  </button>
                </div>
              </div>

              {linkType === "new_page" && menuLabel && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-xs">
                  <span className="font-semibold text-indigo-900">Generated URL:</span>
                  <div className="font-mono text-indigo-700 text-[11px] mt-0.5">
                    /tenant/{tenant.id}/{slugify(menuLabel)}
                  </div>
                </div>
              )}

              {linkType === "page" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Existing Page</label>
                  <select
                    value={selectedPageId}
                    onChange={(e) => {
                      setSelectedPageId(e.target.value);
                      const target = tenant.pages.find((p) => p.id === e.target.value);
                      if (target && !menuLabel) {
                        setMenuLabel(target.title);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                  >
                    {tenant.pages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (/{p.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {linkType === "custom" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target URL or Anchor</label>
                  <input
                    type="text"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://... or #contact"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Menu / Submenu Content Editor Modal */}
      {editingContentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Editing Content for: {editingContentTarget.menuItem.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Directly editing live landing page content and HTML templates for this submenu link
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingContentTarget(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-6">
              <RichHtmlEditor
                title={`Rich Content & Pre-built Templates: ${editingContentTarget.menuItem.label}`}
                subtitle="Format visually with CKEditor or 1-click apply pre-built landing page / pricing / syllabus templates"
                initialHtml={getCurrentTargetHtml()}
                canEdit={canEdit}
                onSave={(html) => handleSaveMenuContent(html)}
              />
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingContentTarget(null)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                ✓ Done Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
