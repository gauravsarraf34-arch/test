"use client";

import React, { useState } from "react";
import { Tenant } from "@/types/cms";

interface UserManualTabProps {
  tenant: Tenant;
}

export function UserManualTab({ tenant }: UserManualTabProps) {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [completedTests, setCompletedTests] = useState<Record<string, boolean>>({});

  const toggleTest = (testId: string) => {
    setCompletedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const testSteps = [
    {
      id: "test-auth",
      number: "01",
      title: "Authentication & Role-Based Access Control (RBAC)",
      category: "security",
      icon: "🔐",
      description: "Test signing in with different user roles and verifying permission boundaries.",
      steps: [
        "Sign out from the top right button.",
        "Sign in as Admin (admin@tenantflow.io / admin123) — verify all tenants and creation tools are visible.",
        "Sign in as Editor (editor@tenantflow.io / editor123) — verify scoped to Northwind Studio.",
        "Sign in as Designer (designer@tenantflow.io / designer123) — verify access to Theme & Layout options.",
      ],
      expectedResult: "Each role sees only authorized brands and operations with appropriate role badges.",
    },
    {
      id: "test-tenant-switch",
      number: "02",
      title: "Tenant Switcher & Creating a New Brand",
      category: "tenancy",
      icon: "🏢",
      description: "Verify multi-tenant isolation and creating new brands dynamically.",
      steps: [
        "In the top bar or sidebar, switch between 'Northwind Studio' and 'Luma Health'.",
        "Click '+ Add Brand' in the sidebar.",
        "Enter Brand Name: 'Apex Studio', Domain: 'apexstudio.com', Logo: 'APEX', and choose a palette.",
        "Click 'Create Brand' and verify it is immediately loaded into the workspace.",
      ],
      expectedResult: "Brand data, live preview, and configurations update instantly with zero state collision.",
    },
    {
      id: "test-theme",
      number: "03",
      title: "Global Theme & Color Palette Engine",
      category: "design",
      icon: "🎨",
      description: "Test color palette presets, custom hex pickers, light/dark mode, and container widths.",
      steps: [
        "Open the 'Brand & Colors' tab in the sidebar.",
        "Click through Palette Presets (Rose Garden, Electric Indigo, Neon Sunset, Forest Emerald).",
        "Switch between ☀️ Light Mode and 🌙 Dark Mode.",
        "Test container widths (1440px Wide, 1280px Standard, Full Width Fluid, 1024px Compact).",
        "Test screen padding (Spacious, Standard, Compact) and click 'Save Changes'.",
      ],
      expectedResult: "The Live Preview Simulator immediately updates with live colors, dark obsidian mode, and container bounds.",
    },
    {
      id: "test-page-editor",
      number: "04",
      title: "Page Building & Content Blocks",
      category: "content",
      icon: "📄",
      description: "Test editing hero banners, adding modular sections, and reordering blocks.",
      steps: [
        "Open the 'Page Editor' tab in the sidebar.",
        "Edit Hero Title, Subtitle, and CTA Button Text in real time.",
        "Click '+ Add Section' and choose 'Features', 'Testimonials', 'CTA', or 'Text'.",
        "Use the ▲ Move Up / ▼ Move Down buttons to reorder sections.",
        "Click '🗑️ Delete' to remove a test section.",
      ],
      expectedResult: "Section hierarchy shifts immediately in the Live Simulator without reloading the page.",
    },
    {
      id: "test-section-theme",
      number: "05",
      title: "Per-Section Custom Themes & Gradients",
      category: "design",
      icon: "✨",
      description: "Test applying individual color presets and backgrounds to specific content sections.",
      steps: [
        "On any section card, locate the 'Section Theme & Background' panel.",
        "Choose a preset like 'Midnight Deep', 'Sunset Glow', or 'Emerald Depth'.",
        "Or pick custom solid colors or CSS gradients for background, text, card, and borders.",
      ],
      expectedResult: "The target section receives bespoke styling while the rest of the page remains harmonious.",
    },
    {
      id: "test-navigation",
      number: "06",
      title: "Header, Top Bar & Submenu Dropdown Navigation",
      category: "navigation",
      icon: "🧭",
      description: "Test top banner announcement, logo image, and multi-level dropdown submenus.",
      steps: [
        "Open the 'Header & Footer' tab.",
        "Toggle 'Enable Top Announcement Bar' ON and edit the announcement text.",
        "Go to 'Pages & Menus' -> Click '+ Add Top Level Menu Item' with label 'Solutions'.",
        "Click '+ Add Submenu' under 'Solutions' and add 2 nested child items.",
        "Hover over or click 'Solutions' in the simulator to verify dropdown behavior.",
      ],
      expectedResult: "Top bar banner renders at the top and multi-level dropdown menus expand smoothly on hover/click.",
    },
    {
      id: "test-footer",
      number: "07",
      title: "Footer Columns, Social Links & Newsletter",
      category: "content",
      icon: "🦶",
      description: "Test multi-column links, social media badges, and newsletter signup.",
      steps: [
        "Open the 'Header & Footer' tab and scroll to Footer Settings.",
        "Add / edit navigation columns (e.g. 'Company', 'Legal', 'Products').",
        "Add social platform links for Twitter, LinkedIn, GitHub, YouTube.",
        "Toggle 'Show Newsletter Subscription' ON and set headline.",
      ],
      expectedResult: "Footer simulator renders all columns, working social icons, and an interactive newsletter input.",
    },
    {
      id: "test-special-blocks",
      number: "08",
      title: "Special Modules: Notices, Programs, Services & Stats",
      category: "content",
      icon: "⚡",
      description: "Test official notices ticker, academic courses, service cards, and metric counters.",
      steps: [
        "Open the 'Modules & News' tab.",
        "Add a Pinned Official Notice with 'New' status badge.",
        "Add an Academic Program or Course with duration, eligibility, and icon emoji.",
        "Add a Service card and a Statistic metric counter (e.g. '10,000+ Active Users').",
      ],
      expectedResult: "Specialized modules display in the simulator with pinned glow badges, emojis, and metrics.",
    },
    {
      id: "test-media",
      number: "09",
      title: "Media Library & File Upload Engine",
      category: "media",
      icon: "🖼️",
      description: "Test local image upload via /api/upload and integrating images into pages and logos.",
      steps: [
        "Open the 'Media Library' tab.",
        "Click 'Upload Media' and select a JPG or PNG file from your computer.",
        "Verify upload completes and the thumbnail appears with size details.",
        "Click 'Copy URL' or assign it as the Hero background image.",
      ],
      expectedResult: "Images upload to public storage and immediately render as page background or logos.",
    },
    {
      id: "test-rich-html",
      number: "10",
      title: "Rich HTML Code Editor Mode & Prebuilt Templates",
      category: "content",
      icon: "💻",
      description: "Test switching from modular block builder to direct HTML/CSS code editor.",
      steps: [
        "In 'Page Editor', toggle 'Use Custom HTML for this page' to ON.",
        "Select a prebuilt template: 'Modern Landing', 'College Portal', or 'Product Showcase'.",
        "Edit HTML tags directly inside the Monaco-style code editor.",
      ],
      expectedResult: "Live simulator switches immediately to rendering bespoke custom HTML/CSS.",
    },
    {
      id: "test-simulator",
      number: "11",
      title: "Live Viewport Responsive Simulator",
      category: "responsive",
      icon: "📱",
      description: "Test Desktop, Tablet, and Mobile viewport simulations.",
      steps: [
        "Open 'Live Simulator' tab or view the preview pane.",
        "Click '💻 Desktop' (1440px wide layout).",
        "Click '📱 Tablet' (768px tablet layout).",
        "Click '📲 Mobile' (375px phone layout) and test clicking the hamburger menu.",
      ],
      expectedResult: "Smooth responsive scaling with functional mobile drawer on phone simulation.",
    },
    {
      id: "test-publishing",
      number: "12",
      title: "Publishing Workflow & Live Public Site Verification",
      category: "publishing",
      icon: "🚀",
      description: "Test publishing tenant pages and accessing live public URLs.",
      steps: [
        "Click 'Publish Live' in the header to activate the tenant.",
        "Click 'Live Site ↗' to open `/tenant/${tenant.id}` in a new tab.",
        "Navigate to a subpage like `/tenant/${tenant.id}/about`.",
      ],
      expectedResult: "Public URL renders all custom themes, navigation, SEO metadata, and sections with full speed.",
    },
    {
      id: "test-interactive-public",
      number: "13",
      title: "Public Interactive Forms: Inquiry Modal & Newsletter",
      category: "publishing",
      icon: "✨",
      description: "Test public visitor interactions like CTA inquiry submission and newsletter signup.",
      steps: [
        "On the public site (`/tenant/${tenant.id}`), click the primary Hero CTA button.",
        "Fill in the Inquiry Form Modal (Name, Email, Message) and click 'Send Inquiry'.",
        "Verify success animation checkmark displays.",
        "Scroll to footer, type email into newsletter box and click 'Subscribe'.",
      ],
      expectedResult: "Inquiry modal animates smoothly with confirmation, and newsletter provides instant feedback.",
    },
  ];

  const filteredTests = testSteps.filter((test) => {
    const matchesCategory = activeSection === "all" || test.category === activeSection;
    const matchesSearch =
      searchQuery.trim() === "" ||
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalTests = testSteps.length;
  const completedCount = Object.values(completedTests).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTests) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-pink-100/80 bg-gradient-to-r from-[#230f1c] via-[#1c0b16] to-[#2d1222] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-pink-300">
            <span>📘 Interactive User Manual & Testing Center</span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight leading-snug">
            Master Every Feature in TenantFlow CMS
          </h2>
          <p className="mt-2 text-sm text-pink-100/70 leading-relaxed">
            Follow this interactive guide to understand, test, and verify all capabilities of your multi-tenant studio—from role permissions to live device simulation and public publishing.
          </p>

          {/* Quick Progress Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-pink-900/40 pt-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex justify-between text-xs font-bold text-pink-200 mb-1.5">
                <span>Testing Progress</span>
                <span>
                  {completedCount} of {totalTests} Tests Completed ({progressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <a
              href={`/tenant/${tenant.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-4 py-2 text-xs font-bold text-white shadow-md shadow-pink-500/30 transition hover:from-pink-600 hover:to-rose-500"
            >
              <span>Launch Live Site</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Role Credentials Reference Card */}
      <div className="rounded-3xl border border-pink-100/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">👥 Test Accounts & Permissions Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Use these demo accounts to test permission scoping and role capabilities.</p>
          </div>
          <span className="rounded-lg bg-pink-50 px-2.5 py-1 text-xs font-bold text-pink-700 border border-pink-200">
            3 Preconfigured Roles
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">👑</span>
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Admin</span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800">admin@tenantflow.io</p>
            <p className="text-[11px] font-mono text-purple-700">password: admin123</p>
            <p className="text-[11px] text-slate-600 mt-2">
              Full access to all brands, brand creation, page deletion, and theme control.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">✍️</span>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Editor</span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800">editor@tenantflow.io</p>
            <p className="text-[11px] font-mono text-blue-700">password: editor123</p>
            <p className="text-[11px] text-slate-600 mt-2">
              Scoped to Northwind Studio. Can edit page content, sections, and publish.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎨</span>
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Designer</span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800">designer@tenantflow.io</p>
            <p className="text-[11px] font-mono text-emerald-700">password: designer123</p>
            <p className="text-[11px] text-slate-600 mt-2">
              Scoped to Luma Health. Can customize brand themes, palettes, and section layouts.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Tests" },
            { id: "security", label: "Security & Auth" },
            { id: "tenancy", label: "Multi-Tenancy" },
            { id: "design", label: "Theme & Styling" },
            { id: "content", label: "Content & Blocks" },
            { id: "navigation", label: "Navigation" },
            { id: "responsive", label: "Responsive" },
            { id: "publishing", label: "Publishing" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveSection(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                activeSection === cat.id
                  ? "bg-pink-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search test scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-pink-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Step-by-Step Test Cards */}
      <div className="space-y-4">
        {filteredTests.map((test) => {
          const isDone = Boolean(completedTests[test.id]);
          return (
            <div
              key={test.id}
              className={`rounded-3xl border transition-all p-5 sm:p-6 ${
                isDone
                  ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
                  : "border-pink-100/80 bg-white shadow-sm hover:border-pink-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-50 border border-pink-200 text-lg flex-shrink-0">
                    {test.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 font-mono">
                        Step {test.number}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{test.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{test.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTest(test.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {isDone ? "✓ Passed" : "Mark as Passed"}
                </button>
              </div>

              {/* Action Steps */}
              <div className="mt-4 rounded-2xl bg-slate-50/80 border border-slate-100 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Action Steps:
                </p>
                <ol className="space-y-1.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                  {test.steps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 text-xs">
                  <span className="font-bold text-slate-900 flex-shrink-0">Expected Result:</span>
                  <span className="text-slate-600">{test.expectedResult}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
