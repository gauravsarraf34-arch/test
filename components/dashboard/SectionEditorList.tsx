"use client";

import React, { useState } from "react";
import { Page, Section, SectionType, SectionThemeConfig, Tenant } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { SectionThemeControl } from "./SectionThemeControl";
import { ImageUploadField } from "./ImageUploadField";

interface SectionEditorListProps {
  page: Page;
  tenant?: Tenant;
  canEdit: boolean;
  onUpdatePage: (updater: (page: Page) => Page) => void;
}

type BlockTab = "content" | "layout" | "theme";

const TEMPLATES: {
  type: SectionType;
  title: string;
  desc: string;
  icon: string;
  defaultLayout: "cards" | "list" | "split" | "banner" | "centered";
}[] = [
  {
    type: "features",
    title: "Key Features",
    desc: "Highlight bullet points, benefits & product advantages",
    icon: "✨",
    defaultLayout: "cards",
  },
  {
    type: "testimonials",
    title: "Client Testimonials",
    desc: "Showcase customer feedback, ratings & social proof",
    icon: "💬",
    defaultLayout: "cards",
  },
  {
    type: "cta",
    title: "Call to Action",
    desc: "Engage visitors to sign up, book a call, or contact you",
    icon: "🚀",
    defaultLayout: "banner",
  },
  {
    type: "text",
    title: "About / Narrative",
    desc: "Rich storytelling, mission statement, or detailed text",
    icon: "📄",
    defaultLayout: "centered",
  },
  {
    type: "html",
    title: "Custom HTML / Snippet",
    desc: "Embed raw HTML markup or pick from pre-built templates",
    icon: "⚡",
    defaultLayout: "cards",
  },
];

const PREBUILT_HTML_SNIPPETS: { title: string; desc: string; icon: string; html: string }[] = [
  {
    title: "🌟 Modern SaaS Bento Grid",
    desc: "3-column interactive feature highlight container",
    icon: "🍱",
    html: `<div class="grid gap-6 md:grid-cols-3">
  <div class="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-6 shadow-sm">
    <div class="text-3xl mb-3">⚡</div>
    <h4 class="text-lg font-bold text-slate-900">Ultra-Fast Delivery</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">Automated workflows and zero latency deployment worldwide.</p>
  </div>
  <div class="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-6 shadow-sm">
    <div class="text-3xl mb-3">🛡️</div>
    <h4 class="text-lg font-bold text-slate-900">Enterprise Security</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">End-to-end encrypted storage and role-based multi-tenant safety.</p>
  </div>
  <div class="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/80 p-6 shadow-sm">
    <div class="text-3xl mb-3">📈</div>
    <h4 class="text-lg font-bold text-slate-900">Predictive Analytics</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">Real-time data visualization and intelligent conversion reports.</p>
  </div>
</div>`,
  },
  {
    title: "🚀 High-Conversion Dual CTA Box",
    desc: "Bold gradient container with primary and secondary action buttons",
    icon: "🎯",
    html: `<div class="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 sm:p-12 text-center text-white shadow-2xl">
  <span class="inline-flex rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200">
    Exclusive Opportunity
  </span>
  <h2 class="mt-4 text-3xl sm:text-4xl font-black tracking-tight">Accelerate Your Organization Today</h2>
  <p class="mt-3 text-sm text-indigo-100/80 max-w-xl mx-auto leading-relaxed">
    Join hundreds of world-class teams already delivering extraordinary results with our digital platform.
  </p>
  <div class="mt-8 flex flex-wrap justify-center gap-4">
    <a href="#contact" class="rounded-xl bg-white px-7 py-3 text-xs font-bold text-indigo-950 shadow-lg hover:bg-indigo-50 transition">
      Get Started Now →
    </a>
    <a href="#learn" class="rounded-xl border border-white/20 px-7 py-3 text-xs font-bold text-white hover:bg-white/10 transition">
      Schedule a Demo
    </a>
  </div>
</div>`,
  },
  {
    title: "❓ FAQ Accordion List",
    desc: "Clean frequently asked questions block",
    icon: "❓",
    html: `<div class="space-y-4 max-w-3xl mx-auto">
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
    <h4 class="text-sm font-bold text-slate-900">How quickly can our team get started?</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">Instant onboarding. You can launch your portal and configure branding in less than 5 minutes.</p>
  </div>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
    <h4 class="text-sm font-bold text-slate-900">Can each tenant have independent color themes?</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">Yes! Every single section (Header, Hero, Content Blocks, Modules, Footer) has fully isolated color controls.</p>
  </div>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
    <h4 class="text-sm font-bold text-slate-900">Is custom HTML or CKEditor supported?</h4>
    <p class="mt-2 text-xs text-slate-600 leading-relaxed">Full custom HTML snippets and CKEditor templates can be embedded anywhere with zero restrictions.</p>
  </div>
</div>`,
  },
  {
    title: "💎 Executive Quote Spotlight",
    desc: "Large featured customer testimonial with avatar and role",
    icon: "💬",
    html: `<div class="rounded-3xl border border-slate-200/80 bg-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
  <div class="text-6xl text-indigo-400/30 font-serif leading-none absolute top-4 left-6">“</div>
  <p class="relative z-10 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto text-center italic text-slate-100">
    This platform transformed our multi-branch digital delivery. We launched 12 tenant portals in days rather than months.
  </p>
  <div class="mt-6 flex flex-col items-center justify-center gap-1 text-center">
    <div class="font-bold text-sm text-indigo-300">Alexandria Vance</div>
    <div class="text-xs text-slate-400">Chief Operating Officer, Global Academic Network</div>
  </div>
</div>`,
  },
];

