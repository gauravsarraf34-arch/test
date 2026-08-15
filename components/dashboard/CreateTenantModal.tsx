"use client";

import React, { useState } from "react";
import { Tenant, Page, ThemeMode, LayoutStyle } from "@/types/cms";

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTenant: (newTenant: Tenant) => void;
}

type TemplateType = "education" | "healthcare" | "saas" | "agency" | "blank";

interface TemplatePreset {
  id: TemplateType;
  title: string;
  badge: string;
  icon: string;
  primary: string;
  accent: string;
  secondary: string;
  heroTitle: string;
  heroSubtitle: string;
  samplePrograms: { name: string; desc: string; dur: string; elig: string; icon: string }[];
  sampleServices: { name: string; desc: string; icon: string }[];
  sampleStats: { label: string; value: string; icon: string }[];
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: "education",
    title: "University & Academy",
    badge: "Academic",
    icon: "🎓",
    primary: "#1e40af",
    accent: "#f59e0b",
    secondary: "#0f172a",
    heroTitle: "Empowering Next-Generation Leaders & Innovators",
    heroSubtitle: "World-class faculty, accredited degree programs, and global career opportunities.",
    samplePrograms: [
      { name: "Computer Science & AI", desc: "4-Year Bachelor of Technology", dur: "4 Years", elig: "12th Science / Math", icon: "💻" },
      { name: "Business Administration (MBA)", desc: "Global executive leadership track", dur: "2 Years", elig: "Bachelor's Degree", icon: "💼" },
      { name: "Biomedical Engineering", desc: "Advanced healthcare research", dur: "4 Years", elig: "12th Science", icon: "🧬" },
    ],
    sampleServices: [
      { name: "Digital Campus & Labs", desc: "High-performance computing clusters", icon: "🔬" },
      { name: "100% Placement Support", desc: "Direct recruitment with Fortune 500", icon: "🎯" },
      { name: "On-Campus Living", desc: "Secure modern residence halls", icon: "🏠" },
      { name: "Global Exchange", desc: "Semesters abroad in 15+ countries", icon: "🌍" },
    ],
    sampleStats: [
      { label: "Graduates", value: "12,000+", icon: "🎓" },
      { label: "Placement Rate", value: "98.4%", icon: "📈" },
      { label: "Partner Companies", value: "240+", icon: "🏢" },
      { label: "Research Citations", value: "15,000+", icon: "📚" },
    ],
  },
  {
    id: "healthcare",
    title: "Hospital & Wellness",
    badge: "Medical",
    icon: "🏥",
    primary: "#059669",
    accent: "#06b6d4",
    secondary: "#064e3b",
    heroTitle: "Compassionate Healthcare with Modern Innovation",
    heroSubtitle: "Personalized clinical care, 24/7 emergency response, and certified medical specialists.",
    samplePrograms: [
      { name: "Cardiology Center", desc: "Comprehensive heart health and surgery", dur: "Specialized", elig: "Doctor Referral", icon: "❤️" },
      { name: "Orthopedic Surgery", desc: "Joint replacement and physical therapy", dur: "Outpatient", elig: "Consultation", icon: "🦴" },
    ],
    sampleServices: [
      { name: "24/7 Emergency Care", desc: "Immediate trauma response team", icon: "🚑" },
      { name: "Diagnostic Imaging", desc: "MRI, CT Scan, and Ultrasound", icon: "🩻" },
      { name: "Telehealth Visits", desc: "Consult doctors from home", icon: "📱" },
    ],
    sampleStats: [
      { label: "Patients Healed", value: "50,000+", icon: "👥" },
      { label: "Specialists", value: "85+", icon: "👨‍⚕️" },
      { label: "Patient Rating", value: "4.9/5", icon: "⭐" },
    ],
  },
  {
    id: "saas",
    title: "Software & Technology",
    badge: "Tech & Cloud",
    icon: "⚡",
    primary: "#4f46e5",
    accent: "#ec4899",
    secondary: "#090d16",
    heroTitle: "Scale Your Operations with Intelligent Automation",
    heroSubtitle: "Cloud infrastructure, AI-powered analytics, and instant integrations for growing enterprises.",
    samplePrograms: [
      { name: "Enterprise Cloud", desc: "Dedicated high-throughput pipelines", dur: "Annual", elig: "All Teams", icon: "☁️" },
      { name: "AI Copilot Engine", desc: "Generative workflow assistant", dur: "Monthly", elig: "Pro Tier", icon: "🤖" },
    ],
    sampleServices: [
      { name: "99.99% SLA Uptime", desc: "Multi-region redundancy", icon: "🛡️" },
      { name: "Real-time Webhooks", desc: "Instant REST and GraphQL APIs", icon: "⚡" },
      { name: "SOC-2 Certified", desc: "End-to-end data encryption", icon: "🔒" },
    ],
    sampleStats: [
      { label: "API Requests/day", value: "100M+", icon: "⚡" },
      { label: "Active Organizations", value: "4,200+", icon: "🏢" },
      { label: "Uptime", value: "99.99%", icon: "✅" },
    ],
  },
  {
    id: "agency",
    title: "Creative Agency & Studio",
    badge: "Design",
    icon: "✨",
    primary: "#7c3aed",
    accent: "#f97316",
    secondary: "#18181b",
    heroTitle: "We Craft Distinct Brands That Captivate Audiences",
    heroSubtitle: "Award-winning brand identity, visual storytelling, and high-conversion web experiences.",
    samplePrograms: [
      { name: "Brand Identity Design", desc: "Typography, logos, guidelines", dur: "4 Weeks", elig: "Startups & Growth", icon: "🎨" },
      { name: "Full-Stack Web Apps", desc: "Custom Next.js design and development", dur: "6 Weeks", elig: "Custom Scope", icon: "💻" },
    ],
    sampleServices: [
      { name: "Visual Strategy", desc: "Market positioning and brand voice", icon: "💡" },
      { name: "UI/UX Prototyping", desc: "Figma wireframing and user testing", icon: "📐" },
      { name: "3D & Motion Graphics", desc: "Dynamic web micro-interactions", icon: "🎬" },
    ],
    sampleStats: [
      { label: "Awwwards Won", value: "18", icon: "🏆" },
      { label: "Client ROI", value: "+340%", icon: "📈" },
      { label: "Brands Launched", value: "120+", icon: "🚀" },
    ],
  },
  {
    id: "blank",
    title: "Blank Custom Tenant",
    badge: "Empty",
    icon: "📄",
    primary: "#2563eb",
    accent: "#f59e0b",
    secondary: "#0f172a",
    heroTitle: "Welcome to our new digital experience",
    heroSubtitle: "Customize this landing page with your own content blocks and branding.",
    samplePrograms: [],
    sampleServices: [],
    sampleStats: [],
  },
];

