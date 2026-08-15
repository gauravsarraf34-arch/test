"use client";

import React, { useState } from "react";
import { Tenant, Page, MenuItem, SocialPlatform } from "@/types/cms";

interface TenantPublicViewProps {
  tenant: Tenant;
  page: Page;
}

const SOCIAL_ICONS: Record<SocialPlatform, string> = {
  linkedin: "💼",
  twitter: "🐦",
  facebook: "📘",
  instagram: "📸",
  youtube: "▶️",
  github: "🐙",
};

export function TenantPublicView({ tenant, page }: TenantPublicViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [expandedMobileMenuId, setExpandedMobileMenuId] = useState<string | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleDropdownMouseEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdownId(id);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 250);
  };

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", message: "" });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const isDark = tenant.theme.mode === "dark";
  const bgStyle = isDark ? tenant.theme.secondary : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#0f172a";
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const headerConfig = tenant.headerConfig || {
    showTopBar: true,
    topBarText: "⚡ Admissions Open for 2026-27 — Apply Online Today",
    email: "contact@" + tenant.domain,
    phone: "+1 (800) 555-0199",
    address: "Main Campus",
    ctaText: page.buttonText || "Contact Us",
  };

  const footerConfig = tenant.footerConfig || {
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
      { platform: "linkedin" as SocialPlatform, url: "https://linkedin.com" },
      { platform: "twitter" as SocialPlatform, url: "https://twitter.com" },
    ],
  };

  // Per-Section Color Theme Configurations
  const headerTheme = headerConfig.theme;
  const isHeaderGrad = headerTheme?.bgColor?.startsWith("linear-gradient");
  const headerBg = headerTheme?.bgColor || (isDark ? `${tenant.theme.secondary}ee` : "#ffffffea");
  const headerText = headerTheme?.textColor || textColor;
  const headerBorder = headerTheme?.borderColor || cardBorder;
  const headerAccent = headerTheme?.accentColor || tenant.theme.primary;

  const heroTheme = page.heroTheme;
  const isHeroGrad = heroTheme?.bgColor?.startsWith("linear-gradient");
  const heroBg = heroTheme?.bgColor;
  const heroText = heroTheme?.textColor || textColor;
  const heroAccent = heroTheme?.accentColor || tenant.theme.accent;
  const heroBorder = heroTheme?.borderColor || cardBorder;

  const noticesTheme = tenant.modulesTheme?.notices;
  const isNoticesGrad = noticesTheme?.bgColor?.startsWith("linear-gradient");
  const noticesBg = noticesTheme?.bgColor || cardBg;
  const noticesText = noticesTheme?.textColor || textColor;
  const noticesAccent = noticesTheme?.accentColor || tenant.theme.accent;
  const noticesBorder = noticesTheme?.borderColor || cardBorder;

  const servicesTheme = tenant.modulesTheme?.services;
  const isServicesGrad = servicesTheme?.bgColor?.startsWith("linear-gradient");
  const servicesBg = servicesTheme?.bgColor || cardBg;
  const servicesText = servicesTheme?.textColor || textColor;
  const servicesAccent = servicesTheme?.accentColor || tenant.theme.accent;
  const servicesBorder = servicesTheme?.borderColor || cardBorder;

  const statsTheme = tenant.modulesTheme?.statistics;
  const isStatsGrad = statsTheme?.bgColor?.startsWith("linear-gradient");
  const statsBg = statsTheme?.bgColor || cardBg;
  const statsText = statsTheme?.textColor || textColor;
  const statsAccent = statsTheme?.accentColor || tenant.theme.accent;
  const statsBorder = statsTheme?.borderColor || cardBorder;

  const footerTheme = footerConfig.theme;
  const isFooterGrad = footerTheme?.bgColor?.startsWith("linear-gradient");
  const footerBg = footerTheme?.bgColor || (isDark ? "rgba(0,0,0,0.5)" : "rgba(248,250,252,0.95)");
  const footerText = footerTheme?.textColor || textColor;
  const footerBorder = footerTheme?.borderColor || cardBorder;
  const footerAccent = footerTheme?.accentColor || tenant.theme.primary;

  const headerLogoImage = headerConfig.logoImage || tenant.logoImage;
  const footerLogoImage = footerConfig.logoImage || tenant.logoImage;

  // Resolve menu items
  const menuItems: MenuItem[] =
    tenant.navigation && tenant.navigation.length > 0
      ? tenant.navigation
      : tenant.pages
          .filter((p) => p.published)
          .map((p) => ({
            id: p.id,
            label: p.title,
            link: p.slug === "home" ? `/tenant/${tenant.id}` : `/tenant/${tenant.id}/${p.slug}`,
            pageId: p.id,
            children: [],
          }));

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryModalOpen(false);
      setInquiryForm({ name: "", email: "", message: "" });
    }, 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterSubmitted(false);
      setNewsletterEmail("");
    }, 3000);
  };

  // Dynamic Configurable Container Width & Margins
  const containerWidth = page.containerWidth || tenant.theme.containerWidth || "wide";
  const pagePadding = page.pagePadding || tenant.theme.pagePadding || "standard";

  let widthClass = "max-w-[1440px]"; // Wide standard (1440px)
  if (containerWidth === "standard") widthClass = "max-w-7xl"; // 1280px
  else if (containerWidth === "full") widthClass = "max-w-full"; // 100% fluid
  else if (containerWidth === "compact") widthClass = "max-w-5xl"; // 1024px
  else if (containerWidth === "wide") widthClass = "max-w-[1440px]";

  let paddingClass = "px-4 sm:px-8 lg:px-12"; // Standard balanced margins
  if (pagePadding === "spacious") paddingClass = "px-6 sm:px-12 lg:px-20";
  else if (pagePadding === "compact") paddingClass = "px-3 sm:px-5 lg:px-6";
  else if (pagePadding === "standard") paddingClass = "px-4 sm:px-8 lg:px-12";

  const containerClass = `mx-auto ${widthClass} ${paddingClass}`;

  return (
    <div
      className="min-h-screen transition-colors duration-200 antialiased font-sans flex flex-col justify-between"
      style={{ backgroundColor: bgStyle, color: textColor }}
    >
      <div>
        {/* Top Contact & Announcement Bar */}
        {(headerConfig.showTopBar ?? true) && (
          <div
            className="border-b py-2 text-xs font-medium backdrop-blur-sm transition"
            style={{
              background: isHeaderGrad ? headerBg : undefined,
              backgroundColor: !isHeaderGrad ? (headerTheme?.bgColor || (isDark ? "rgba(0,0,0,0.3)" : "rgba(248,250,252,0.9)")) : undefined,
              color: headerText,
              borderColor: headerBorder,
            }}
          >
            <div className={`${containerClass} flex flex-wrap items-center justify-between gap-3`}>
              {/* Ticker / Headline */}
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: headerAccent }} />
                <span className="opacity-85 truncate max-w-xs sm:max-w-md">
                  {headerConfig.topBarText || "Official Digital Portal"}
                </span>
              </div>

              {/* Direct Contact Details */}
              <div className="flex items-center gap-4 text-[11px] opacity-80">
                {headerConfig.phone && (
                  <a
                    href={`tel:${headerConfig.phone}`}
                    className="flex items-center gap-1 hover:opacity-100 hover:underline"
                    style={{ color: headerText }}
                  >
                    <span>📞</span>
                    <span>{headerConfig.phone}</span>
                  </a>
                )}
                {headerConfig.email && (
                  <a
                    href={`mailto:${headerConfig.email}`}
                    className="hidden sm:flex items-center gap-1 hover:opacity-100 hover:underline font-mono"
                    style={{ color: headerText }}
                  >
                    <span>✉️</span>
                    <span>{headerConfig.email}</span>
                  </a>
                )}
                {headerConfig.address && (
                  <span className="hidden md:flex items-center gap-1 opacity-70" style={{ color: headerText }}>
                    <span>📍</span>
                    <span>{headerConfig.address}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Sticky Header */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-md transition-colors"
          style={{
            borderColor: headerBorder,
            background: isHeaderGrad ? headerBg : undefined,
            backgroundColor: !isHeaderGrad ? headerBg : undefined,
            color: headerText,
          }}
        >
          <div className={`${containerClass} flex items-center justify-between py-4`}>
            <a
              href={`/tenant/${tenant.id}`}
              className="flex items-center gap-2.5 text-2xl font-black tracking-tight transition hover:opacity-80"
              style={{ color: headerText }}
            >
              {headerLogoImage ? (
                <img src={headerLogoImage} alt={tenant.logoText} className="h-8 max-w-[160px] object-contain rounded-md" />
              ) : null}
              <span>{tenant.logoText}</span>
            </a>

            {/* Desktop Nav with Dropdown Submenus */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold">
              {menuItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isCurrentPage =
                  item.pageId === page.id ||
                  (page.slug === "home" && item.link === `/tenant/${tenant.id}`) ||
                  item.link === `/tenant/${tenant.id}/${page.slug}`;

                if (hasChildren) {
                  const isOpen = activeDropdownId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="relative py-2 group"
                      onMouseEnter={() => handleDropdownMouseEnter(item.id)}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDropdownId(isOpen ? null : item.id)}
                        className="flex items-center gap-1.5 py-1 text-sm font-semibold transition hover:opacity-100 opacity-80 cursor-pointer"
                        style={{ color: headerText }}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] transition-transform duration-200 font-bold">
                          {isOpen ? "▲" : "▾"}
                        </span>
                      </button>

                      {/* Dropdown Bridge & Card */}
                      {isOpen && (
                        <div
                          className="absolute left-0 top-full z-50 pt-2 min-w-[230px]"
                          onMouseEnter={() => handleDropdownMouseEnter(item.id)}
                          onMouseLeave={handleDropdownMouseLeave}
                        >
                          <div
                            className="rounded-2xl border p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                            style={{
                              backgroundColor: isDark ? `${tenant.theme.secondary}f8` : "#fffffffa",
                              borderColor: cardBorder,
                            }}
                          >
                            {item.children!.map((sub) => (
                              <a
                                key={sub.id}
                                href={sub.link}
                                onClick={() => setActiveDropdownId(null)}
                                className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
                                style={{ color: textColor }}
                              >
                                <span>{sub.label}</span>
                                <span className="text-[10px] opacity-40 font-mono">→</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={item.link}
                    className={`py-2 text-sm font-semibold transition hover:opacity-100 ${
                      isCurrentPage ? "opacity-100 font-bold" : "opacity-80"
                    }`}
                    style={{
                      color: isCurrentPage ? headerAccent : headerText,
                    }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="hidden sm:inline-flex rounded-xl px-5 py-2 text-xs font-bold shadow-md transition hover:scale-105 active:scale-95"
                style={{ backgroundColor: headerAccent, color: "#ffffff" }}
              >
                {headerConfig.ctaText || page.buttonText || "Contact Us"}
              </button>

              {/* Mobile menu hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-xl border p-2 text-xs font-bold"
                style={{ borderColor: headerBorder, color: headerText }}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile menu drawer with accordion submenus */}
          {mobileMenuOpen && (
            <div
              className="md:hidden border-t px-6 py-4 space-y-3 shadow-xl"
              style={{ borderColor: headerBorder, backgroundColor: bgStyle }}
            >
              {menuItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedMobileMenuId === item.id;

                if (hasChildren) {
                  return (
                    <div key={item.id} className="border-b pb-2" style={{ borderColor: headerBorder }}>
                      <button
                        type="button"
                        onClick={() => setExpandedMobileMenuId(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between text-sm font-bold py-1.5"
                        style={{ color: headerText }}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs font-bold">{isExpanded ? "−" : "+"}</span>
                      </button>
                      {isExpanded && (
                        <div className="pl-4 mt-2 space-y-2 border-l-2" style={{ borderColor: headerAccent }}>
                          {item.children!.map((sub) => (
                            <a
                              key={sub.id}
                              href={sub.link}
                              className="block text-xs font-medium py-1 opacity-80"
                              style={{ color: headerText }}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={item.id}
                    href={item.link}
                    className="block text-sm font-semibold py-1.5 border-b"
                    style={{ borderColor: headerBorder, color: headerText }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setInquiryModalOpen(true);
                }}
                className="w-full mt-3 rounded-xl py-3 text-xs font-bold text-white text-center shadow-md"
                style={{ backgroundColor: headerAccent }}
              >
                {headerConfig.ctaText || page.buttonText || "Get in Touch"}
              </button>
            </div>
          )}
        </header>

        {/* Full Custom HTML / Template Render (if enabled on page) */}
        {page.useCustomHtml && page.customHtml ? (
          <section className={`${containerClass} py-8`}>
            <div
              className="prose prose-slate max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: page.customHtml }}
            />
          </section>
        ) : (
          <>
            {/* Hero Section with Dedicated Hero Color Theme */}
            <section
              className="transition duration-200"
              style={{
                background: isHeroGrad ? heroBg : undefined,
                backgroundColor: !isHeroGrad && heroBg ? heroBg : undefined,
                color: heroText,
                borderColor: heroBorder,
              }}
            >
              <div className={`${containerClass} py-16 sm:py-24`}>
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <span
                      className="inline-flex rounded-full px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm"
                      style={{ backgroundColor: heroAccent, color: "#111827" }}
                    >
                      {tenant.status === "Active" ? "Official Portal" : "Preview"}
                    </span>

                    <h1
                      className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
                      style={{ color: heroText }}
                    >
                      {page.heroTitle}
                    </h1>

                    <p className="mt-6 max-w-xl text-lg sm:text-xl opacity-85 leading-relaxed font-normal" style={{ color: heroText }}>
                      {page.heroSubtitle}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4 items-center">
                      <button
                        type="button"
                        onClick={() => setInquiryModalOpen(true)}
                        className="rounded-xl px-7 py-3.5 text-sm font-bold shadow-lg transition hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: heroAccent, color: "#111827" }}
                      >
                        {page.buttonText || "Get Started"}
                      </button>

                      <a
                        href="#sections"
                        className="rounded-xl border px-6 py-3.5 text-sm font-semibold transition hover:opacity-80"
                        style={{ borderColor: heroBorder, color: heroText }}
                      >
                        Explore More ↓
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    {page.heroImage ? (
                      <div
                        className="overflow-hidden rounded-3xl border shadow-2xl transition duration-300 hover:shadow-indigo-500/10"
                        style={{ borderColor: heroBorder }}
                      >
                        <img
                          src={page.heroImage}
                          alt={page.title}
                          className="h-80 sm:h-96 w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {/* Reusable Content Blocks */}
            {page.sections && page.sections.length > 0 && (
              <section id="sections" className={`${containerClass} py-12`}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {page.sections.map((section) => {
                    const isGradient = section.theme?.bgColor?.startsWith("linear-gradient");
                    const sectionBg = section.theme?.bgColor || cardBg;
                    const sectionText = section.theme?.textColor || textColor;
                    const sectionAccent = section.theme?.accentColor || tenant.theme.accent;
                    const sectionBorder = section.theme?.borderColor || cardBorder;

                    // Layout 1: Banner Layout (Full-width callout container)
                    if (section.layout === "banner") {
                      return (
                        <div
                          key={section.id}
                          className="md:col-span-2 lg:col-span-3 rounded-3xl border p-8 sm:p-12 text-center transition hover:shadow-2xl space-y-4"
                          style={{
                            background: isGradient ? sectionBg : undefined,
                            backgroundColor: !isGradient ? sectionBg : undefined,
                            color: sectionText,
                            borderColor: sectionBorder,
                          }}
                        >
                          <span
                            className="rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider inline-block shadow-xs"
                            style={{ backgroundColor: sectionAccent, color: "#111827" }}
                          >
                            {section.badge || section.type}
                          </span>
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: sectionText }}>
                            {section.icon ? `${section.icon} ` : ""}{section.title}
                          </h3>
                          <p className="text-sm sm:text-base opacity-85 max-w-2xl mx-auto leading-relaxed" style={{ color: sectionText }}>
                            {section.description}
                          </p>

                          {section.type === "html" && section.customHtml ? (
                            <div className="max-w-3xl mx-auto text-left" dangerouslySetInnerHTML={{ __html: section.customHtml }} />
                          ) : (
                            <>
                              {section.content && (
                                <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto italic" style={{ color: sectionText }}>
                                  "{section.content}"
                                </p>
                              )}
                            </>
                          )}

                          {section.imageUrl && (
                            <div className="max-w-2xl mx-auto overflow-hidden rounded-2xl border shadow-md my-4" style={{ borderColor: sectionBorder }}>
                              <img src={section.imageUrl} alt={section.title} className="w-full h-64 object-cover" />
                            </div>
                          )}

                          {/* Action Buttons */}
                          {(section.buttonText || section.secondaryButtonText) && (
                            <div className="pt-4 flex flex-wrap justify-center gap-3">
                              {section.buttonText && (
                                <a
                                  href={section.buttonUrl || "#"}
                                  className="rounded-xl px-6 py-3 text-xs font-bold shadow-md transition hover:scale-105 active:scale-95"
                                  style={{ backgroundColor: sectionAccent, color: "#111827" }}
                                >
                                  {section.buttonText} →
                                </a>
                              )}
                              {section.secondaryButtonText && (
                                <a
                                  href={section.secondaryButtonUrl || "#"}
                                  className="rounded-xl border px-6 py-3 text-xs font-bold transition hover:opacity-80"
                                  style={{ borderColor: sectionBorder, color: sectionText }}
                                >
                                  {section.secondaryButtonText}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Layout 2: Split Layout (Side-by-side content + media/items)
                    if (section.layout === "split") {
                      return (
                        <div
                          key={section.id}
                          className="md:col-span-2 lg:col-span-3 rounded-3xl border p-8 sm:p-10 transition hover:shadow-2xl"
                          style={{
                            background: isGradient ? sectionBg : undefined,
                            backgroundColor: !isGradient ? sectionBg : undefined,
                            color: sectionText,
                            borderColor: sectionBorder,
                          }}
                        >
                          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                            <div className="lg:col-span-7 space-y-4">
                              <span
                                className="rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider inline-block"
                                style={{ backgroundColor: sectionAccent, color: "#111827" }}
                              >
                                {section.badge || section.type}
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: sectionText }}>
                                {section.icon ? `${section.icon} ` : ""}{section.title}
                              </h3>
                              <p className="text-sm opacity-85 leading-relaxed" style={{ color: sectionText }}>
                                {section.description}
                              </p>

                              {section.type === "html" && section.customHtml ? (
                                <div className="pt-2" dangerouslySetInnerHTML={{ __html: section.customHtml }} />
                              ) : (
                                <>
                                  {section.content && (
                                    <p className="text-xs opacity-80 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: sectionAccent, color: sectionText }}>
                                      {section.content}
                                    </p>
                                  )}

                                  {section.items && section.items.length > 0 && (
                                    <ul className="space-y-2 text-xs sm:text-sm pt-2">
                                      {section.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2" style={{ color: sectionText }}>
                                          <span className="font-bold" style={{ color: sectionAccent }}>✓</span>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              )}

                              {(section.buttonText || section.secondaryButtonText) && (
                                <div className="pt-4 flex flex-wrap gap-3">
                                  {section.buttonText && (
                                    <a
                                      href={section.buttonUrl || "#"}
                                      className="rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition hover:scale-105"
                                      style={{ backgroundColor: sectionAccent, color: "#111827" }}
                                    >
                                      {section.buttonText}
                                    </a>
                                  )}
                                  {section.secondaryButtonText && (
                                    <a
                                      href={section.secondaryButtonUrl || "#"}
                                      className="rounded-xl border px-5 py-2.5 text-xs font-bold transition hover:opacity-80"
                                      style={{ borderColor: sectionBorder, color: sectionText }}
                                    >
                                      {section.secondaryButtonText}
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="lg:col-span-5">
                              {section.imageUrl ? (
                                <div className="overflow-hidden rounded-2xl border shadow-lg" style={{ borderColor: sectionBorder }}>
                                  <img src={section.imageUrl} alt={section.title} className="h-64 sm:h-72 w-full object-cover" />
                                </div>
                              ) : (
                                <div className="rounded-2xl border p-6 text-center shadow-inner h-64 flex flex-col items-center justify-center" style={{ borderColor: sectionBorder, backgroundColor: "rgba(0,0,0,0.03)" }}>
                                  <span className="text-5xl">{section.icon || "✨"}</span>
                                  <h4 className="mt-3 text-sm font-bold" style={{ color: sectionText }}>{section.title}</h4>
                                  <p className="mt-1 text-xs opacity-75 max-w-xs" style={{ color: sectionText }}>{section.description}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Layout 3: Standard Cards or Centered (Default)
                    const isCentered = section.layout === "centered";
                    const colSpan = section.columns === 1 ? "md:col-span-2 lg:col-span-3" : section.columns === 2 ? "md:col-span-1 lg:col-span-2" : "";

                    return (
                      <div
                        key={section.id}
                        className={`${colSpan} rounded-3xl border p-7 transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                          isCentered ? "text-center items-center" : ""
                        }`}
                        style={{
                          background: isGradient ? sectionBg : undefined,
                          backgroundColor: !isGradient ? sectionBg : undefined,
                          color: sectionText,
                          borderColor: sectionBorder,
                        }}
                      >
                        <div className={isCentered ? "w-full flex flex-col items-center" : ""}>
                          <div className="flex items-center gap-2">
                            {section.icon && <span className="text-xl">{section.icon}</span>}
                            <span
                              className="rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest inline-block"
                              style={{ backgroundColor: sectionAccent, color: "#111827" }}
                            >
                              {section.badge || section.type}
                            </span>
                          </div>

                          <h3 className="mt-3 text-xl font-bold" style={{ color: sectionText }}>
                            {section.title}
                          </h3>
                          <p className="mt-3 text-sm opacity-80 leading-relaxed" style={{ color: sectionText }}>
                            {section.description}
                          </p>

                          {section.type === "html" && section.customHtml ? (
                            <div className="mt-4 text-left" dangerouslySetInnerHTML={{ __html: section.customHtml }} />
                          ) : (
                            <>
                              {section.content && (
                                <p
                                  className="mt-4 text-xs opacity-80 leading-relaxed italic border-t pt-3"
                                  style={{ borderColor: sectionBorder, color: sectionText }}
                                >
                                  "{section.content}"
                                </p>
                              )}

                              {section.items && section.items.length > 0 && (
                                <ul className={`mt-5 space-y-2 text-sm opacity-90 ${isCentered ? "text-left max-w-sm mx-auto" : ""}`}>
                                  {section.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2" style={{ color: sectionText }}>
                                      <span className="font-bold" style={{ color: sectionAccent }}>
                                        ✓
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          )}

                          {section.imageUrl && (
                            <div className="mt-4 overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: sectionBorder }}>
                              <img src={section.imageUrl} alt={section.title} className="h-44 w-full object-cover" />
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {(section.buttonText || section.secondaryButtonText) && (
                          <div className={`pt-6 flex flex-wrap gap-2 ${isCentered ? "justify-center" : ""}`}>
                            {section.buttonText && (
                              <a
                                href={section.buttonUrl || "#"}
                                className="rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition hover:opacity-90"
                                style={{ backgroundColor: sectionAccent, color: "#111827" }}
                              >
                                {section.buttonText}
                              </a>
                            )}
                            {section.secondaryButtonText && (
                              <a
                                href={section.secondaryButtonUrl || "#"}
                                className="rounded-xl border px-4 py-2 text-xs font-bold transition hover:opacity-80"
                                style={{ borderColor: sectionBorder, color: sectionText }}
                              >
                                {section.secondaryButtonText}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* Important Notices */}
        {(tenant.notices || []).length > 0 && (
          <section className={`${containerClass} py-12`}>
            <div className="flex items-center justify-between pb-6 border-b" style={{ borderColor: noticesBorder }}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: noticesText }}>
                  Official Notices & News
                </h2>
                <p className="text-xs sm:text-sm opacity-70 mt-1" style={{ color: noticesText }}>
                  Latest verified bulletins and updates
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(tenant.notices || []).map((notice) => (
                <div
                  key={notice.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition hover:shadow-md"
                  style={{
                    borderLeftWidth: "6px",
                    borderLeftColor: noticesAccent,
                    background: isNoticesGrad ? noticesBg : undefined,
                    backgroundColor: !isNoticesGrad ? noticesBg : undefined,
                    borderColor: noticesBorder,
                    color: noticesText,
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-bold"
                        style={{ backgroundColor: noticesAccent, color: "#111827" }}
                      >
                        {notice.status}
                      </span>
                      <span className="text-xs opacity-60" style={{ color: noticesText }}>
                        {notice.date}
                      </span>
                      {notice.isPinned && <span className="text-xs">📌 Pinned</span>}
                    </div>
                    <h3 className="mt-1.5 text-base font-bold" style={{ color: noticesText }}>
                      {notice.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(true)}
                    className="w-fit text-xs font-bold underline opacity-80 hover:opacity-100"
                    style={{ color: noticesAccent }}
                  >
                    Details →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Programs & Courses Grid */}
        {(tenant.programs || []).length > 0 && (
          <section className={`${containerClass} py-12`}>
            <div className="pb-6 border-b" style={{ borderColor: servicesBorder }}>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: servicesText }}>
                Programs & Courses
              </h2>
              <p className="text-xs sm:text-sm opacity-70 mt-1" style={{ color: servicesText }}>
                Explore our accredited education tracks and certifications
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(tenant.programs || []).map((prog) => (
                <div
                  key={prog.id}
                  className="rounded-3xl border p-6 transition hover:shadow-xl hover:-translate-y-1"
                  style={{
                    background: isServicesGrad ? servicesBg : undefined,
                    backgroundColor: !isServicesGrad ? servicesBg : undefined,
                    borderColor: servicesBorder,
                    color: servicesText,
                  }}
                >
                  <div className="text-4xl">{prog.icon || "🎓"}</div>
                  <h3 className="mt-4 text-xl font-bold" style={{ color: servicesText }}>
                    {prog.name}
                  </h3>
                  <p className="mt-2 text-xs opacity-80 leading-relaxed" style={{ color: servicesText }}>
                    {prog.description}
                  </p>
                  <div
                    className="mt-6 space-y-1.5 border-t pt-4 text-xs opacity-75"
                    style={{ borderColor: servicesBorder, color: servicesText }}
                  >
                    <div className="flex items-center gap-2">
                      <span>⏱️ Duration:</span>
                      <span className="font-semibold">{prog.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>✓ Eligibility:</span>
                      <span className="font-semibold">{prog.eligibility}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services & Facilities */}
        {(tenant.services || []).length > 0 && (
          <section className={`${containerClass} py-12`}>
            <div className="pb-6 border-b" style={{ borderColor: servicesBorder }}>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: servicesText }}>
                Amenities & Support
              </h2>
              <p className="text-xs sm:text-sm opacity-70 mt-1" style={{ color: servicesText }}>
                World-class infrastructure designed for success
              </p>
            </div>

            <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {(tenant.services || []).map((svc) => (
                <div
                  key={svc.id}
                  className="rounded-2xl border p-5 text-center transition hover:scale-105"
                  style={{
                    background: isServicesGrad ? servicesBg : undefined,
                    backgroundColor: !isServicesGrad ? servicesBg : undefined,
                    borderColor: servicesBorder,
                    color: servicesText,
                  }}
                >
                  <div className="text-3xl">{svc.icon || "✨"}</div>
                  <h4 className="mt-3 text-sm font-bold" style={{ color: servicesText }}>
                    {svc.name}
                  </h4>
                  <p className="mt-1.5 text-xs opacity-75 leading-relaxed" style={{ color: servicesText }}>
                    {svc.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Statistics Counter */}
        {(tenant.statistics || []).length > 0 && (
          <section className={`${containerClass} py-12`}>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {(tenant.statistics || []).map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-3xl border p-6 text-center shadow-sm"
                  style={{
                    background: isStatsGrad ? statsBg : undefined,
                    backgroundColor: !isStatsGrad ? statsBg : undefined,
                    borderColor: statsBorder,
                    color: statsText,
                  }}
                >
                  <div className="text-3xl">{stat.icon || "📊"}</div>
                  <div
                    className="mt-3 text-3xl sm:text-4xl font-black tracking-tight"
                    style={{ color: statsAccent }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs opacity-80 font-semibold" style={{ color: statsText }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ================= COMPREHENSIVE EDITABLE FOOTER ================= */}
      <footer
        className="border-t mt-16 pt-16 pb-12 transition"
        style={{
          borderColor: footerBorder,
          background: isFooterGrad ? footerBg : undefined,
          backgroundColor: !isFooterGrad ? footerBg : undefined,
          color: footerText,
        }}
      >
        <div className={`${containerClass} space-y-12`}>
          {/* Newsletter Signup Banner (if enabled) */}
          {(footerConfig.showNewsletter ?? true) && (
            <div
              className="rounded-3xl border p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                borderColor: footerBorder,
              }}
            >
              <div className="max-w-md">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ backgroundColor: footerAccent, color: "#ffffff" }}
                >
                  Newsletter
                </span>
                <h3 className="mt-3 text-xl sm:text-2xl font-black" style={{ color: footerText }}>
                  {footerConfig.newsletterHeadline || "Stay updated with our latest announcements"}
                </h3>
                <p className="mt-1.5 text-xs opacity-75" style={{ color: footerText }}>
                  Get official circulars, admission deadlines, and bulletins delivered to your inbox.
                </p>
              </div>

              {newsletterSubmitted ? (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-600 flex items-center gap-2">
                  <span>✓</span> Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="rounded-xl border px-4 py-2.5 text-xs focus:outline-none w-full sm:w-64"
                    style={{ borderColor: footerBorder, backgroundColor: bgStyle, color: textColor }}
                  />
                  <button
                    type="submit"
                    className="rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                    style={{ backgroundColor: footerAccent }}
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Main Multi-Column Footer Grid */}
          <div className="grid gap-10 md:grid-cols-12">
            {/* Column 1: Company Profile & About */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                {footerLogoImage ? (
                  <img src={footerLogoImage} alt={tenant.name} className="h-8 max-w-[160px] object-contain rounded-md" />
                ) : null}
                <div className="text-2xl font-black tracking-tight" style={{ color: footerAccent }}>
                  {tenant.logoText}
                </div>
              </div>
              <h4 className="text-sm font-bold opacity-90" style={{ color: footerText }}>
                {footerConfig.companyName || tenant.name}
              </h4>
              <p className="text-xs opacity-75 leading-relaxed" style={{ color: footerText }}>
                {footerConfig.aboutText ||
                  `${tenant.name} delivers modern digital experiences, accredited programs, and dedicated solutions worldwide.`}
              </p>

              {/* Social Channels */}
              {footerConfig.socialLinks && footerConfig.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {footerConfig.socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border transition hover:scale-110"
                      style={{ borderColor: footerBorder, backgroundColor: "rgba(255,255,255,0.05)" }}
                      title={social.platform}
                    >
                      <span>{SOCIAL_ICONS[social.platform] || "🔗"}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2 & 3: Custom Navigation Columns */}
            {(footerConfig.columns || []).map((col, colIdx) => (
              <div key={colIdx} className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider opacity-90" style={{ color: footerText }}>
                  {col.title}
                </h4>
                <ul className="space-y-2 text-xs opacity-75" style={{ color: footerText }}>
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a href={link.url} className="hover:underline transition hover:opacity-100" style={{ color: footerText }}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 4: Contact, Email, Phone, Address & Hours */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-90" style={{ color: footerText }}>
                Headquarters & Contact
              </h4>
              <div className="space-y-2.5 text-xs opacity-80" style={{ color: footerText }}>
                {footerConfig.address && (
                  <div className="flex items-start gap-2.5">
                    <span>📍</span>
                    <span>{footerConfig.address}</span>
                  </div>
                )}
                {footerConfig.phone && (
                  <div className="flex items-center gap-2.5">
                    <span>📞</span>
                    <a href={`tel:${footerConfig.phone}`} className="hover:underline" style={{ color: footerText }}>
                      {footerConfig.phone}
                    </a>
                  </div>
                )}
                {footerConfig.email && (
                  <div className="flex items-center gap-2.5 font-mono">
                    <span>✉️</span>
                    <a href={`mailto:${footerConfig.email}`} className="hover:underline" style={{ color: footerText }}>
                      {footerConfig.email}
                    </a>
                  </div>
                )}
                {footerConfig.workingHours && (
                  <div className="flex items-center gap-2.5 pt-1 text-[11px] opacity-70">
                    <span>⏱️</span>
                    <span>{footerConfig.workingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Attribution Bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-8 text-xs opacity-70"
            style={{ borderColor: footerBorder, color: footerText }}
          >
            <div>{footerConfig.copyrightText || `© ${new Date().getFullYear()} ${tenant.name}. All rights reserved.`}</div>
            <div className="flex items-center gap-4">
              <span>Powered by TenantFlow CMS</span>
              <a href="#top" className="hover:underline">
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Inquiry / Contact Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-3xl border p-6 sm:p-8 shadow-2xl"
            style={{ backgroundColor: bgStyle, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: cardBorder }}>
              <h3 className="text-xl font-bold">Get in Touch with {tenant.name}</h3>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="rounded-lg p-1 opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h4 className="text-lg font-bold">Inquiry Sent Successfully!</h4>
                <p className="text-xs opacity-75">Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full rounded-xl border p-2.5 text-xs focus:outline-none"
                    style={{ borderColor: cardBorder, backgroundColor: cardBg }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full rounded-xl border p-2.5 text-xs focus:outline-none"
                    style={{ borderColor: cardBorder, backgroundColor: cardBg }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Your Message or Inquiry</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full rounded-xl border p-2.5 text-xs focus:outline-none"
                    style={{ borderColor: cardBorder, backgroundColor: cardBg }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl py-3 text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: tenant.theme.primary }}
                >
                  Send Inquiry Now →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
