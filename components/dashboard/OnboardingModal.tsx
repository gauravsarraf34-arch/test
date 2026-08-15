"use client";

import React, { useState } from "react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to TenantFlow CMS",
      description:
        "A multi-tenant visual studio built for marketing teams and business owners. Manage unlimited brands and pages without writing a single line of code.",
      highlight: "🚀",
    },
    {
      title: "Switching Between Brands (Tenants)",
      description:
        "Use the active tenant selector on the left sidebar. Each tenant has isolated pages, unique branding colors, navigation links, and SEO settings.",
      highlight: "🏢",
    },
    {
      title: "Customizing Brand Design",
      description:
        "Open the 'Brand & Colors' tab to choose curated designer palettes or configure custom primary & accent colors, light/dark themes, and layout styles.",
      highlight: "🎨",
    },
    {
      title: "Visual Page Builder & Reusable Blocks",
      description:
        "Under 'Page Content', customize your hero banner and add blocks like Features, Testimonials, CTA, and Narratives. Reorder sections with simple arrows.",
      highlight: "🧩",
    },
    {
      title: "Announcements & Domain Modules",
      description:
        "The 'Modules & News' tab gives you ready-to-use boards for official notices, program courses, service amenities, and KPI metric counters.",
      highlight: "📢",
    },
    {
      title: "Fast Media Uploads & Instant Simulator",
      description:
        "Upload images to your media library with automatic optimization. Check how your site looks on Desktop, Tablet, and Mobile in the Live Simulator.",
      highlight: "⚡",
    },
  ];

  const step = steps[currentStep];
  const progress = Math.round(((currentStep + 1) / steps.length) * 100);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl animate-in zoom-in-95">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-4xl shadow-inner">
            {step.highlight}
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{step.title}</h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {step.description}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Skip Guide
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            {currentStep === steps.length - 1 ? "Start Building 🎉" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
