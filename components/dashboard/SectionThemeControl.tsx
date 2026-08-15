"use client";

import React, { useState } from "react";
import { SectionThemeConfig, Tenant } from "@/types/cms";

interface SectionThemeControlProps {
  title: string;
  theme?: SectionThemeConfig;
  tenant?: Tenant;
  canEdit: boolean;
  onChange: (theme: SectionThemeConfig) => void;
  defaultExpanded?: boolean;
}

export function SectionThemeControl({
  title,
  theme,
  tenant,
  canEdit,
  onChange,
  defaultExpanded = false,
}: SectionThemeControlProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const currentPreset = theme?.preset || "default";

  const brandPrimary = tenant?.theme.primary || "#4f46e5";
  const brandAccent = tenant?.theme.accent || "#fde047";

  const THEME_PRESETS = [
    {
      id: "default",
      label: "⚪ Default",
      bg: "",
      text: "",
      accent: "",
      border: "",
      cardBg: "",
    },
    {
      id: "midnight-slate",
      label: "🌌 Midnight Slate",
      bg: "#090d16",
      text: "#f8fafc",
      accent: "#38bdf8",
      border: "#1e293b",
      cardBg: "rgba(255,255,255,0.04)",
    },
    {
      id: "brand-royal",
      label: "💎 Royal Brand",
      bg: brandPrimary,
      text: "#ffffff",
      accent: brandAccent,
      border: "rgba(255,255,255,0.2)",
      cardBg: "rgba(0,0,0,0.1)",
    },
    {
      id: "gradient-purple",
      label: "🍇 Royal Purple",
      bg: "linear-gradient(135deg, #1e1b4b, #581c87)",
      text: "#ffffff",
      accent: "#c084fc",
      border: "rgba(255,255,255,0.15)",
      cardBg: "rgba(255,255,255,0.06)",
    },
    {
      id: "gradient-emerald",
      label: "🌿 Deep Emerald",
      bg: "linear-gradient(135deg, #022c22, #047857)",
      text: "#ffffff",
      accent: "#6ee7b7",
      border: "rgba(255,255,255,0.15)",
      cardBg: "rgba(255,255,255,0.06)",
    },
    {
      id: "sunset-amber",
      label: "🌅 Sunset Amber",
      bg: "linear-gradient(135deg, #451a03, #b45309)",
      text: "#ffffff",
      accent: "#fde047",
      border: "rgba(255,255,255,0.15)",
      cardBg: "rgba(255,255,255,0.06)",
    },
    {
      id: "rose-blush",
      label: "🌸 Rose Blush",
      bg: "#fff1f2",
      text: "#0f172a",
      accent: "#e11d48",
      border: "#ffe4e6",
      cardBg: "#ffffff",
    },
    {
      id: "clean-cloud",
      label: "☁️ Soft Cloud",
      bg: "#f8fafc",
      text: "#0f172a",
      accent: "#2563eb",
      border: "#e2e8f0",
      cardBg: "#ffffff",
    },
  ];

  const handleApplyPreset = (preset: typeof THEME_PRESETS[0]) => {
    if (!canEdit) return;
    if (preset.id === "default") {
      onChange({
        preset: "default",
        bgColor: undefined,
        textColor: undefined,
        accentColor: undefined,
        borderColor: undefined,
        cardBgColor: undefined,
      });
    } else {
      onChange({
        preset: preset.id,
        bgColor: preset.bg,
        textColor: preset.text,
        accentColor: preset.accent,
        borderColor: preset.border,
        cardBgColor: preset.cardBg,
      });
    }
  };

  const handleFieldChange = (field: keyof SectionThemeConfig, value: string) => {
    if (!canEdit) return;
    onChange({
      ...(theme || {}),
      preset: "custom",
      [field]: value || undefined,
    });
  };

  const hasCustomTheme = Boolean(
    theme && (theme.bgColor || theme.textColor || theme.accentColor || theme.borderColor)
  );

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4 transition">
      {/* Header Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🎨</span>
          <div>
            <span className="text-xs font-bold text-slate-900">{title} Color Theme</span>
            {hasCustomTheme && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                Custom Theme Active
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 shadow-xs transition"
        >
          {isOpen ? "Hide Color Controls ▲" : "Configure Colors ▾"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 pt-3 border-t border-indigo-100 animate-in fade-in duration-150">
          {/* 1-Click Presets Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              1-Click Theme Presets
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {THEME_PRESETS.map((p) => {
                const isSelected = currentPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => handleApplyPreset(p)}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50"
                    }`}
                  >
                    <div>{p.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Pickers */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Custom Hex & CSS Gradient Pickers
            </label>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Background Color */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Background / Gradient
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!canEdit}
                    value={
                      theme?.bgColor?.startsWith("#")
                        ? theme.bgColor
                        : "#ffffff"
                    }
                    onChange={(e) => handleFieldChange("bgColor", e.target.value)}
                    className="h-7 w-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={theme?.bgColor || ""}
                    onChange={(e) => handleFieldChange("bgColor", e.target.value)}
                    placeholder="#ffffff or linear-gradient(...)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Text & Typography
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!canEdit}
                    value={theme?.textColor?.startsWith("#") ? theme.textColor : "#0f172a"}
                    onChange={(e) => handleFieldChange("textColor", e.target.value)}
                    className="h-7 w-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={theme?.textColor || ""}
                    onChange={(e) => handleFieldChange("textColor", e.target.value)}
                    placeholder="#0f172a or #ffffff"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Accent / Pill / Button Color */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Accent / CTA Button
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!canEdit}
                    value={
                      theme?.accentColor?.startsWith("#")
                        ? theme.accentColor
                        : brandAccent
                    }
                    onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                    className="h-7 w-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={theme?.accentColor || ""}
                    onChange={(e) => handleFieldChange("accentColor", e.target.value)}
                    placeholder={brandAccent}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Border Color */}
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Border & Dividers
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    disabled={!canEdit}
                    value={theme?.borderColor?.startsWith("#") ? theme.borderColor : "#e2e8f0"}
                    onChange={(e) => handleFieldChange("borderColor", e.target.value)}
                    className="h-7 w-7 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={theme?.borderColor || ""}
                    onChange={(e) => handleFieldChange("borderColor", e.target.value)}
                    placeholder="#e2e8f0 or rgba(...)"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-mono focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