export function CreateTenantModal({ isOpen, onClose, onCreateTenant }: CreateTenantModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("education");
  const [brandName, setBrandName] = useState("Apex Institute of Technology");
  const [domain, setDomain] = useState("apex-tech.edu");
  const [logoText, setLogoText] = useState("Apex Tech");
  const [primaryColor, setPrimaryColor] = useState("#1e40af");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [layout, setLayout] = useState<LayoutStyle>("modern");

  if (!isOpen) return null;

  const handleSelectTemplate = (template: TemplatePreset) => {
    setSelectedTemplate(template.id);
    setPrimaryColor(template.primary);
    setAccentColor(template.accent);
    if (template.id === "education") {
      setBrandName("Apex Institute of Technology");
      setDomain("apex-tech.edu");
      setLogoText("Apex Tech");
    } else if (template.id === "healthcare") {
      setBrandName("Meridian Health Center");
      setDomain("meridianhealth.io");
      setLogoText("Meridian");
    } else if (template.id === "saas") {
      setBrandName("NovaFlow Cloud");
      setDomain("novaflow.io");
      setLogoText("NovaFlow");
    } else if (template.id === "agency") {
      setBrandName("Vanguard Creative");
      setDomain("vanguardstudio.design");
      setLogoText("Vanguard");
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const tmpl = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
    const tenantId = `tenant-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const pageId = `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

    const initialPage: Page = {
      id: pageId,
      slug: "home",
      title: "Home",
      description: `Official home page of ${brandName}`,
      heroTitle: tmpl.heroTitle,
      heroSubtitle: tmpl.heroSubtitle,
      buttonText: "Explore Offerings",
      heroImage:
        selectedTemplate === "education"
          ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
          : selectedTemplate === "healthcare"
          ? "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
          : selectedTemplate === "saas"
          ? "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
          : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      published: true,
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          type: "features",
          title: "Core Advantages & Highlights",
          description: `Discover why people choose ${brandName} for their journey.`,
          content: "",
          items: ["Excellence in execution", "Dedicated industry mentors", "Proven outcomes and career growth"],
        },
        {
          id: `sec-${Date.now()}-2`,
          type: "testimonials",
          title: "Member & Client Reviews",
          description: "What our community has to say about their experience.",
          content: "",
          items: [
            `"${brandName} provided exceptional quality and hands-on guidance from start to finish."`,
            '"The team and platform exceeded all expectations with their responsiveness."',
          ],
        },
      ],
    };

    const newTenant: Tenant = {
      id: tenantId,
      name: brandName,
      domain: domain.toLowerCase().trim(),
      status: "Active",
      logoText: logoText || brandName,
      nav: ["Home", "About", "Programs", "Services", "Contact"],
      theme: {
        primary: primaryColor,
        secondary: tmpl.secondary,
        accent: accentColor,
        mode: mode,
        layout: layout,
      },
      pages: [initialPage],
      media: [],
      notices: [
        {
          id: `notice-${Date.now()}`,
          title: `Welcome to ${brandName} Official Portal`,
          date: new Date().toISOString().split("T")[0],
          status: "New",
          link: "#",
          isPinned: true,
        },
      ],
      programs: tmpl.samplePrograms.map((p, idx) => ({
        id: `prog-${Date.now()}-${idx}`,
        name: p.name,
        description: p.desc,
        duration: p.dur,
        eligibility: p.elig,
        icon: p.icon,
      })),
      services: tmpl.sampleServices.map((s, idx) => ({
        id: `srv-${Date.now()}-${idx}`,
        name: s.name,
        description: s.desc,
        icon: s.icon,
      })),
      statistics: tmpl.sampleStats.map((stat, idx) => ({
        id: `stat-${Date.now()}-${idx}`,
        label: stat.label,
        value: stat.value,
        icon: stat.icon,
      })),
      seoTitle: `${brandName} | Official Website`,
      seoDescription: `${brandName} offers world-class experiences, accredited programs, and dedicated services.`,
    };

    onCreateTenant(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">Register New Brand / Tenant</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Launch an isolated multi-tenant website with ready-to-use domain modules
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-6 space-y-6">
          {/* Step 1: Industry Template Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1. Choose Industry Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl mb-1">{tmpl.icon}</span>
                    <span className="text-xs font-bold text-slate-900">{tmpl.title}</span>
                    <span className="mt-1 inline-block rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {tmpl.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Brand Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              2. Brand & Domain Details
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Organization / Brand Name</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Apex Academy"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Domain Name</label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. apex-academy.edu"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-mono focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Logo Text / Navbar Title</label>
                <input
                  type="text"
                  required
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="e.g. Apex"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Theme Mode & Layout</label>
                <div className="mt-1 flex gap-2">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as ThemeMode)}
                    aria-label="Theme Mode"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                  </select>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value as LayoutStyle)}
                    aria-label="Layout Style"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Color Branding */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              3. Visual Brand Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Primary</span>
                  <p className="text-xs font-mono font-bold text-slate-800">{primaryColor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Accent</span>
                  <p className="text-xs font-mono font-bold text-slate-800">{accentColor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700"
            >
              🚀 Register & Launch Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
