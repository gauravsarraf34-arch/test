import path from "path";
import os from "os";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

export type CmsRole = "admin" | "editor" | "designer";

export type CmsUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: CmsRole;
  tenantIds: string[];
};

export type CmsSection = {
  id: string;
  type: "hero" | "features" | "testimonials" | "cta" | "text" | "html";
  title: string;
  description: string;
  content: string;
  items: string[];
  imageUrl?: string;
  customHtml?: string;
  theme?: {
    preset?: string;
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBgColor?: string;
    borderColor?: string;
  };
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  buttonText: string;
  heroImage: string;
  published: boolean;
  sections: CmsSection[];
  customHtml?: string;
  useCustomHtml?: boolean;
  heroTheme?: {
    preset?: string;
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBgColor?: string;
    borderColor?: string;
  };
};

export type CmsMediaItem = {
  id: string;
  name: string;
  url: string;
  type: "image" | "logo";
};

export type CmsNotice = {
  id: string;
  title: string;
  date: string;
  status: "New" | "Updated" | "Regular";
  link: string;
  isPinned: boolean;
};

export type CmsProgram = {
  id: string;
  name: string;
  description: string;
  duration: string;
  eligibility: string;
  icon?: string;
};

export type CmsService = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type CmsStatistic = {
  id: string;
  label: string;
  value: string;
  icon?: string;
};

export type CmsMenuItem = {
  id: string;
  label: string;
  link: string;
  pageId?: string;
  isExternal?: boolean;
  content?: string;
  children?: CmsMenuItem[];
};

export type CmsHeaderConfig = {
  showTopBar?: boolean;
  topBarText?: string;
  email?: string;
  phone?: string;
  address?: string;
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  theme?: {
    preset?: string;
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBgColor?: string;
    borderColor?: string;
  };
};

export type CmsFooterConfig = {
  companyName?: string;
  aboutText?: string;
  copyrightText?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  columns?: {
    title: string;
    links: { label: string; url: string }[];
  }[];
  socialLinks?: {
    platform: "twitter" | "linkedin" | "facebook" | "instagram" | "youtube" | "github";
    url: string;
  }[];
  showNewsletter?: boolean;
  newsletterHeadline?: string;
  theme?: {
    preset?: string;
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    cardBgColor?: string;
    borderColor?: string;
  };
};

export type CmsTenant = {
  id: string;
  name: string;
  domain: string;
  status: "Active" | "Draft";
  logoText: string;
  nav: string[];
  navigation?: CmsMenuItem[];
  headerConfig?: CmsHeaderConfig;
  footerConfig?: CmsFooterConfig;
  modulesTheme?: {
    notices?: {
      preset?: string;
      bgColor?: string;
      textColor?: string;
      accentColor?: string;
      borderColor?: string;
    };
    services?: {
      preset?: string;
      bgColor?: string;
      textColor?: string;
      accentColor?: string;
      borderColor?: string;
    };
    statistics?: {
      preset?: string;
      bgColor?: string;
      textColor?: string;
      accentColor?: string;
      borderColor?: string;
    };
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    mode: "light" | "dark";
    layout: "classic" | "modern" | "minimal";
  };
  pages: CmsPage[];
  media: CmsMediaItem[];
  notices: CmsNotice[];
  programs: CmsProgram[];
  services: CmsService[];
  statistics: CmsStatistic[];
  seoTitle: string;
  seoDescription: string;
};

export type CmsData = {
  users: CmsUser[];
  tenants: CmsTenant[];
};

