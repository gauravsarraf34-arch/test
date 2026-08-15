"use client";

import React, { useState } from "react";
import { Page, Tenant, ContainerWidth, PagePadding } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { RichHtmlEditor } from "./RichHtmlEditor";
import { SectionThemeControl } from "./SectionThemeControl";
import { ImageUploadField } from "./ImageUploadField";

interface PageEditorProps {
  page: Page;
  tenant: Tenant;
  canEdit: boolean;
  onUpdatePage: (updater: (page: Page) => Page) => void;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
  onOpenMediaLibrary: () => void;
}

export function PageEditor({
  page,
  tenant,
  canEdit,
  onUpdatePage,
  onUpdateTenant,
  onOpenMediaLibrary,
}: PageEditorProps) {
  const [editorStyle, setEditorStyle] = useState<"standard" | "html">(
    page.useCustomHtml ? "html" : "standard"
  );

  const handleToggleEditorStyle = (style: "standard" | "html") => {
    setEditorStyle(style);
    onUpdatePage((p) => ({
      ...p,
      useCustomHtml: style === "html",
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header Status Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">{page.title}</h3>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                /{page.slug}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Edit landing page content, hero banner, or pre-built HTML</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Editor Mode Selector: Standard Blocks vs Pre-built HTML / CKEditor */}
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => handleToggleEditorStyle("standard")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  editorStyle === "standard"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🧩 Standard Blocks
              </button>
              <button
                type="button"
                onClick={() => handleToggleEditorStyle("html")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  editorStyle === "html"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ✨ Full HTML / Templates
              </button>
            </div>

            <button
              type="button"
              disabled={!canEdit}
              onClick={() => onUpdatePage((p) => ({ ...p, published: !p.published }))}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
                page.published
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${page.published ? "bg-emerald-300" : "bg-slate-400"}`} />
              <span>{page.published ? "Published (Live)" : "Draft Mode"}</span>
            </button>
          </div>
        </div>

        {/* Page Identity Fields */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Page Navigation Title</label>
            <input
              type="text"
              disabled={!canEdit}
              value={page.title}
              onChange={(e) => onUpdatePage((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Home, About Us, Admissions"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Page URL Slug</label>
            <input
              type="text"
              disabled={!canEdit || page.slug === "home"}
              value={page.slug}
              onChange={(e) => onUpdatePage((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-") }))}
              placeholder="e.g. services, about"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-mono font-medium focus:border-indigo-600 focus:bg-white focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      {/* When Full HTML / Pre-built Template Mode is Active */}
      {editorStyle === "html" ? (
        <RichHtmlEditor
          title={`Page HTML & CKEditor: ${page.title}`}
          subtitle="Use CKEditor tools or 1-click insert pre-built landing page / pricing / syllabus templates"
          initialHtml={page.customHtml || ""}
          canEdit={canEdit}
          onSave={(html) =>
            onUpdatePage((p) => ({
              ...p,
              customHtml: html,
              useCustomHtml: true,
            }))
          }
        />
      ) : (
        /* Standard Hero Banner Editor */
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Hero Banner</h3>
              <p className="text-xs text-slate-500">The primary headline and call-to-action shown at the top</p>
            </div>
            <HelpTooltip tooltip="The hero banner is the first thing visitors see. High-impact headlines and images boost conversions." />
          </div>

          <div className="mt-5 space-y-4">
            {/* Hero Section Theme Controller */}
            <SectionThemeControl
              title="Hero Section"
              theme={page.heroTheme}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(tConfig) => onUpdatePage((p) => ({ ...p, heroTheme: tConfig }))}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700">Main Hero Headline</label>
              <input
                type="text"
                disabled={!canEdit}
                value={page.heroTitle}
                onChange={(e) => onUpdatePage((p) => ({ ...p, heroTitle: e.target.value }))}
                placeholder="e.g. Turn your brand into a digital experience"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Hero Subtitle / Description</label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={page.heroSubtitle}
                onChange={(e) => onUpdatePage((p) => ({ ...p, heroSubtitle: e.target.value }))}
                placeholder="Write a clear, compelling summary of your offering..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Call to Action (CTA) Button Text</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={page.buttonText}
                  onChange={(e) => onUpdatePage((p) => ({ ...p, buttonText: e.target.value }))}
                  placeholder="e.g. Get Started Now, Book Consultation"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <ImageUploadField
                  label="Hero Banner Image"
                  value={page.heroImage}
                  placeholder="https://... or click Upload Image"
                  tenant={tenant}
                  canEdit={canEdit}
                  helpText="Upload a high-resolution hero photo from your device or select from Media Gallery"
                  onChange={(url) => onUpdatePage((p) => ({ ...p, heroImage: url }))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO & Social Metadata */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">SEO & Social Meta Tags</h3>
            <p className="text-xs text-slate-500">Boost search ranking and preview cards on Google, Twitter, LinkedIn</p>
          </div>
          <HelpTooltip tooltip="These tags appear when your site is shared on social media and displayed in Google search results." />
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              SEO Meta Title <span className="text-slate-400 font-normal">({tenant.seoTitle?.length || 0}/60 chars)</span>
            </label>
            <input
              type="text"
              disabled={!canEdit}
              value={tenant.seoTitle}
              onChange={(e) => onUpdateTenant((t) => ({ ...t, seoTitle: e.target.value }))}
              placeholder="e.g. Northwind Studio | Modern Digital Solutions"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              SEO Meta Description <span className="text-slate-400 font-normal">({tenant.seoDescription?.length || 0}/160 chars)</span>
            </label>
            <textarea
              rows={2}
              disabled={!canEdit}
              value={tenant.seoDescription}
              onChange={(e) => onUpdateTenant((t) => ({ ...t, seoDescription: e.target.value }))}
              placeholder="A concise, compelling summary for search engines..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-medium focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Page Width & Margin Spacing */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">📐 Page Layout & Container Width</h3>
            <p className="text-xs text-slate-500">Configure margins and content max-width for this page</p>
          </div>
          <HelpTooltip tooltip="Choose between Wide Standard (1440px), Classic Standard (1280px), Full Width (100%), or Compact (1024px) for your content." />
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Content Max-Width</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "wide" as ContainerWidth, label: "🌟 Wide (1440px)", desc: "Balanced standard" },
                { id: "standard" as ContainerWidth, label: "📏 Standard (1280px)", desc: "Classic standard" },
                { id: "full" as ContainerWidth, label: "🖥️ Full Width", desc: "Edge-to-edge fluid" },
                { id: "compact" as ContainerWidth, label: "📖 Compact", desc: "Focused reading" },
              ].map((opt) => {
                const currentVal = page.containerWidth || tenant.theme.containerWidth || "wide";
                const isSelected = currentVal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => onUpdatePage((p) => ({ ...p, containerWidth: opt.id }))}
                    className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[9px] opacity-70 mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Side Margins & Screen Padding</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "standard" as PagePadding, label: "Balanced", desc: "Standard margins" },
                { id: "spacious" as PagePadding, label: "Spacious", desc: "Luxury whitespace" },
                { id: "compact" as PagePadding, label: "Slim", desc: "Max screen area" },
              ].map((opt) => {
                const currentVal = page.pagePadding || tenant.theme.pagePadding || "standard";
                const isSelected = currentVal === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => onUpdatePage((p) => ({ ...p, pagePadding: opt.id }))}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm font-bold"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs"
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span className="text-[9px] opacity-70 mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
