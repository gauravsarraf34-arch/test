"use client";

import React, { useState } from "react";
import { Tenant, Page } from "@/types/cms";

interface LivePreviewPaneProps {
  tenant: Tenant;
  page: Page;
}

export function LivePreviewPane({ tenant, page }: LivePreviewPaneProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const isDark = tenant.theme.mode === "dark";
  const bgStyle = isDark ? tenant.theme.secondary : "#ffffff";
  const textColor = isDark ? "#f8fafc" : "#0f172a";

  const deviceWidths = {
    desktop: "w-full max-w-5xl",
    tablet: "w-[768px]",
    mobile: "w-[375px]",
  };

  // Section Theme overrides for Simulator
  const headerTheme = tenant.headerConfig?.theme;
  const isHeaderGrad = headerTheme?.bgColor?.startsWith("linear-gradient");
  const headerBg = headerTheme?.bgColor || `${tenant.theme.primary}12`;
  const headerText = headerTheme?.textColor || textColor;
  const headerAccent = headerTheme?.accentColor || tenant.theme.primary;
  const headerBorder = headerTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  const heroTheme = page.heroTheme;
  const isHeroGrad = heroTheme?.bgColor?.startsWith("linear-gradient");
  const heroBg = heroTheme?.bgColor;
  const heroText = heroTheme?.textColor || textColor;
  const heroAccent = heroTheme?.accentColor || tenant.theme.accent;
  const heroBorder = heroTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  const noticesTheme = tenant.modulesTheme?.notices;
  const isNoticesGrad = noticesTheme?.bgColor?.startsWith("linear-gradient");
  const noticesBg = noticesTheme?.bgColor || (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)");
  const noticesText = noticesTheme?.textColor || textColor;
  const noticesAccent = noticesTheme?.accentColor || tenant.theme.accent;
  const noticesBorder = noticesTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  const servicesTheme = tenant.modulesTheme?.services;
  const isServicesGrad = servicesTheme?.bgColor?.startsWith("linear-gradient");
  const servicesBg = servicesTheme?.bgColor || (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)");
  const servicesText = servicesTheme?.textColor || textColor;
  const servicesAccent = servicesTheme?.accentColor || tenant.theme.accent;
  const servicesBorder = servicesTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  const statsTheme = tenant.modulesTheme?.statistics;
  const isStatsGrad = statsTheme?.bgColor?.startsWith("linear-gradient");
  const statsBg = statsTheme?.bgColor || (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)");
  const statsText = statsTheme?.textColor || textColor;
  const statsAccent = statsTheme?.accentColor || tenant.theme.primary;
  const statsBorder = statsTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  const footerTheme = tenant.footerConfig?.theme;
  const isFooterGrad = footerTheme?.bgColor?.startsWith("linear-gradient");
  const footerBg = footerTheme?.bgColor || `${tenant.theme.primary}08`;
  const footerText = footerTheme?.textColor || textColor;
  const footerAccent = footerTheme?.accentColor || tenant.theme.primary;
  const footerBorder = footerTheme?.borderColor || (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)");

  return (
    <div className="space-y-6">
      {/* Simulator Device Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">⚡ Live Device Simulator</span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            Realtime Sync
          </span>
        </div>

        {/* Viewport Width Toggles */}
        <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              device === "desktop" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            🖥️ Desktop (100%)
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              device === "tablet" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            📱 Tablet (768px)
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              device === "mobile" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            📲 Mobile (375px)
          </button>
        </div>

        <a
          href={`/tenant/${tenant.id}/${page.slug === "home" ? "" : page.slug}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Open in New Tab ↗
        </a>
      </div>

      {/* Simulator Device Frame */}
      <div className="flex justify-center rounded-3xl border border-slate-200/80 bg-slate-900/5 p-4 sm:p-8 min-h-[600px] overflow-x-auto">
        <div
          className={`transition-all duration-300 rounded-3xl overflow-hidden shadow-2xl border border-slate-300/80 ${deviceWidths[device]}`}
          style={{ backgroundColor: bgStyle, color: textColor }}
        >
          {/* Browser Address Bar Simulation */}
          <div className="flex items-center justify-between border-b border-slate-200/10 px-4 py-2.5 bg-slate-950/20 backdrop-blur">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="rounded-md bg-black/10 px-4 py-0.5 text-[10px] font-mono opacity-70 truncate max-w-xs">
              https://{tenant.domain}/{page.slug}
            </div>
            <div className="text-[10px] opacity-60 font-bold uppercase">{tenant.theme.layout}</div>
          </div>

          {/* Simulated Top Announcement / Contact Bar */}
          {(tenant.headerConfig?.showTopBar ?? true) && (
            <div
              className="flex items-center justify-between border-b px-6 py-1.5 text-[10px] opacity-85 transition"
              style={{
                borderColor: headerBorder,
                background: isHeaderGrad ? headerBg : undefined,
                backgroundColor: !isHeaderGrad ? headerBg : undefined,
                color: headerText,
              }}
            >
              <div className="flex items-center gap-1.5 truncate max-w-xs">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: headerAccent }} />
                <span>{tenant.headerConfig?.topBarText || "⚡ Admissions Open — Apply Online"}</span>
              </div>
              <div className="flex items-center gap-3">
                {tenant.headerConfig?.phone && <span>📞 {tenant.headerConfig.phone}</span>}
                {tenant.headerConfig?.email && <span className="hidden sm:inline font-mono">✉️ {tenant.headerConfig.email}</span>}
              </div>
            </div>
          )}

          {/* Website Header */}
          <header
            className="border-b px-6 py-4 transition"
            style={{
              borderColor: headerBorder,
              background: isHeaderGrad ? headerBg : undefined,
              backgroundColor: !isHeaderGrad ? headerBg : undefined,
              color: headerText,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="text-xl font-black tracking-tight" style={{ color: headerText }}>
                {tenant.logoText}
              </div>
              <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold opacity-85">
                {(tenant.navigation && tenant.navigation.length > 0
                  ? tenant.navigation
                  : tenant.pages.filter((p) => p.published).map((p) => ({ id: p.id, label: p.title, children: [] }))
                )
                  .slice(0, 5)
                  .map((item) => (
                    <span key={item.id} className="hover:opacity-100 cursor-pointer flex items-center gap-1" style={{ color: headerText }}>
                      <span>{item.label}</span>
                      {item.children && item.children.length > 0 && <span className="text-[9px] opacity-60">▾</span>}
                    </span>
                  ))}
              </nav>
              <button
                type="button"
                className="rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm"
                style={{ backgroundColor: headerAccent, color: "#ffffff" }}
              >
                {page.buttonText || "Get Started"}
              </button>
            </div>
          </header>

          {/* Full Custom HTML or Standard Blocks */}
          {page.useCustomHtml && page.customHtml ? (
            <div className="p-6">
              <div
                className="prose prose-slate max-w-none text-xs dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: page.customHtml }}
              />
            </div>
          ) : (
            <>
              {/* Hero Section with Dedicated Hero Color Theme */}
              <section
                className="px-6 py-12 sm:py-16 transition"
                style={{
                  background: isHeroGrad ? heroBg : undefined,
                  backgroundColor: !isHeroGrad && heroBg ? heroBg : undefined,
                  color: heroText,
                  borderColor: heroBorder,
                }}
              >
                <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm"
                      style={{ backgroundColor: heroAccent, color: "#111827" }}
                    >
                      {page.published ? "✓ Live Page" : "Draft Preview"}
                    </span>

                    <h1 className="mt-4 text-3xl sm:text-4xl font-black leading-tight tracking-tight" style={{ color: heroText }}>
                      {page.heroTitle}
                    </h1>

                    <p className="mt-4 text-sm sm:text-base opacity-80 leading-relaxed max-w-lg" style={{ color: heroText }}>
                      {page.heroSubtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="rounded-xl px-5 py-2.5 text-xs font-bold shadow-md transition"
                        style={{ backgroundColor: heroAccent, color: "#111827" }}
                      >
                        {page.buttonText}
                      </button>
                    </div>
                  </div>

                  {page.heroImage && (
                    <div className="overflow-hidden rounded-2xl border shadow-xl" style={{ borderColor: heroBorder }}>
                      <img
                        src={page.heroImage}
                        alt={page.title}
                        className="h-64 sm:h-80 w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* Content Sections */}
              {page.sections.length > 0 && (
                <section className="px-6 pb-12">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {page.sections.map((sec) => {
                      const isGrad = sec.theme?.bgColor?.startsWith("linear-gradient");
                      const secBg = sec.theme?.bgColor || (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)");
                      const secText = sec.theme?.textColor || textColor;
                      const secAccent = sec.theme?.accentColor || tenant.theme.accent;
                      const secBorder = sec.theme?.borderColor || (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)");

                      // Banner layout
                      if (sec.layout === "banner") {
                        return (
                          <div
                            key={sec.id}
                            className="sm:col-span-2 lg:col-span-3 rounded-2xl border p-6 text-center space-y-3"
                            style={{
                              background: isGrad ? secBg : undefined,
                              backgroundColor: !isGrad ? secBg : undefined,
                              color: secText,
                              borderColor: secBorder,
                            }}
                          >
                            <span
                              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block"
                              style={{ backgroundColor: secAccent, color: "#111827" }}
                            >
                              {sec.badge || sec.type}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black" style={{ color: secText }}>
                              {sec.icon ? `${sec.icon} ` : ""}{sec.title}
                            </h3>
                            <p className="text-xs opacity-80 max-w-xl mx-auto" style={{ color: secText }}>
                              {sec.description}
                            </p>

                            {sec.type === "html" && sec.customHtml ? (
                              <div className="text-left max-w-xl mx-auto text-xs" dangerouslySetInnerHTML={{ __html: sec.customHtml }} />
                            ) : null}

                            {sec.imageUrl && (
                              <div className="max-w-md mx-auto overflow-hidden rounded-xl border my-2" style={{ borderColor: secBorder }}>
                                <img src={sec.imageUrl} alt={sec.title} className="w-full h-36 object-cover" />
                              </div>
                            )}

                            {(sec.buttonText || sec.secondaryButtonText) && (
                              <div className="pt-2 flex justify-center gap-2">
                                {sec.buttonText && (
                                  <span className="rounded-xl px-4 py-1.5 text-xs font-bold shadow-xs" style={{ backgroundColor: secAccent, color: "#111827" }}>
                                    {sec.buttonText}
                                  </span>
                                )}
                                {sec.secondaryButtonText && (
                                  <span className="rounded-xl border px-4 py-1.5 text-xs font-bold" style={{ borderColor: secBorder, color: secText }}>
                                    {sec.secondaryButtonText}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Split layout
                      if (sec.layout === "split") {
                        return (
                          <div
                            key={sec.id}
                            className="sm:col-span-2 lg:col-span-3 rounded-2xl border p-5"
                            style={{
                              background: isGrad ? secBg : undefined,
                              backgroundColor: !isGrad ? secBg : undefined,
                              color: secText,
                              borderColor: secBorder,
                            }}
                          >
                            <div className="grid gap-4 sm:grid-cols-2 items-center">
                              <div className="space-y-2">
                                <span
                                  className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block"
                                  style={{ backgroundColor: secAccent, color: "#111827" }}
                                >
                                  {sec.badge || sec.type}
                                </span>
                                <h3 className="text-lg font-bold" style={{ color: secText }}>
                                  {sec.icon ? `${sec.icon} ` : ""}{sec.title}
                                </h3>
                                <p className="text-xs opacity-80" style={{ color: secText }}>{sec.description}</p>

                                {sec.type === "html" && sec.customHtml ? (
                                  <div className="text-xs" dangerouslySetInnerHTML={{ __html: sec.customHtml }} />
                                ) : (
                                  sec.items && sec.items.length > 0 && (
                                    <ul className="space-y-1 text-xs opacity-85">
                                      {sec.items.map((it, idx) => (
                                        <li key={idx} className="flex items-center gap-1.5" style={{ color: secText }}>
                                          <span className="font-bold" style={{ color: secAccent }}>✓</span>
                                          <span>{it}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )
                                )}

                                {(sec.buttonText || sec.secondaryButtonText) && (
                                  <div className="pt-2 flex gap-2">
                                    {sec.buttonText && (
                                      <span className="inline-block rounded-xl px-3.5 py-1 text-xs font-bold" style={{ backgroundColor: secAccent, color: "#111827" }}>
                                        {sec.buttonText}
                                      </span>
                                    )}
                                    {sec.secondaryButtonText && (
                                      <span className="inline-block rounded-xl border px-3.5 py-1 text-xs font-bold" style={{ borderColor: secBorder, color: secText }}>
                                        {sec.secondaryButtonText}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                {sec.imageUrl ? (
                                  <img src={sec.imageUrl} alt={sec.title} className="h-40 w-full object-cover rounded-xl border" style={{ borderColor: secBorder }} />
                                ) : (
                                  <div className="h-32 rounded-xl border flex items-center justify-center text-2xl" style={{ borderColor: secBorder }}>
                                    {sec.icon || "✨"}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const isCentered = sec.layout === "centered";
                      const colSpan = sec.columns === 1 ? "sm:col-span-2 lg:col-span-3" : sec.columns === 2 ? "sm:col-span-1 lg:col-span-2" : "";

                      return (
                        <div
                          key={sec.id}
                          className={`${colSpan} rounded-2xl border p-5 transition flex flex-col justify-between ${isCentered ? "text-center items-center" : ""}`}
                          style={{
                            background: isGrad ? secBg : undefined,
                            backgroundColor: !isGrad ? secBg : undefined,
                            color: secText,
                            borderColor: secBorder,
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              {sec.icon && <span>{sec.icon}</span>}
                              <span
                                className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest inline-block"
                                style={{ backgroundColor: secAccent, color: "#111827" }}
                              >
                                {sec.badge || sec.type}
                              </span>
                            </div>
                            <h3 className="mt-2 text-base font-bold" style={{ color: secText }}>
                              {sec.title}
                            </h3>
                            <p className="mt-2 text-xs opacity-75 leading-relaxed" style={{ color: secText }}>
                              {sec.description}
                            </p>

                            {sec.type === "html" && sec.customHtml ? (
                              <div className="mt-2 text-xs text-left" dangerouslySetInnerHTML={{ __html: sec.customHtml }} />
                            ) : (
                              sec.items && sec.items.length > 0 && (
                                <ul className="mt-3 space-y-1.5 text-xs opacity-85">
                                  {sec.items.map((it, idx) => (
                                    <li key={idx} className="flex items-center gap-1.5" style={{ color: secText }}>
                                      <span className="font-bold" style={{ color: secAccent }}>
                                        ✓
                                      </span>
                                      <span>{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              )
                            )}

                            {sec.imageUrl && (
                              <div className="mt-3 overflow-hidden rounded-xl border" style={{ borderColor: secBorder }}>
                                <img src={sec.imageUrl} alt={sec.title} className="h-32 w-full object-cover" />
                              </div>
                            )}
                          </div>

                          {(sec.buttonText || sec.secondaryButtonText) && (
                            <div className="pt-4 flex gap-2">
                              {sec.buttonText && (
                                <span className="rounded-lg px-3 py-1 text-[11px] font-bold" style={{ backgroundColor: secAccent, color: "#111827" }}>
                                  {sec.buttonText}
                                </span>
                              )}
                              {sec.secondaryButtonText && (
                                <span className="rounded-lg border px-3 py-1 text-[11px] font-bold" style={{ borderColor: secBorder, color: secText }}>
                                  {sec.secondaryButtonText}
                                </span>
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

          {/* Notices Preview */}
          {(tenant.notices || []).length > 0 && (
            <section className="px-6 pb-12">
              <h3 className="text-xl font-bold" style={{ color: noticesText }}>Official Notices</h3>
              <div className="mt-4 space-y-2">
                {(tenant.notices || []).slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between rounded-xl border p-3 text-xs"
                    style={{
                      borderLeftWidth: "4px",
                      borderLeftColor: noticesAccent,
                      background: isNoticesGrad ? noticesBg : undefined,
                      backgroundColor: !isNoticesGrad ? noticesBg : undefined,
                      borderColor: noticesBorder,
                      color: noticesText,
                    }}
                  >
                    <div>
                      <span
                        className="rounded px-1.5 py-0.5 text-[9px] font-bold mr-2"
                        style={{ backgroundColor: noticesAccent, color: "#111827" }}
                      >
                        {n.status}
                      </span>
                      <span className="font-semibold">{n.title}</span>
                    </div>
                    <span className="opacity-50 text-[10px]">{n.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Programs Preview */}
          {(tenant.programs || []).length > 0 && (
            <section className="px-6 pb-12">
              <h3 className="text-xl font-bold" style={{ color: servicesText }}>Programs & Courses</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(tenant.programs || []).map((prog) => (
                  <div
                    key={prog.id}
                    className="rounded-2xl border p-4"
                    style={{
                      background: isServicesGrad ? servicesBg : undefined,
                      backgroundColor: !isServicesGrad ? servicesBg : undefined,
                      borderColor: servicesBorder,
                      color: servicesText,
                    }}
                  >
                    <div className="text-2xl">{prog.icon || "🎓"}</div>
                    <h4 className="mt-2 text-sm font-bold" style={{ color: servicesText }}>{prog.name}</h4>
                    <p className="mt-1 text-xs opacity-75" style={{ color: servicesText }}>{prog.description}</p>
                    <div className="mt-3 pt-2 border-t border-slate-200/10 flex justify-between text-[11px] opacity-60" style={{ borderColor: servicesBorder }}>
                      <span>⏱️ {prog.duration}</span>
                      <span>✓ {prog.eligibility}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Statistics Preview */}
          {(tenant.statistics || []).length > 0 && (
            <section className="px-6 pb-12">
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {(tenant.statistics || []).map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl border p-4 text-center"
                    style={{
                      background: isStatsGrad ? statsBg : undefined,
                      backgroundColor: !isStatsGrad ? statsBg : undefined,
                      borderColor: statsBorder,
                      color: statsText,
                    }}
                  >
                    <div className="text-2xl">{stat.icon || "📊"}</div>
                    <div
                      className="mt-2 text-2xl font-black tracking-tight"
                      style={{ color: statsAccent }}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] opacity-75 font-medium" style={{ color: statsText }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Simulated Footer */}
          <footer
            className="border-t px-6 py-8 text-xs space-y-4 transition"
            style={{
              borderColor: footerBorder,
              background: isFooterGrad ? footerBg : undefined,
              backgroundColor: !isFooterGrad ? footerBg : undefined,
              color: footerText,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xs space-y-1">
                <div className="font-bold text-sm" style={{ color: footerAccent }}>
                  {tenant.footerConfig?.companyName || tenant.name}
                </div>
                <p className="text-[11px] opacity-70" style={{ color: footerText }}>
                  {tenant.footerConfig?.aboutText || "Modern digital solutions and accredited programs worldwide."}
                </p>
              </div>

              <div className="space-y-1 text-[11px] opacity-75" style={{ color: footerText }}>
                <div className="font-bold opacity-90">Contact Details</div>
                {tenant.footerConfig?.phone && <div>📞 {tenant.footerConfig.phone}</div>}
                {tenant.footerConfig?.email && <div className="font-mono">✉️ {tenant.footerConfig.email}</div>}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between text-[10px] opacity-60" style={{ borderColor: footerBorder, color: footerText }}>
              <div>{tenant.footerConfig?.copyrightText || `© ${new Date().getFullYear()} ${tenant.name}.`}</div>
              <div>Powered by TenantFlow CMS</div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
