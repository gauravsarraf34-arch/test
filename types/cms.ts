export type ThemeMode = "light" | "dark";
export type LayoutStyle = "classic" | "modern" | "minimal";
export type ContainerWidth = "wide" | "standard" | "full" | "compact"; // wide (1440px), standard (1280px), full (fluid 100%), compact (1024px)
export type PagePadding = "standard" | "spacious" | "compact"; // standard (px-8), spacious (px-16), compact (px-4)
export type UserRole = "admin" | "editor" | "designer";

export type MenuItem = {
  id: string;
  label: string;
  link: string; // e.g. "/services", "https://...", or "#notices"
  pageId?: string; // if linked to a specific CMS Page
  isExternal?: boolean;
  content?: string; // Optional direct rich HTML content for this menu item
  children?: MenuItem[]; // Submenu dropdown items
};

export type SocialPlatform = "twitter" | "linkedin" | "facebook" | "instagram" | "youtube" | "github";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type FooterColumn = {
  title: string;
  links: { label: string; url: string }[];
};

export type TenantHeaderConfig = {
  showTopBar?: boolean;
  topBarText?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoImage?: string; // Optional custom brand logo image
  ctaText?: string;
  ctaLink?: string;
  showCta?: boolean;
  theme?: SectionThemeConfig; // Custom header and top-bar color theme
};

export type TenantFooterConfig = {
  companyName?: string;
  logoImage?: string; // Optional footer logo image
  aboutText?: string;
  copyrightText?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  columns?: FooterColumn[];
  socialLinks?: SocialLink[];
  showNewsletter?: boolean;
  newsletterHeadline?: string;
  theme?: SectionThemeConfig; // Custom footer color theme
};

export type MediaItem = {
  id: string;
  name: string;
  url: string;
  type: "image" | "logo";
};

export type Notice = {
  id: string;
  title: string;
  date: string;
  status: "New" | "Updated" | "Regular";
  link: string;
  isPinned: boolean;
};

export type Program = {
  id: string;
  name: string;
  description: string;
  duration: string;
  eligibility: string;
  icon?: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type Statistic = {
  id: string;
  label: string;
  value: string;
  icon?: string;
};

export type SectionType = "hero" | "features" | "testimonials" | "cta" | "text" | "html";

export type SectionThemeConfig = {
  preset?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  cardBgColor?: string;
  borderColor?: string;
};

export type Section = {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  content: string;
  items: string[];
  imageUrl?: string;
  customHtml?: string; // Custom or CKEditor generated HTML
  theme?: SectionThemeConfig; // Individual section color theme override
  layout?: "cards" | "list" | "split" | "banner" | "centered"; // Block display layout
  columns?: number; // Grid column count (1, 2, 3, 4)
  badge?: string; // Pill tag badge
  icon?: string; // Icon or emoji
  buttonText?: string; // CTA action button label
  buttonUrl?: string; // CTA action button link URL
  secondaryButtonText?: string; // Secondary action button label
  secondaryButtonUrl?: string; // Secondary action button link URL
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  buttonText: string;
  heroImage: string;
  published: boolean;
  sections: Section[];
  customHtml?: string; // Full-page pre-built HTML template
  useCustomHtml?: boolean;
  heroTheme?: SectionThemeConfig; // Individual color theme for Hero Section
  containerWidth?: ContainerWidth; // Override container max width for this specific page
  pagePadding?: PagePadding; // Override side margin padding for this specific page
};

export type ModulesThemeConfig = {
  notices?: SectionThemeConfig;
  services?: SectionThemeConfig;
  statistics?: SectionThemeConfig;
};

export type TenantTheme = {
  primary: string;
  secondary: string;
  accent: string;
  mode: ThemeMode;
  layout: LayoutStyle;
  containerWidth?: ContainerWidth; // Global website container width (default "wide" / 1440px)
  pagePadding?: PagePadding; // Global website side margin padding (default "standard")
};

export type Tenant = {
  id: string;
  name: string;
  domain: string;
  status: "Active" | "Draft";
  logoText: string;
  logoImage?: string; // Brand logo image URL
  nav: string[];
  navigation?: MenuItem[]; // Structured menu and submenus
  headerConfig?: TenantHeaderConfig;
  footerConfig?: TenantFooterConfig;
  modulesTheme?: ModulesThemeConfig; // Color themes for Special Modules
  theme: TenantTheme;
  pages: Page[];
  media: MediaItem[];
  notices: Notice[];
  programs: Program[];
  services: Service[];
  statistics: Statistic[];
  seoTitle: string;
  seoDescription: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  tenantIds: string[];
};