const defaultData: CmsData = {
  users: [
    {
      id: "user-admin",
      name: "Alicia Martin",
      email: "admin@tenantflow.io",
      password: "admin123",
      role: "admin",
      tenantIds: ["tenant-1", "tenant-2"],
    },
    {
      id: "user-editor",
      name: "David Chen",
      email: "editor@tenantflow.io",
      password: "editor123",
      role: "editor",
      tenantIds: ["tenant-1"],
    },
    {
      id: "user-designer",
      name: "Sofia Ahmed",
      email: "designer@tenantflow.io",
      password: "designer123",
      role: "designer",
      tenantIds: ["tenant-2"],
    },
  ],
  tenants: [
    {
      id: "tenant-1",
      name: "Northwind Studio",
      domain: "northwindstudio.com",
      status: "Active",
      logoText: "Northwind",
      nav: ["Home", "Services", "Work", "Pricing", "Contact"],
      theme: {
        primary: "#f472b6",
        secondary: "#1e1b2e",
        accent: "#fb7185",
        mode: "light",
        layout: "modern",
      },
      pages: [
        {
          id: "page-1",
          slug: "home",
          title: "Home",
          description: "Main landing page",
          heroTitle: "Turn your brand into a digital experience people remember.",
          heroSubtitle:
            "Build a site that sells, informs, and grows your business with flexible content blocks and multi-tenant control.",
          buttonText: "Launch your website",
          heroImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          published: true,
          sections: [
            {
              id: "section-1",
              type: "features",
              title: "Why teams choose us",
              description: "A modern website system built for speed and collaboration.",
              content: "",
              items: [
                "Easy content updates",
                "Brand-safe design controls",
                "Tenant-based website management",
              ],
            },
            {
              id: "section-2",
              type: "testimonials",
              title: "Client feedback",
              description: "Clients love the simplicity of updating content without IT support.",
              content: "",
              items: [
                "The CMS saved our team hours every week.",
                "Our marketing staff can update pages in minutes.",
              ],
            },
          ],
        },
      ],
      media: [
        {
          id: "media-1",
          name: "Office hero",
          url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
          type: "image",
        },
      ],
      notices: [
        {
          id: "notice-1",
          title: "New Project Kickoff",
          date: "2026-08-15",
          status: "New",
          link: "/news/new-project",
          isPinned: true,
        },
        {
          id: "notice-2",
          title: "Team Expansion Announcement",
          date: "2026-08-10",
          status: "Updated",
          link: "/news/expansion",
          isPinned: false,
        },
      ],
      programs: [
        {
          id: "prog-1",
          name: "Web Development",
          description: "Master modern web technologies and frameworks",
          duration: "12 weeks",
          eligibility: "High school diploma",
          icon: "🌐",
        },
        {
          id: "prog-2",
          name: "Mobile App Development",
          description: "Build iOS and Android applications",
          duration: "12 weeks",
          eligibility: "Basic programming knowledge",
          icon: "📱",
        },
        {
          id: "prog-3",
          name: "Data Science",
          description: "Learn analytics and machine learning",
          duration: "16 weeks",
          eligibility: "Mathematics background",
          icon: "📊",
        },
      ],
      services: [
        { id: "srv-1", name: "Expert Mentorship", description: "Guidance from industry professionals", icon: "👨‍🏫" },
        { id: "srv-2", name: "Live Projects", description: "Work on real-world projects", icon: "💼" },
        { id: "srv-3", name: "Job Placement", description: "Career placement support", icon: "🎯" },
        { id: "srv-4", name: "Flexible Schedule", description: "Learn at your own pace", icon: "⏰" },
        { id: "srv-5", name: "Certification", description: "Industry recognized certificates", icon: "🏆" },
        { id: "srv-6", name: "Community", description: "Join our learning community", icon: "👥" },
      ],
      statistics: [
        { id: "stat-1", label: "Students Trained", value: "500+", icon: "👥" },
        { id: "stat-2", label: "Success Rate", value: "95%", icon: "✅" },
        { id: "stat-3", label: "Job Placements", value: "450+", icon: "💼" },
        { id: "stat-4", label: "Partner Companies", value: "50+", icon: "🏢" },
      ],
      seoTitle: "Northwind Studio | Modern Business Growth",
      seoDescription: "Web content and design management system for growing businesses.",
    },
    {
      id: "tenant-2",
      name: "Luma Health",
      domain: "lumahealth.io",
      status: "Draft",
      logoText: "Luma",
      nav: ["About", "Services", "Resources", "Contact"],
      theme: {
        primary: "#10b981",
        secondary: "#0f172a",
        accent: "#22c55e",
        mode: "dark",
        layout: "classic",
      },
      pages: [
        {
          id: "page-2",
          slug: "about",
          title: "About",
          description: "About the company",
          heroTitle: "Healthcare experiences that feel personal and modern.",
          heroSubtitle:
            "Replace manual edits with a simpler CMS that every team can use confidently.",
          buttonText: "Book a call",
          heroImage:
            "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
          published: false,
          sections: [
            {
              id: "section-3",
              type: "text",
              title: "Our promise",
              description: "Human-centered digital care begins with clear communication.",
              content:
                "We create health journeys that feel welcoming, trustworthy, and easy to navigate.",
              items: [],
            },
          ],
        },
      ],
      media: [],
      notices: [
        {
          id: "notice-3",
          title: "Admission Open 2026-27",
          date: "2026-08-16",
          status: "New",
          link: "/admission",
          isPinned: true,
        },
        {
          id: "notice-4",
          title: "3-Year Diploma Programmes",
          date: "2026-08-12",
          status: "New",
          link: "/programs",
          isPinned: true,
        },
      ],
      programs: [
        {
          id: "prog-4",
          name: "B. Pharmacy",
          description: "Bachelor of Pharmacy - 4 years",
          duration: "4 years",
          eligibility: "12th Pass with Science",
          icon: "💊",
        },
        {
          id: "prog-5",
          name: "D. Pharmacy",
          description: "Diploma in Pharmacy - 2 years",
          duration: "2 years",
          eligibility: "12th Pass",
          icon: "⚗️",
        },
        {
          id: "prog-6",
          name: "BBA",
          description: "Bachelor of Business Administration",
          duration: "3 years",
          eligibility: "12th Pass",
          icon: "💼",
        },
        {
          id: "prog-7",
          name: "BCA",
          description: "Bachelor of Computer Applications",
          duration: "3 years",
          eligibility: "12th Pass with Maths",
          icon: "💻",
        },
        {
          id: "prog-8",
          name: "MBA",
          description: "Master of Business Administration",
          duration: "2 years",
          eligibility: "Bachelor's degree",
          icon: "🎓",
        },
        {
          id: "prog-9",
          name: "MCA",
          description: "Master of Computer Applications",
          duration: "2 years",
          eligibility: "Bachelor's degree",
          icon: "🖥️",
        },
      ],
      services: [
        { id: "srv-7", name: "Experienced Faculty", description: "20+ certified educators", icon: "👨‍🏫" },
        { id: "srv-8", name: "State-of-the-Art Facilities", description: "Modern labs and classrooms", icon: "🏛️" },
        { id: "srv-9", name: "Hostel Facilities", description: "Secure on-campus living", icon: "🏠" },
        { id: "srv-10", name: "Placement Support", description: "100% placement assistance", icon: "💼" },
        { id: "srv-11", name: "Library Services", description: "Extensive book collection", icon: "📚" },
        { id: "srv-12", name: "Sports Facilities", description: "Equipped sports grounds", icon: "⚽" },
        { id: "srv-13", name: "Career Guidance", description: "Professional counseling", icon: "🎯" },
        { id: "srv-14", name: "Global Exposure", description: "International programs", icon: "🌍" },
        { id: "srv-15", name: "Transportation", description: "Campus shuttle service", icon: "🚌" },
        { id: "srv-16", name: "Health Services", description: "On-campus medical care", icon: "⚕️" },
        { id: "srv-17", name: "Scholarships", description: "Financial aid programs", icon: "🏆" },
        { id: "srv-18", name: "Student Clubs", description: "Leadership development", icon: "👥" },
      ],
      statistics: [
        { id: "stat-5", label: "Years Experience", value: "20+", icon: "📅" },
        { id: "stat-6", label: "Educators", value: "20+", icon: "👨‍🏫" },
        { id: "stat-7", label: "Learners", value: "2364+", icon: "👥" },
        { id: "stat-8", label: "Communities", value: "19+", icon: "🌐" },
      ],
      seoTitle: "Luma Health | Trusted Care Experiences",
      seoDescription: "Healthcare marketing site management and patient-first digital content.",
    },
  ],
};

