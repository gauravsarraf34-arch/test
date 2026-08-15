export interface PrebuiltTemplate {
  id: string;
  name: string;
  category: "Landing" | "About" | "Pricing" | "Services" | "FAQ" | "Team" | "Contact" | "Education" | "Medical";
  icon: string;
  description: string;
  html: string;
}

export const PREBUILT_HTML_TEMPLATES: PrebuiltTemplate[] = [
  {
    id: "full-landing-hero-features",
    name: "Modern Landing Showcase",
    category: "Landing",
    icon: "🚀",
    description: "Complete conversion page with gradient hero, 3 feature pillars, and customer quote",
    html: `<div class="space-y-12 py-8 font-sans">
  <!-- Hero Showcase Banner -->
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 sm:p-12 text-white shadow-2xl">
    <div class="max-w-2xl">
      <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 border border-white/15">
        ✨ Enterprise Ready
      </span>
      <h2 class="mt-5 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
        Build Faster. Scale Higher. Deliver Seamlessly.
      </h2>
      <p class="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed">
        Everything your organization needs to orchestrate modern digital experiences with speed, flexibility, and zero complexity.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="#contact" class="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-slate-100 transition">
          Get Started Free
        </a>
        <a href="#features" class="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
          Live Demo →
        </a>
      </div>
    </div>
  </div>

  <!-- 3 Feature Pillars -->
  <div class="grid gap-6 sm:grid-cols-3">
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">⚡</div>
      <h3 class="mt-4 text-lg font-bold text-slate-900">Instant Performance</h3>
      <p class="mt-2 text-xs text-slate-600 leading-relaxed">
        Sub-second response times with global edge CDN caching and smart asset compression.
      </p>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl text-purple-600">🛡️</div>
      <h3 class="mt-4 text-lg font-bold text-slate-900">Enterprise Security</h3>
      <p class="mt-2 text-xs text-slate-600 leading-relaxed">
        Role-based access control, automated token signing, and end-to-end data encryption.
      </p>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">🎨</div>
      <h3 class="mt-4 text-lg font-bold text-slate-900">Visual Page Studio</h3>
      <p class="mt-2 text-xs text-slate-600 leading-relaxed">
        Edit live content, submenus, brand themes, and media without needing developer intervention.
      </p>
    </div>
  </div>
</div>`,
  },
  {
    id: "pricing-comparison-table",
    name: "Tiered Pricing Cards",
    category: "Pricing",
    icon: "💳",
    description: "3-tier pricing cards (Starter, Professional, Enterprise) with feature checklist",
    html: `<div class="py-10 font-sans">
  <div class="text-center max-w-xl mx-auto mb-10">
    <h2 class="text-3xl font-black text-slate-900">Simple, Transparent Pricing</h2>
    <p class="text-xs text-slate-600 mt-2">Choose the plan tailored to your team size and digital ambitions.</p>
  </div>

  <div class="grid gap-6 sm:grid-cols-3 items-stretch">
    <!-- Starter -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 class="text-base font-bold text-slate-900">Starter</h3>
        <p class="text-xs text-slate-500 mt-1">For single brands & small businesses</p>
        <div class="mt-4 text-3xl font-black text-slate-900">$29<span class="text-xs font-normal text-slate-500">/mo</span></div>
        <ul class="mt-6 space-y-2.5 text-xs text-slate-600 border-t pt-4">
          <li class="flex items-center gap-2">✓ 1 Active Domain / Tenant</li>
          <li class="flex items-center gap-2">✓ Up to 10 Landing Pages</li>
          <li class="flex items-center gap-2">✓ Visual Rich Text Editor</li>
          <li class="flex items-center gap-2">✓ Standard Support</li>
        </ul>
      </div>
      <button class="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50">
        Choose Starter
      </button>
    </div>

    <!-- Pro (Highlighted) -->
    <div class="rounded-3xl border-2 border-indigo-600 bg-gradient-to-b from-indigo-50/50 to-white p-6 shadow-xl flex flex-col justify-between relative">
      <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
        Most Popular
      </span>
      <div>
        <h3 class="text-base font-bold text-indigo-900">Professional</h3>
        <p class="text-xs text-slate-500 mt-1">For growing marketing teams</p>
        <div class="mt-4 text-3xl font-black text-indigo-600">$79<span class="text-xs font-normal text-slate-500">/mo</span></div>
        <ul class="mt-6 space-y-2.5 text-xs text-slate-700 border-t border-indigo-100 pt-4">
          <li class="flex items-center gap-2 font-semibold">✓ 5 Multi-Brand Tenants</li>
          <li class="flex items-center gap-2 font-semibold">✓ Unlimited Landing Pages</li>
          <li class="flex items-center gap-2 font-semibold">✓ Submenu & Dropdown Hierarchy</li>
          <li class="flex items-center gap-2 font-semibold">✓ Pre-built HTML Template Library</li>
          <li class="flex items-center gap-2 font-semibold">✓ Priority 24/7 Support</li>
        </ul>
      </div>
      <button class="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700">
        Get Started Pro
      </button>
    </div>

    <!-- Enterprise -->
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 class="text-base font-bold text-slate-900">Enterprise</h3>
        <p class="text-xs text-slate-500 mt-1">For organizations & agencies</p>
        <div class="mt-4 text-3xl font-black text-slate-900">$199<span class="text-xs font-normal text-slate-500">/mo</span></div>
        <ul class="mt-6 space-y-2.5 text-xs text-slate-600 border-t pt-4">
          <li class="flex items-center gap-2">✓ Unlimited Tenants</li>
          <li class="flex items-center gap-2">✓ Custom Domain Routing</li>
          <li class="flex items-center gap-2">✓ Role Scoped Permissions</li>
          <li class="flex items-center gap-2">✓ Dedicated Account Manager</li>
        </ul>
      </div>
      <button class="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50">
        Contact Sales
      </button>
    </div>
  </div>
</div>`,
  },
  {
    id: "about-us-story-timeline",
    name: "About Us & Vision Story",
    category: "About",
    icon: "📖",
    description: "Company narrative with mission statement, core values, and stats milestone box",
    html: `<div class="space-y-8 py-8 font-sans">
  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
    <span class="text-xs font-bold uppercase tracking-widest text-indigo-600">Our Heritage & Mission</span>
    <h2 class="mt-3 text-3xl sm:text-4xl font-black text-slate-900">
      Crafting purposeful digital solutions that empower people everywhere.
    </h2>
    <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
      Founded with a vision to eliminate the barrier between creative ideas and website deployment, we build tools that enable educators, healthcare providers, and enterprises to manage their presence effortlessly.
    </p>

    <div class="mt-8 grid gap-4 sm:grid-cols-3 pt-6 border-t border-slate-200">
      <div>
        <h4 class="text-2xl font-black text-indigo-600">20+ Years</h4>
        <p class="text-xs text-slate-500 mt-1">Combined industry experience</p>
      </div>
      <div>
        <h4 class="text-2xl font-black text-indigo-600">100k+</h4>
        <p class="text-xs text-slate-500 mt-1">Users impacted worldwide</p>
      </div>
      <div>
        <h4 class="text-2xl font-black text-indigo-600">99.9%</h4>
        <p class="text-xs text-slate-500 mt-1">Client satisfaction rating</p>
      </div>
    </div>
  </div>

  <!-- Core Values -->
  <div class="grid gap-6 sm:grid-cols-2">
    <div class="rounded-2xl border border-slate-200 p-6 bg-white">
      <h3 class="text-base font-bold text-slate-900">💡 Innovation First</h3>
      <p class="text-xs text-slate-600 mt-2 leading-relaxed">
        We constantly push the boundaries of intuitive UX, reactive synchronization, and modular design systems.
      </p>
    </div>
    <div class="rounded-2xl border border-slate-200 p-6 bg-white">
      <h3 class="text-base font-bold text-slate-900">🤝 Human Centered</h3>
      <p class="text-xs text-slate-600 mt-2 leading-relaxed">
        Software is only as good as the human connection it enables. Everything we create is accessible and user-friendly.
      </p>
    </div>
  </div>
</div>`,
  },
  {
    id: "faq-accordion-help",
    name: "Frequently Asked Questions (FAQ)",
    category: "FAQ",
    icon: "❓",
    description: "Expandable FAQ cards with clean questions and comprehensive answers",
    html: `<div class="py-8 font-sans max-w-3xl mx-auto">
  <div class="text-center mb-8">
    <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
    <p class="text-xs text-slate-500 mt-1">Have questions? We are here to help you get the answers you need.</p>
  </div>

  <div class="space-y-4">
    <details class="group rounded-2xl border border-slate-200 bg-white p-4 open:bg-indigo-50/30 open:border-indigo-200 transition">
      <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm list-none">
        <span>How does multi-tenant brand isolation work?</span>
        <span class="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <p class="mt-3 text-xs text-slate-600 leading-relaxed">
        Each tenant operates as a separate workspace with its own pages, brand colors, navigation hierarchy, media library, and SEO settings, all managed from a centralized dashboard.
      </p>
    </details>

    <details class="group rounded-2xl border border-slate-200 bg-white p-4 open:bg-indigo-50/30 open:border-indigo-200 transition">
      <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm list-none">
        <span>Can I insert custom HTML code or use rich text?</span>
        <span class="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <p class="mt-3 text-xs text-slate-600 leading-relaxed">
        Yes! You can either use our visual rich text editor or switch directly to Raw HTML mode to paste pre-built templates and custom responsive code blocks.
      </p>
    </details>

    <details class="group rounded-2xl border border-slate-200 bg-white p-4 open:bg-indigo-50/30 open:border-indigo-200 transition">
      <summary class="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm list-none">
        <span>How do dropdown submenus work on mobile devices?</span>
        <span class="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <p class="mt-3 text-xs text-slate-600 leading-relaxed">
        On mobile viewports, menus with sub-items automatically format into touch-friendly accordion drawers with expand and collapse controls.
      </p>
    </details>
  </div>
</div>`,
  },
  {
    id: "course-syllabus-academic",
    name: "Course Catalog & Syllabus Table",
    category: "Education",
    icon: "🎓",
    description: "Academic course overview with curriculum semester table, prerequisites, and faculty coordinator",
    html: `<div class="space-y-8 py-8 font-sans">
  <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
    <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
      <div>
        <span class="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">4-Year Degree Track</span>
        <h2 class="mt-2 text-2xl sm:text-3xl font-black text-slate-900">Bachelor of Science in Information Technology</h2>
      </div>
      <div class="text-right">
        <span class="text-xs text-slate-500 font-medium">Credits Required:</span>
        <div class="text-lg font-black text-indigo-600">120 ECTS</div>
      </div>
    </div>

    <!-- Curriculum Table -->
    <div class="mt-6 overflow-x-auto">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b bg-slate-50 text-slate-700">
            <th class="py-2.5 px-3 font-bold">Code</th>
            <th class="py-2.5 px-3 font-bold">Course Title</th>
            <th class="py-2.5 px-3 font-bold">Semester</th>
            <th class="py-2.5 px-3 font-bold">Credits</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-slate-600">
          <tr>
            <td class="py-2.5 px-3 font-mono font-bold text-indigo-600">CS-101</td>
            <td class="py-2.5 px-3 font-medium text-slate-800">Introduction to Computer Science & Algorithms</td>
            <td class="py-2.5 px-3">Semester 1</td>
            <td class="py-2.5 px-3">4.0</td>
          </tr>
          <tr>
            <td class="py-2.5 px-3 font-mono font-bold text-indigo-600">CS-204</td>
            <td class="py-2.5 px-3 font-medium text-slate-800">Full-Stack Web Architecture & Next.js</td>
            <td class="py-2.5 px-3">Semester 2</td>
            <td class="py-2.5 px-3">4.0</td>
          </tr>
          <tr>
            <td class="py-2.5 px-3 font-mono font-bold text-indigo-600">DB-301</td>
            <td class="py-2.5 px-3 font-medium text-slate-800">Relational Database Systems & SQL Optimization</td>
            <td class="py-2.5 px-3">Semester 3</td>
            <td class="py-2.5 px-3">3.5</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>`,
  },
  {
    id: "contact-office-hours-card",
    name: "Contact & Hours Card",
    category: "Contact",
    icon: "📬",
    description: "Office location card with operating hours, phone numbers, and direct support email",
    html: `<div class="grid gap-6 sm:grid-cols-2 py-8 font-sans">
  <div class="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
    <h3 class="text-xl font-bold text-slate-900">Office & Headquarters</h3>
    <p class="text-xs text-slate-500 mt-1">Visit our main campus or send physical correspondence.</p>

    <div class="mt-6 space-y-3 text-xs text-slate-700">
      <div class="flex items-start gap-3">
        <span class="text-base">📍</span>
        <div>
          <span class="font-bold">Main Address:</span>
          <p class="text-slate-500">100 Innovation Boulevard, Tech Park Suite 400</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-base">📞</span>
        <div>
          <span class="font-bold">Phone Number:</span>
          <p class="text-slate-500">+1 (800) 555-0199 / +1 (800) 555-0200</p>
        </div>
      </div>
      <div class="flex items-start gap-3">
        <span class="text-base">✉️</span>
        <div>
          <span class="font-bold">Support Email:</span>
          <p class="text-slate-500">admissions@domain.org / support@domain.org</p>
        </div>
      </div>
    </div>
  </div>

  <div class="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
    <h3 class="text-xl font-bold text-slate-900">Operating Hours</h3>
    <p class="text-xs text-slate-500 mt-1">Our support staff is available during standard business hours.</p>

    <div class="mt-6 space-y-2 text-xs divide-y divide-slate-200/70">
      <div class="flex justify-between py-2">
        <span class="font-semibold text-slate-700">Monday – Friday</span>
        <span class="text-slate-500 font-mono">08:00 AM – 06:00 PM</span>
      </div>
      <div class="flex justify-between py-2">
        <span class="font-semibold text-slate-700">Saturday</span>
        <span class="text-slate-500 font-mono">09:00 AM – 02:00 PM</span>
      </div>
      <div class="flex justify-between py-2">
        <span class="font-semibold text-slate-700">Sunday</span>
        <span class="text-rose-600 font-semibold">Closed</span>
      </div>
    </div>
  </div>
</div>`,
  },
];
