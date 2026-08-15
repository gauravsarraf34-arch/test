"use client";

import React from "react";
import { Tenant, LayoutStyle, ThemeMode, ContainerWidth, PagePadding } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { ImageUploadField } from "./ImageUploadField";

interface ThemeEditorProps {
  tenant: Tenant;
  canEdit: boolean;
  canDelete?: boolean;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
  onDeleteTenant?: (tenantId: string) => void;
}

const PRESET_PALETTES = [
  { name: "Indigo Tech", primary: "#4f46e5", secondary: "#0f172a", accent: "#06b6d4" },
  { name: "Emerald Bio", primary: "#059669", secondary: "#064e3b", accent: "#10b981" },
  { name: "Midnight Purple", primary: "#7c3aed", secondary: "#18181b", accent: "#f43f5e" },
  { name: "Ocean Sapphire", primary: "#2563eb", secondary: "#0f172a", accent: "#f59e0b" },
  { name: "Rose Luxury", primary: "#e11d48", secondary: "#1c1917", accent: "#fb7185" },
  { name: "Slate Minimal", primary: "#334155", secondary: "#020617", accent: "#64748b" },
];

export function ThemeEditor({ tenant, canEdit, canDelete = false, onUpdateTenant, onDeleteTenant }: ThemeEditorProps) {
  const { theme } = tenant;

  const handleApplyPalette = (palette: (typeof PRESET_PALETTES)[0]) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      theme: {
        ...t.theme,
        primary: palette.primary,
        secondary: palette.secondary,
        accent: palette.accent,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Brand Identity */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Brand Identity & Navigation</h3>
            <p className="text-xs text-slate-500">Configure logo branding and top navigation links</p>
          </div>
          <HelpTooltip tooltip="Logo text is displayed in the header across all pages. Top navigation links are visible on the website navbar." />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Logo Text / Brand Name</label>
            <input
              type="text"
              disabled={!canEdit}
              value={tenant.logoText}
              onChange={(e) => onUpdateTenant((t) => ({ ...t, logoText: e.target.value }))}
              placeholder="e.g. Northwind Studio"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Custom Domain</label>
            <input
              type="text"
              disabled={!canEdit}
              value={tenant.domain}
              onChange={(e) => onUpdateTenant((t) => ({ ...t, domain: e.target.value }))}
              placeholder="e.g. yourbrand.com"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploadField
              label="Brand Logo Graphic / Icon (Optional)"
              value={tenant.logoImage || ""}
              placeholder="https://... or click Upload Image"
              tenant={tenant}
              canEdit={canEdit}
              helpText="Upload a PNG/SVG logo icon to display in place of or alongside the text logo in the header"
              onChange={(url) => onUpdateTenant((t) => ({ ...t, logoImage: url }))}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">
              Header Navigation Links (comma separated)
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={tenant.nav.join(", ")}
              onChange={(e) =>
                onUpdateTenant((t) => ({
                  ...t,
                  nav: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              placeholder="Home, About, Services, Pricing, Contact"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Color Palette Engine */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Color Palette & Mood</h3>
            <p className="text-xs text-slate-500">Pick custom brand colors or choose a designer palette</p>
          </div>
          <HelpTooltip tooltip="Primary color controls main buttons and highlights. Accent color is used for badges and notices." />
        </div>

        {/* Preset Palettes */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-600 block mb-2">Curated Palettes</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESET_PALETTES.map((palette) => (
              <button
                key={palette.name}
                type="button"
                disabled={!canEdit}
                onClick={() => handleApplyPalette(palette)}
                className="group flex flex-col items-start p-2 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition text-left bg-slate-50/50"
              >
                <div className="flex w-full h-6 rounded-lg overflow-hidden mb-1.5 border border-black/10">
                  <div className="flex-1" style={{ backgroundColor: palette.primary }} />
                  <div className="w-4" style={{ backgroundColor: palette.accent }} />
                  <div className="w-4" style={{ backgroundColor: palette.secondary }} />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 truncate w-full group-hover:text-indigo-600">
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Pickers */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={!canEdit}
                value={theme.primary}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, primary: e.target.value },
                  }))
                }
                className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <input
                type="text"
                disabled={!canEdit}
                value={theme.primary}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, primary: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={!canEdit}
                value={theme.accent}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, accent: e.target.value },
                  }))
                }
                className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <input
                type="text"
                disabled={!canEdit}
                value={theme.accent}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, accent: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary / Dark BG</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                disabled={!canEdit}
                value={theme.secondary}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, secondary: e.target.value },
                  }))
                }
                className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <input
                type="text"
                disabled={!canEdit}
                value={theme.secondary}
                onChange={(e) =>
                  onUpdateTenant((t) => ({
                    ...t,
                    theme: { ...t.theme, secondary: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout & Mode */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Layout & Theme Mode</h3>
            <p className="text-xs text-slate-500">Select website presentation style</p>
          </div>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {/* Theme Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Display Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as ThemeMode[]).map((mode) => {
                const isSelected = theme.mode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    disabled={!canEdit}
                    onClick={() =>
                      onUpdateTenant((t) => ({
                        ...t,
                        theme: { ...t.theme, mode },
                      }))
                    }
                    className={`flex items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{mode === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Layout Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(["modern", "classic", "minimal"] as LayoutStyle[]).map((layout) => {
                const isSelected = theme.layout === layout;
                return (
                  <button
                    key={layout}
                    type="button"
                    disabled={!canEdit}
                    onClick={() =>
                      onUpdateTenant((t) => ({
                        ...t,
                        theme: { ...t.theme, layout },
                      }))
                    }
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium text-xs"
                    }`}
                  >
                    <span className="capitalize text-xs">{layout}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Website Container Max-Width */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">Page Container Max-Width</label>
              <span className="text-[11px] font-mono text-indigo-600 font-bold">
                {theme.containerWidth === "wide"
                  ? "1440px (Wide Standard)"
                  : theme.containerWidth === "standard"
                  ? "1280px (Standard)"
                  : theme.containerWidth === "full"
                  ? "100% (Fluid)"
                  : "1024px (Compact)"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "wide" as ContainerWidth, label: "🌟 Wide (1440px)", desc: "Optimal for modern screens (Recommended)" },
                { id: "standard" as ContainerWidth, label: "📏 Standard (1280px)", desc: "Classic responsive standard" },
                { id: "full" as ContainerWidth, label: "🖥️ Full Width (100%)", desc: "Fluid edge-to-edge layout" },
                { id: "compact" as ContainerWidth, label: "📖 Compact (1024px)", desc: "Focused reading width" },
              ].map((opt) => {
                const isSelected = (theme.containerWidth || "wide") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() =>
                      onUpdateTenant((t) => ({
                        ...t,
                        theme: { ...t.theme, containerWidth: opt.id },
                      }))
                    }
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side Margins & Horizontal Padding */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">Side Margins & Screen Padding</label>
              <span className="text-[11px] font-mono text-indigo-600 font-bold">
                {theme.pagePadding === "spacious"
                  ? "Spacious (px-16)"
                  : theme.pagePadding === "compact"
                  ? "Compact (px-4)"
                  : "Balanced (px-8)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "standard" as PagePadding, label: "Balanced", desc: "Standard margins" },
                { id: "spacious" as PagePadding, label: "Spacious", desc: "Luxury whitespace" },
                { id: "compact" as PagePadding, label: "Slim", desc: "Max screen area" },
              ].map((opt) => {
                const isSelected = (theme.pagePadding || "standard") === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() =>
                      onUpdateTenant((t) => ({
                        ...t,
                        theme: { ...t.theme, pagePadding: opt.id },
                      }))
                    }
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs"
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Delete Brand / Tenant */}
      {canDelete && onDeleteTenant && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-rose-900">⚠️ Danger Zone: Delete Brand</h3>
              <p className="text-xs text-rose-700 mt-0.5">
                Permanently delete <strong>{tenant.name}</strong> ({tenant.domain}) and all its pages, media, and navigation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDeleteTenant(tenant.id)}
              className="rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 shadow-xs transition hover:bg-rose-600 hover:text-white cursor-pointer"
            >
              🗑️ Delete This Brand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