// Global in-memory cache to ensure speed and state sharing across serverless requests
declare global {
  // eslint-disable-next-line no-var
  var __cmsDataCache: CmsData | undefined;
}

function resolveFilePath(): string {
  // Check if running on Vercel or in a serverless environment
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY
  );

  if (isServerless) {
    return path.join(os.tmpdir(), "cms-data.json");
  }

  return path.join(process.cwd(), "data", "cms.json");
}

export function getDataFilePath() {
  return resolveFilePath();
}

function deepClone<T>(item: T): T {
  return JSON.parse(JSON.stringify(item));
}

function migrateAndHealData(raw: CmsData): CmsData {
  const users = Array.isArray(raw.users) && raw.users.length > 0 ? raw.users : defaultData.users;
  const rawTenants = Array.isArray(raw.tenants) && raw.tenants.length > 0 ? raw.tenants : defaultData.tenants;

  const migratedTenants = rawTenants.map((tenant) => {
    let navigation = tenant.navigation;
    const pages = [...(tenant.pages || [])];

    if (!navigation || navigation.length === 0) {
      if (pages.length > 0) {
        navigation = pages.map((p) => ({
          id: `menu-${p.id}`,
          label: p.title,
          link: p.slug === "home" ? `/tenant/${tenant.id}` : `/tenant/${tenant.id}/${p.slug}`,
          pageId: p.id,
          children: [],
        }));
      } else {
        navigation = (tenant.nav || ["Home", "About", "Services", "Contact"]).map((item, idx) => ({
          id: `menu-nav-${idx}`,
          label: item,
          link: "#",
          children: [],
        }));
      }
    }

    // Sync menu items with existing pages (never recreate deleted pages)
    const healMenuItem = (item: CmsMenuItem) => {
      if (item.pageId) {
        const linked = pages.find((p) => p.id === item.pageId);
        if (linked) {
          item.link = linked.slug === "home" ? `/tenant/${tenant.id}` : `/tenant/${tenant.id}/${linked.slug}`;
        } else {
          item.pageId = undefined;
          if (!item.link || item.link.startsWith(`/tenant/${tenant.id}/`)) {
            item.link = "#";
          }
        }
      }

      if (item.children && item.children.length > 0) {
        item.children.forEach(healMenuItem);
      }
    };

    navigation.forEach(healMenuItem);

    return {
      ...tenant,
      navigation,
      pages,
      notices: tenant.notices || [],
      programs: tenant.programs || [],
      services: tenant.services || [],
      statistics: tenant.statistics || [],
    };
  });

  return {
    users,
    tenants: migratedTenants,
  };
}

