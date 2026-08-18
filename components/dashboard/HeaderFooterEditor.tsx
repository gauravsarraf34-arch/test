"use client";

import React, { useState } from "react";
import { Tenant, TenantHeaderConfig, TenantFooterConfig, FooterColumn, SocialLink, SocialPlatform } from "@/types/cms";
import { HelpTooltip } from "./HelpTooltip";
import { SectionThemeControl } from "./SectionThemeControl";
import { ImageUploadField } from "./ImageUploadField";

interface HeaderFooterEditorProps {
  tenant: Tenant;
  canEdit: boolean;
  onUpdateTenant: (updater: (tenant: Tenant) => Tenant) => void;
}

const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string; icon: string }[] = [
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "twitter", label: "Twitter / X", icon: "🐦" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "instagram", label: "Instagram", icon: "📸" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "github", label: "GitHub", icon: "🐙" },
];

export function HeaderFooterEditor({ tenant, canEdit, onUpdateTenant }: HeaderFooterEditorProps) {
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");

  const headerConfig: TenantHeaderConfig = tenant.headerConfig || {
    showTopBar: true,
    topBarText: "⚡ Admissions Open for 2026-27 — Apply Online Today",
    email: "contact@" + tenant.domain,
    phone: "+1 (800) 555-0199",
    address: "100 Innovation Park",
    ctaText: "Get in Touch",
    ctaLink: "#contact",
    showCta: true,
  };

  const footerConfig: TenantFooterConfig = tenant.footerConfig || {
    companyName: tenant.name,
    aboutText: `${tenant.name} delivers modern digital experiences, accredited programs, and dedicated solutions worldwide.`,
    copyrightText: `© ${new Date().getFullYear()} ${tenant.name}. All rights reserved.`,
    phone: "+1 (800) 555-0199",
    email: "support@" + tenant.domain,
    address: "100 Innovation Boulevard, Tech Park Suite 400",
    workingHours: "Mon – Fri: 08:00 AM – 06:00 PM",
    showNewsletter: true,
    newsletterHeadline: "Stay updated with our latest announcements & news",
    columns: [
      {
        title: "Quick Links",
        links: [
          { label: "Home", url: `/tenant/${tenant.id}` },
          { label: "About Us", url: "#" },
          { label: "Programs", url: "#" },
          { label: "Services", url: "#" },
        ],
      },
      {
        title: "Resources & Legal",
        links: [
          { label: "Privacy Policy", url: "#" },
          { label: "Terms of Service", url: "#" },
          { label: "Help Center", url: "#" },
          { label: "Official Notices", url: "#" },
        ],
      },
    ],
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "twitter", url: "https://twitter.com" },
    ],
  };

  const updateHeader = (updater: (h: TenantHeaderConfig) => TenantHeaderConfig) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      headerConfig: updater(t.headerConfig || headerConfig),
    }));
  };

  const updateFooter = (updater: (f: TenantFooterConfig) => TenantFooterConfig) => {
    if (!canEdit) return;
    onUpdateTenant((t) => ({
      ...t,
      footerConfig: updater(t.footerConfig || footerConfig),
    }));
  };

  // Footer Column Handlers
  const handleAddFooterColumn = () => {
    const newCol: FooterColumn = {
      title: "New Category",
      links: [
        { label: "Sample Link", url: "#" },
      ],
    };
    updateFooter((f) => ({
      ...f,
      columns: [...(f.columns || []), newCol],
    }));
  };

  const handleUpdateColumnTitle = (colIndex: number, title: string) => {
    updateFooter((f) => ({
      ...f,
      columns: (f.columns || []).map((col, idx) =>
        idx === colIndex ? { ...col, title } : col
      ),
    }));
  };

  const handleDeleteColumn = (colIndex: number) => {
    updateFooter((f) => ({
      ...f,
      columns: (f.columns || []).filter((_, idx) => idx !== colIndex),
    }));
  };

  const handleAddLinkToColumn = (colIndex: number) => {
    updateFooter((f) => ({
      ...f,
      columns: (f.columns || []).map((col, idx) =>
        idx === colIndex
          ? { ...col, links: [...col.links, { label: "New Link", url: "#" }] }
          : col
      ),
    }));
  };

  const handleUpdateColumnLink = (colIndex: number, linkIndex: number, field: "label" | "url", value: string) => {
    updateFooter((f) => ({
      ...f,
      columns: (f.columns || []).map((col, idx) => {
        if (idx !== colIndex) return col;
        return {
          ...col,
          links: col.links.map((l, lIdx) => (lIdx === linkIndex ? { ...l, [field]: value } : l)),
        };
      }),
    }));
  };

  const handleDeleteColumnLink = (colIndex: number, linkIndex: number) => {
    updateFooter((f) => ({
      ...f,
      columns: (f.columns || []).map((col, idx) => {
        if (idx !== colIndex) return col;
        return {
          ...col,
          links: col.links.filter((_, lIdx) => lIdx !== linkIndex),
        };
      }),
    }));
  };

  // Social Links Handler
  const handleUpdateSocialLink = (platform: SocialPlatform, url: string) => {
    const existing = footerConfig.socialLinks || [];
    const filtered = existing.filter((s) => s.platform !== platform);
    if (url.trim()) {
      filtered.push({ platform, url: url.trim() });
    }
    updateFooter((f) => ({ ...f, socialLinks: filtered }));
  };

  const getSocialUrl = (platform: SocialPlatform) => {
    const match = (footerConfig.socialLinks || []).find((s) => s.platform === platform);
    return match ? match.url : "";
  };

  return (
    <div className="space-y-6">
      {/* Top Selector Card */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Header & Footer Global Details</h3>
            <p className="text-xs text-slate-500">
              Configure company contact details, top notification bar, address, phone, and footer navigation columns
            </p>
          </div>
          <HelpTooltip tooltip="Header top bar displays quick phone/email contact. Footer displays full multi-column links, contact details, and social channels." />

          {/* Section Toggle */}
          <div className="flex rounded-xl border border-pink-100 bg-pink-50/40 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("header")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                activeTab === "header"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏷️ Header & Contact Bar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("footer")}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
                activeTab === "footer"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📑 Footer & Company Details
            </button>
          </div>
        </div>

        {/* ================= HEADER CONFIG TAB ================= */}
        {activeTab === "header" && (
          <div className="mt-6 space-y-6">
            {/* Header Color Theme Panel */}
            <SectionThemeControl
              title="Header & Top Bar"
              theme={headerConfig.theme}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(tConfig) => updateHeader((h) => ({ ...h, theme: tConfig }))}
            />

            {/* Top Bar Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <span className="text-xs font-bold text-slate-900">Top Contact & Announcement Bar</span>
                <p className="text-[11px] text-slate-500">
                  Shows a thin bar above the main header with phone, email, and live announcements
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  disabled={!canEdit}
                  checked={headerConfig.showTopBar ?? true}
                  onChange={(e) => updateHeader((h) => ({ ...h, showTopBar: e.target.checked }))}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>

            {/* Top Bar Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Top Announcement Ticker Text</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={headerConfig.topBarText || ""}
                  onChange={(e) => updateHeader((h) => ({ ...h, topBarText: e.target.value }))}
                  placeholder="e.g. ⚡ Admissions Open for 2026-27 Session — Apply Online"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Contact Email (Header)</label>
                <input
                  type="email"
                  disabled={!canEdit}
                  value={headerConfig.email || ""}
                  onChange={(e) => updateHeader((h) => ({ ...h, email: e.target.value }))}
                  placeholder="e.g. admissions@university.edu"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Contact Phone Number (Header)</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={headerConfig.phone || ""}
                  onChange={(e) => updateHeader((h) => ({ ...h, phone: e.target.value }))}
                  placeholder="e.g. +1 (800) 555-0199"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Campus / City Location</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={headerConfig.address || ""}
                  onChange={(e) => updateHeader((h) => ({ ...h, address: e.target.value }))}
                  placeholder="e.g. New York Campus, NY"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Header Button CTA Text</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={headerConfig.ctaText || ""}
                  onChange={(e) => updateHeader((h) => ({ ...h, ctaText: e.target.value }))}
                  placeholder="e.g. Apply Now, Contact Us"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Header Logo Graphic */}
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Header Logo Graphic / Icon (Optional)"
                  value={headerConfig.logoImage || ""}
                  placeholder="https://... or click Upload Image"
                  tenant={tenant}
                  canEdit={canEdit}
                  helpText="Upload a logo graphic to display in the main sticky header navigation bar"
                  onChange={(url) => updateHeader((h) => ({ ...h, logoImage: url }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= FOOTER CONFIG TAB ================= */}
        {activeTab === "footer" && (
          <div className="mt-6 space-y-6">
            {/* Footer Color Theme Panel */}
            <SectionThemeControl
              title="Website Footer"
              theme={footerConfig.theme}
              tenant={tenant}
              canEdit={canEdit}
              onChange={(tConfig) => updateFooter((f) => ({ ...f, theme: tConfig }))}
            />

            {/* Company Bio & Legal */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Company / Organization Legal Name</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={footerConfig.companyName || ""}
                  onChange={(e) => updateFooter((f) => ({ ...f, companyName: e.target.value }))}
                  placeholder="e.g. Apex Institute of Technology Inc."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-bold focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Copyright Line</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={footerConfig.copyrightText || ""}
                  onChange={(e) => updateFooter((f) => ({ ...f, copyrightText: e.target.value }))}
                  placeholder={`© ${new Date().getFullYear()} Company Name. All rights reserved.`}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Footer Logo Graphic / Icon (Optional)"
                  value={footerConfig.logoImage || ""}
                  placeholder="https://... or click Upload Image"
                  tenant={tenant}
                  canEdit={canEdit}
                  helpText="Upload a logo graphic to display in the website footer"
                  onChange={(url) => updateFooter((f) => ({ ...f, logoImage: url }))}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">Company Bio / Mission Statement</label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={footerConfig.aboutText || ""}
                  onChange={(e) => updateFooter((f) => ({ ...f, aboutText: e.target.value }))}
                  placeholder="A short, compelling summary of your organization shown in the footer..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Contact Details */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                🏢 Company Contact & Operating Details
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Support / Inquiry Email</label>
                  <input
                    type="email"
                    disabled={!canEdit}
                    value={footerConfig.email || ""}
                    onChange={(e) => updateFooter((f) => ({ ...f, email: e.target.value }))}
                    placeholder="support@domain.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Official Phone Number</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={footerConfig.phone || ""}
                    onChange={(e) => updateFooter((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+1 (800) 555-0199"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Physical Headquarters Address</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={footerConfig.address || ""}
                    onChange={(e) => updateFooter((f) => ({ ...f, address: e.target.value }))}
                    placeholder="100 Innovation Boulevard, Suite 400"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700">Working / Operating Hours</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={footerConfig.workingHours || ""}
                    onChange={(e) => updateFooter((f) => ({ ...f, workingHours: e.target.value }))}
                    placeholder="Mon – Fri: 08:00 AM – 06:00 PM"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Multi-Column Links Builder */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    📑 Footer Navigation Link Columns ({(footerConfig.columns || []).length})
                  </h4>
                  <p className="text-[11px] text-slate-500">Organize footer links into categories</p>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={handleAddFooterColumn}
                    className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1.5 text-xs font-bold text-white shadow-pink-500/25 hover:from-pink-600 hover:to-rose-500"
                  >
                    + Add Column
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {(footerConfig.columns || []).map((col, colIdx) => (
                  <div key={colIdx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b">
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={col.title}
                        onChange={(e) => handleUpdateColumnTitle(colIdx, e.target.value)}
                        placeholder="Column Category"
                        className="w-full font-bold text-xs text-slate-900 border-b border-transparent focus:border-pink-500 focus:outline-none"
                      />
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(colIdx)}
                          className="text-xs text-slate-400 hover:text-rose-600 ml-2"
                          title="Delete category"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {col.links.map((link, linkIdx) => (
                        <div key={linkIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            disabled={!canEdit}
                            value={link.label}
                            onChange={(e) => handleUpdateColumnLink(colIdx, linkIdx, "label", e.target.value)}
                            placeholder="Link Name"
                            className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium"
                          />
                          <input
                            type="text"
                            disabled={!canEdit}
                            value={link.url}
                            onChange={(e) => handleUpdateColumnLink(colIdx, linkIdx, "url", e.target.value)}
                            placeholder="URL"
                            className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-mono"
                          />
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleDeleteColumnLink(colIdx, linkIdx)}
                              className="text-slate-400 hover:text-rose-600 text-xs px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleAddLinkToColumn(colIdx)}
                          className="w-full py-1 text-center text-[10px] font-bold text-pink-600 border border-dashed border-pink-200 rounded-lg hover:bg-pink-50/50"
                        >
                          + Add Link
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Profiles */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                🌐 Social Media Channels & Profiles
              </h4>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <div key={platform.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span>{platform.icon}</span>
                      <span className="text-xs font-bold text-slate-800">{platform.label}</span>
                    </div>
                    <input
                      type="url"
                      disabled={!canEdit}
                      value={getSocialUrl(platform.id)}
                      onChange={(e) => handleUpdateSocialLink(platform.id, e.target.value)}
                      placeholder={`https://${platform.id}.com/yourhandle`}
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-mono focus:border-pink-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