export function SectionEditorList({ page, tenant, canEdit, onUpdatePage }: SectionEditorListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeCardTabs, setActiveCardTabs] = useState<Record<string, BlockTab>>({});
  const [showHtmlSnippetsModal, setShowHtmlSnippetsModal] = useState<string | null>(null);

  const generateId = () => `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const getActiveTab = (secId: string): BlockTab => activeCardTabs[secId] || "content";
  const setActiveTab = (secId: string, tab: BlockTab) => {
    setActiveCardTabs((prev) => ({ ...prev, [secId]: tab }));
  };

  const handleAddSection = (type: SectionType) => {
    if (!canEdit) return;

    let newSection: Section;
    if (type === "features") {
      newSection = {
        id: generateId(),
        type: "features",
        title: "Why Choose Our Solution",
        description: "Engineered for speed, performance, and intuitive management.",
        content: "",
        items: ["Real-time synchronization", "Enterprise grade security", "Zero coding required"],
        layout: "cards",
        columns: 3,
        badge: "ADVANTAGES",
        icon: "✨",
      };
    } else if (type === "testimonials") {
      newSection = {
        id: generateId(),
        type: "testimonials",
        title: "Trusted by Modern Teams",
        description: "See how organizations accelerate their workflow with our platform.",
        content: "",
        items: [
          '"This CMS saved our marketing team 15+ hours every week."',
          '"The multi-tenant capability transformed our client delivery."',
        ],
        layout: "cards",
        columns: 2,
        badge: "SOCIAL PROOF",
        icon: "💬",
      };
    } else if (type === "cta") {
      newSection = {
        id: generateId(),
        type: "cta",
        title: "Ready to Get Started?",
        description: "Join hundreds of businesses growing with our platform today.",
        content: "Schedule a personalized demonstration or start your free trial now.",
        items: [],
        layout: "banner",
        badge: "GET IN TOUCH",
        buttonText: "Claim Your Free Trial",
        buttonUrl: "#contact",
        secondaryButtonText: "Explore Features",
        secondaryButtonUrl: "#features",
      };
    } else if (type === "html") {
      newSection = {
        id: generateId(),
        type: "html",
        title: "Special Feature Card",
        description: "Custom pre-built HTML container",
        content: "",
        items: [],
        layout: "cards",
        customHtml: PREBUILT_HTML_SNIPPETS[0].html,
      };
    } else {
      newSection = {
        id: generateId(),
        type: "text",
        title: "Our Story & Vision",
        description: "We are committed to delivering human-centric experiences.",
        content: "Every journey begins with a clear mission and purposeful execution. We build digital tools designed to empower creators, institutions, and growing enterprises worldwide.",
        items: [],
        layout: "centered",
        badge: "OUR MISSION",
      };
    }

    onUpdatePage((p) => ({
      ...p,
      sections: [...p.sections, newSection],
    }));
    setShowAddMenu(false);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (!canEdit) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.sections.length) return;

    const updated = [...page.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    onUpdatePage((p) => ({ ...p, sections: updated }));
  };

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    onUpdatePage((p) => ({
      ...p,
      sections: p.sections.filter((s) => s.id !== id),
    }));
  };

  const handleUpdate = (id: string, key: keyof Section, value: unknown) => {
    if (!canEdit) return;
    onUpdatePage((p) => ({
      ...p,
      sections: p.sections.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Trigger */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Content Blocks ({page.sections.length})
              </h3>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                Fully Configurable
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Add, arrange, configure block layout, action buttons, items, and custom color themes
            </p>
          </div>
          <HelpTooltip tooltip="Every content block can be individually configured with custom layouts (Card Grid, Banner, Split, Centered), CTA buttons, badge pills, and dedicated color themes." />

          {canEdit && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 cursor-pointer"
              >
                <span>+ Add Content Block</span>
                <span className="text-[10px]">{showAddMenu ? "▲" : "▼"}</span>
              </button>

              {/* Template Picker Dropdown */}
              {showAddMenu && (
                <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Choose Block Template
                  </p>
                  <div className="space-y-1">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.type}
                        type="button"
                        onClick={() => handleAddSection(tmpl.type)}
                        className="w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-indigo-50/70 cursor-pointer group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{tmpl.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">{tmpl.title}</p>
                          <p className="text-[11px] text-slate-500 leading-tight">{tmpl.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section Cards List */}
        <div className="mt-5 space-y-5">
          {page.sections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
              <span className="text-3xl">🧩</span>
              <h4 className="mt-2 text-sm font-bold text-slate-800">No Content Blocks Added</h4>
              <p className="text-xs text-slate-500 mt-1">
                Click "+ Add Content Block" above to add features, testimonials, CTA banners, custom HTML, or story sections.
              </p>
            </div>
          ) : (
            page.sections.map((section, index) => {
              const curTab = getActiveTab(section.id);
              const hasCustomTheme = section.theme && (section.theme.bgColor || section.theme.textColor);

              return (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition focus-within:border-indigo-500"
                >
                  {/* Card Header Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-4 bg-slate-50/80 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{section.icon || (section.type === "features" ? "✨" : section.type === "testimonials" ? "💬" : section.type === "cta" ? "🚀" : section.type === "html" ? "⚡" : "📄")}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{section.title || "Untitled Block"}</span>
                          <span className="rounded-md bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-indigo-700">
                            {section.type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">#{index + 1}</span>
                          {hasCustomTheme && (
                            <span className="rounded-md bg-purple-100 px-1.5 py-0.2 text-[9px] font-bold text-purple-700">
                              🎨 Custom Color
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm">{section.description || "No description set"}</p>
                      </div>
                    </div>

                    {canEdit && (
                      <div className="flex items-center gap-1.5">
                        {/* Tab Switcher inside block */}
                        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveTab(section.id, "content")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              curTab === "content" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            📝 Content
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab(section.id, "layout")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              curTab === "layout" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            ⚙️ Layout & Options
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab(section.id, "theme")}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                              curTab === "theme" ? "bg-purple-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            🎨 Colors
                          </button>
                        </div>

                        {/* Move Up/Down/Delete */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          className="rounded-lg p-1.5 text-xs text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === page.sections.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="rounded-lg p-1.5 text-xs text-slate-500 hover:bg-slate-200/70 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(section.id)}
                          className="ml-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                          title="Delete block"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Body Tabs */}
                  <div className="p-5">
                    {/* ================= TAB 1: CONTENT ================= */}
                    {curTab === "content" && (
                      <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Section Heading</label>
                            <input
                              type="text"
                              disabled={!canEdit}
                              value={section.title}
                              onChange={(e) => handleUpdate(section.id, "title", e.target.value)}
                              placeholder="e.g. Why Choose Our Solution"
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Block Type</label>
                            <select
                              disabled={!canEdit}
                              value={section.type}
                              onChange={(e) => handleUpdate(section.id, "type", e.target.value as SectionType)}
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                            >
                              <option value="features">Key Features</option>
                              <option value="testimonials">Client Testimonials</option>
                              <option value="cta">Call to Action (CTA)</option>
                              <option value="text">About / Narrative</option>
                              <option value="html">Custom HTML / Snippet</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700">Subtitle / Description</label>
                          <textarea
                            rows={2}
                            disabled={!canEdit}
                            value={section.description}
                            onChange={(e) => handleUpdate(section.id, "description", e.target.value)}
                            placeholder="A concise summary explaining this section..."
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                          />
                        </div>

                        {/* Custom HTML Editor */}
                        {section.type === "html" ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-[11px] font-semibold text-slate-700">
                                HTML Markup & Templates
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowHtmlSnippetsModal(section.id)}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
                              >
                                <span>📚 Browse Pre-Built HTML Snippets</span>
                              </button>
                            </div>
                            <textarea
                              rows={8}
                              disabled={!canEdit}
                              value={section.customHtml || ""}
                              onChange={(e) => handleUpdate(section.id, "customHtml", e.target.value)}
                              placeholder="<div class='...'>Write or paste raw HTML here...</div>"
                              className="w-full rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-400 focus:border-indigo-500 focus:outline-none leading-relaxed"
                            />
                          </div>
                        ) : (
                          <>
                            {/* Detailed Content / Paragraphs */}
                            {(section.type === "text" || section.type === "cta") && (
                              <div>
                                <label className="block text-[11px] font-semibold text-slate-700">
                                  Body Content / Text Details
                                </label>
                                <textarea
                                  rows={3}
                                  disabled={!canEdit}
                                  value={section.content}
                                  onChange={(e) => handleUpdate(section.id, "content", e.target.value)}
                                  placeholder="Enter detailed content, paragraphs, or instructions..."
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                                />
                              </div>
                            )}

                            {/* List Items / Testimonial Quotes */}
                            {(section.type === "features" || section.type === "testimonials") && (
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="block text-[11px] font-semibold text-slate-700">
                                    {section.type === "features" ? "Feature Items (one per line)" : "Testimonials & Quotes (one per line)"}
                                  </label>
                                  <span className="text-[10px] text-slate-400">
                                    {section.items?.length || 0} items configured
                                  </span>
                                </div>
                                <textarea
                                  rows={4}
                                  disabled={!canEdit}
                                  value={(section.items || []).join("\n")}
                                  onChange={(e) =>
                                    handleUpdate(
                                      section.id,
                                      "items",
                                      e.target.value.split("\n").filter((item) => item.trim().length > 0)
                                    )
                                  }
                                  placeholder={
                                    section.type === "features"
                                      ? "Real-time synchronization\nEnterprise grade security\nZero coding required"
                                      : '"This CMS transformed our marketing operations."\n"Saved over 20 hours of manual page building every week."'
                                  }
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none font-mono"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* ================= TAB 2: LAYOUT & CONFIGURATION OPTIONS ================= */}
                    {curTab === "layout" && (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                          <h4 className="text-xs font-bold text-indigo-950">Block Display & Visual Configuration</h4>
                          <p className="text-[11px] text-indigo-700/80">Customize how this block renders on your public page and live preview</p>
                        </div>

                        {/* Layout Style Mode */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                            Display Layout Mode
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {[
                              { id: "cards", label: "🔲 Card Grid", desc: "Multi-column cards" },
                              { id: "banner", label: "🏷️ Full Banner", desc: "Wide callout box" },
                              { id: "split", label: "↔️ Split Media", desc: "Side-by-side layout" },
                              { id: "centered", label: "🎯 Centered", desc: "Focused alignment" },
                              { id: "list", label: "📋 Compact List", desc: "Sequential rows" },
                            ].map((opt) => {
                              const isSelected = (section.layout || "cards") === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={() => handleUpdate(section.id, "layout", opt.id)}
                                  className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                                    isSelected
                                      ? "border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-500/20 font-bold"
                                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                  }`}
                                >
                                  <p className="text-xs">{opt.label}</p>
                                  <p className="text-[10px] text-slate-500 font-normal">{opt.desc}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Columns & Badge Pill */}
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Grid Columns</label>
                            <select
                              disabled={!canEdit}
                              value={section.columns || 3}
                              onChange={(e) => handleUpdate(section.id, "columns", parseInt(e.target.value))}
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                            >
                              <option value={1}>1 Column (Full Width)</option>
                              <option value={2}>2 Columns (Half Width)</option>
                              <option value={3}>3 Columns (Standard Grid)</option>
                              <option value={4}>4 Columns (Compact Grid)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Badge Tag Pill</label>
                            <input
                              type="text"
                              disabled={!canEdit}
                              value={section.badge || ""}
                              onChange={(e) => handleUpdate(section.id, "badge", e.target.value)}
                              placeholder="e.g. POPULAR, NEW, HIGHLIGHT"
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none uppercase"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-700">Block Icon / Emoji</label>
                            <input
                              type="text"
                              disabled={!canEdit}
                              maxLength={4}
                              value={section.icon || ""}
                              onChange={(e) => handleUpdate(section.id, "icon", e.target.value)}
                              placeholder="e.g. ✨, 🚀, 💡"
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* CTA Buttons & Destination Links */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                          <h5 className="text-xs font-bold text-slate-800">Action Buttons & Links</h5>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700">Primary Button Label</label>
                              <input
                                type="text"
                                disabled={!canEdit}
                                value={section.buttonText || ""}
                                onChange={(e) => handleUpdate(section.id, "buttonText", e.target.value)}
                                placeholder="e.g. Get Started, Learn More"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700">Primary Button Link (URL)</label>
                              <input
                                type="text"
                                disabled={!canEdit}
                                value={section.buttonUrl || ""}
                                onChange={(e) => handleUpdate(section.id, "buttonUrl", e.target.value)}
                                placeholder="e.g. /contact, https://..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700">Secondary Button Label (Optional)</label>
                              <input
                                type="text"
                                disabled={!canEdit}
                                value={section.secondaryButtonText || ""}
                                onChange={(e) => handleUpdate(section.id, "secondaryButtonText", e.target.value)}
                                placeholder="e.g. View Documentation"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-700">Secondary Button Link (URL)</label>
                              <input
                                type="text"
                                disabled={!canEdit}
                                value={section.secondaryButtonUrl || ""}
                                onChange={(e) => handleUpdate(section.id, "secondaryButtonUrl", e.target.value)}
                                placeholder="e.g. #details"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-500 focus:outline-none font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Upload / URL (for Split or Banner Layout) */}
                        <ImageUploadField
                          label="Section Image / Media Asset"
                          value={section.imageUrl || ""}
                          placeholder="https://... or click Upload Image"
                          tenant={tenant}
                          canEdit={canEdit}
                          helpText="Upload a photo from your device, choose from Media Gallery, or paste a URL"
                          onChange={(url) => handleUpdate(section.id, "imageUrl", url)}
                        />
                      </div>
                    )}

                    {/* ================= TAB 3: COLOR THEME ================= */}
                    {curTab === "theme" && (
                      <div className="space-y-4">
                        <SectionThemeControl
                          title={`${section.title || "Content Block"} Theme`}
                          theme={section.theme}
                          tenant={tenant}
                          canEdit={canEdit}
                          onChange={(themeConfig) => handleUpdate(section.id, "theme", themeConfig)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pre-Built HTML Snippets Modal */}
      {showHtmlSnippetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">📚 1-Click Pre-Built HTML Templates</h3>
                <p className="text-xs text-slate-500">Pick any responsive block to insert directly into this section</p>
              </div>
              <button
                type="button"
                onClick={() => setShowHtmlSnippetsModal(null)}
                className="rounded-lg p-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-h-96 overflow-y-auto pr-1">
              {PREBUILT_HTML_SNIPPETS.map((snippet, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 hover:border-indigo-500 hover:bg-white transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{snippet.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{snippet.title}</h4>
                      <p className="text-[10px] text-slate-500">{snippet.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdate(showHtmlSnippetsModal, "customHtml", snippet.html);
                      setShowHtmlSnippetsModal(null);
                    }}
                    className="w-full mt-2 rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer"
                  >
                    Insert Template →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