export async function readData(): Promise<CmsData> {
  // If memory cache exists, return it
  if (globalThis.__cmsDataCache) {
    return deepClone(globalThis.__cmsDataCache);
  }

  const filePath = resolveFilePath();

  try {
    if (existsSync(filePath)) {
      const fileContent = readFileSync(filePath, "utf-8");
      if (fileContent.trim()) {
        const parsed = JSON.parse(fileContent) as CmsData;
        const healed = migrateAndHealData(parsed);
        globalThis.__cmsDataCache = healed;
        return deepClone(healed);
      }
    }
  } catch (error) {
    console.warn("Could not read from file storage, falling back to default data:", error);
  }

  // Fallback to default initial data
  const initial = migrateAndHealData(defaultData);
  globalThis.__cmsDataCache = initial;
  
  // Try persisting initial state
  try {
    await writeData(initial);
  } catch {
    // Ignore initial write errors if disk is read-only
  }

  return deepClone(initial);
}

export async function writeData(data: CmsData): Promise<void> {
  const healed = migrateAndHealData(data);
  globalThis.__cmsDataCache = deepClone(healed);

  const filePath = resolveFilePath();

  try {
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(healed, null, 2), "utf-8");
  } catch (error) {
    console.warn("Writing to disk failed (operating in in-memory mode):", error);
    // In serverless when disk write fails, memory cache still holds the state
  }
}
