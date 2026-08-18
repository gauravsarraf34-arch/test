"use client";

import React from "react";
import { Tenant, UserRole } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";

export type DashboardTab = "editor" | "menu" | "headerfooter" | "theme" | "blocks" | "media" | "preview" | "guide";

interface TenantSidebarProps {
  tenants: Tenant[];
  activeTenant: Tenant;
  selectedPageId: string;
  activeTab: DashboardTab;
  userRole: UserRole;
  canEdit: boolean;
  onSelectTenant: (tenantId: string) => void;
  onSelectPage: (pageId: string) => void;
  onSelectTab: (tab: DashboardTab) => void;
  onAddTenant: () => void;
  onDeleteTenant?: (tenantId: string) => void;
  onAddPage: () => void;
  onDeletePage: (pageId: string) => void;
  onToggleTenantStatus: () => void;
}

export function TenantSidebar({
  tenants,
  activeTenant,
  selectedPageId,
  activeTab,
  userRole,
  canEdit,
  onSelectTenant,
  onSelectPage,
  onSelectTab,
  onAddTenant,
  onDeleteTenant,
  onAddPage,
  onDeletePage,
  onToggleTenantStatus,
}: TenantSidebarProps) {
  const tabs: { id: DashboardTab; label: string; icon: string; count?: number }[] = [
    { id: "editor", label: "Page Editor", icon: "📝" },
    {
      id: "menu",
      label: "Pages & Menus",
      icon: "🧭",
      count: activeTenant.navigation?.length || activeTenant.pages.length,
    },
    { id: "headerfooter", label: "Header & Footer", icon: "📑" },
    { id: "theme", label: "Brand & Colors", icon: "🎨" },
    {
      id: "blocks",
      label: "Modules & News",
      icon: "🧩",
      count:
        (activeTenant.notices?.length || 0) +
        (activeTenant.programs?.length || 0) +
        (activeTenant.services?.length || 0) +
        (activeTenant.statistics?.length || 0),
    },
    { id: "media", label: "Media Library", icon: "🖼️", count: activeTenant.media?.length || 0 },
    { id: "preview", label: "Live Simulator", icon: "⚡" },
    { id: "guide", label: "User Manual & Guide", icon: "📖" },
  ];

  return (
    <aside className="space-y-4">
      {/* Current Tenant Card */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-pink-600">Active Tenant</p>
          <HelpTooltip tooltip="The brand/organization you are currently editing. Switch tenants or make it live." />
        </div>

        <div className="mt-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-snug">
                {activeTenant.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{activeTenant.domain}</p>
            </div>
            <div
              className="h-4 w-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-1"
              style={{ backgroundColor: activeTenant.theme.primary }}
              title="Primary Brand Color"
            />
          </div>

          <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">Status</span>
            {canEdit ? (
              <button
                type="button"
                onClick={onToggleTenantStatus}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                  activeTenant.status === "Active"
                    ? "bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100"
                    : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeTenant.status === "Active" ? "bg-pink-500" : "bg-amber-500"
                  }`}
                />
                {activeTenant.status === "Active" ? "Published" : "Draft"}
              </button>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {activeTenant.status}
              </span>
            )}
          </div>
        </div>

        {/* Tenant Switcher Dropdown / List */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Switch Tenant ({tenants.length})
            </label>
          </div>

          <select
            value={activeTenant.id}
            onChange={(e) => onSelectTenant(e.target.value)}
            aria-label="Select tenant"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-800 transition focus:border-pink-500 focus:bg-white focus:outline-none"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.status})
              </option>
            ))}
          </select>

          {userRole === "admin" && (
            <div className="mt-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={onAddTenant}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-dashed border-pink-200 py-1.5 text-xs font-medium text-pink-600 transition hover:border-pink-300 hover:bg-pink-50/50"
              >
                <span>+ New Brand</span>
              </button>
              {tenants.length > 1 && onDeleteTenant && (
                <button
                  type="button"
                  onClick={() => onDeleteTenant(activeTenant.id)}
                  className="flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50/60 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
                  title={`Delete ${activeTenant.name}`}
                >
                  <span>🗑️</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-3 shadow-sm">
        <p className="px-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Studio Navigation
        </p>

        <nav className="mt-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm shadow-pink-500/25"
                    : "text-slate-600 hover:bg-pink-50/40 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-pink-50 text-pink-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Pages List (when in editor tab) */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between px-2 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Pages ({activeTenant.pages.length})
          </p>
          <HelpTooltip tooltip="Select which page you want to edit. Toggle publish status on the editor panel." />
        </div>

        <div className="mt-2 space-y-1.5">
          {activeTenant.pages.map((page) => {
            const isSelected = page.id === selectedPageId;
            return (
              <div
                key={page.id}
                className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-pink-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectPage(page.id);
                    onSelectTab("editor");
                  }}
                  className="flex-1 text-left truncate flex items-center gap-2"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      page.published ? "bg-pink-400" : "bg-slate-300"
                    }`}
                  />
                  <span className="truncate">{page.title}</span>
                  <span
                    className={`text-[10px] font-mono opacity-60 ${
                      isSelected ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    /{page.slug}
                  </span>
                </button>

                {canEdit && activeTenant.pages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                    }}
                    title="Delete page"
                    className={`opacity-0 group-hover:opacity-100 transition text-[10px] px-1.5 py-0.5 rounded hover:bg-rose-500 hover:text-white ${
                      isSelected ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}

          {canEdit && (
            <button
              type="button"
              onClick={onAddPage}
              className="mt-1 w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-pink-200 py-2 text-xs font-semibold text-pink-700 transition hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-800"
            >
              <span>+ Add New Page</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
