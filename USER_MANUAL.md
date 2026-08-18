# 📘 TenantFlow CMS — Complete User Manual & Testing Guide

Welcome to the **TenantFlow CMS** User Manual! This guide explains everything you need to know to operate, configure, build, and thoroughly test every feature of this multi-tenant visual content management system.

---

## 📑 Table of Contents

1. [System Overview & Architecture](#-1-system-overview--architecture)
2. [Quick Start & Local Setup](#-2-quick-start--local-setup)
3. [User Roles & Demo Credentials](#-3-user-roles--demo-credentials)
4. [Step-by-Step Feature Testing Guide](#-4-step-by-step-feature-testing-guide)
   - [Test 1: Authentication & Role Access](#test-1-authentication--role-access)
   - [Test 2: Tenant Switching & Creation](#test-2-tenant-switching--creation)
   - [Test 3: Theme & Branding Engine](#test-3-theme--branding-engine)
   - [Test 4: Page Management & Block Builder](#test-4-page-management--block-builder)
   - [Test 5: Per-Section Theme Overrides](#test-5-per-section-theme-overrides)
   - [Test 6: Header & Submenu Navigation](#test-6-header--submenu-navigation)
   - [Test 7: Footer, Socials & Newsletter](#test-7-footer-socials--newsletter)
   - [Test 8: Special Content Blocks (Notices, Programs, Services, Stats)](#test-8-special-content-blocks)
   - [Test 9: Media Library & File Uploads](#test-9-media-library--file-uploads)
   - [Test 10: Rich HTML Code Editor Mode](#test-10-rich-html-code-editor-mode)
   - [Test 11: Live Device Simulator (Desktop, Tablet, Mobile)](#test-11-live-device-simulator)
   - [Test 12: Publishing & Public Tenant View](#test-12-publishing--public-tenant-view)
   - [Test 13: Interactive Public Features (Forms & Modals)](#test-13-interactive-public-features)
5. [End-to-End Testing Checklist Matrix](#-5-end-to-end-testing-checklist-matrix)
6. [Troubleshooting & FAQs](#-6-troubleshooting--faqs)

---

## 🏛️ 1. System Overview & Architecture

**TenantFlow CMS** is a modern visual CMS built with **Next.js 16 (App Router)** and **Tailwind CSS**. It allows organizations to manage isolated multi-brand websites with dynamic themes, real-time live preview simulation, and flexible content building.

### Key Capabilities:
- **Multi-Tenant Isolation**: Manage multiple completely independent brands/domains from a single control center.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin`, `editor`, and `designer`.
- **Live Viewport Simulator**: Instant side-by-side preview with Desktop (1440px), Tablet (768px), and Mobile (375px) responsive testing.
- **Granular Theme Engine**: Global theme palettes, theme modes (Light/Dark), container widths (1440px Wide, 1280px Standard, Full Width, 1024px Compact), screen padding, plus independent per-section color customization.
- **Multi-Level Navigation**: Hierarchical navigation menus with nested submenus and dropdown menus.
- **Specialized Modules**: Dedicated builders for Official Notices, Academic Programs, Services, and Key Statistics.

---

## 🚀 2. Quick Start & Local Setup

### Prerequisites
- Node.js version 18.17+ or 20+
- npm or yarn

### Running the App
1. Open your terminal in the project directory:
   ```bash
   cd my-custom-cms
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   👉 **`http://localhost:3000`**

### Production Build & Test
To verify the production bundle:
```bash
npm run build
npm run start
```

---

## 👥 3. User Roles & Demo Credentials

TenantFlow comes pre-configured with 3 test accounts with varying permission levels. On the login screen (`/`), you can also click any of the **Quick Demo Credentials** cards to auto-fill the login form:

| Role | Email | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@tenantflow.io` | `admin123` | **Full access**: All tenants, create new tenants, change themes, edit pages, upload media, publish, and delete items. |
| **✍️ Editor** | `editor@tenantflow.io` | `editor123` | **Content access**: Assigned to *Northwind Studio*. Can create/edit pages, manage sections, upload media, and publish. Cannot alter core brand themes. |
| **🎨 Designer**| `designer@tenantflow.io` | `designer123`| **Visual styling access**: Assigned to *Luma Health*. Can edit theme palettes, mode, container widths, header/footer layouts, and per-section styles. |

---

## 🧪 4. Step-by-Step Feature Testing Guide

---

### Test 1: Authentication & Role Access
**Objective**: Verify that users can sign in, see their assigned tenants, and log out.

1. Navigate to `http://localhost:3000`.
2. Click **👑 Admin** (`admin@tenantflow.io` / `admin123`) and click **Enter Workspace**.
3. **Verify**:
   - The dashboard opens into the control room.
   - The top header shows user name `Alicia Martin` with a `👑 admin` badge.
   - Both **Northwind Studio** and **Luma Health** are visible in the tenant selector.
4. Click **Sign Out** in the top right.
5. Log in as **✍️ Editor** (`editor@tenantflow.io`).
   - **Verify**: Only **Northwind Studio** is available; Theme editing is restricted or scoped.
6. Sign out and log in as **Admin** again for full testing.

---

### Test 2: Tenant Switching & Creation
**Objective**: Verify multi-tenant switching and creating new brands.

1. In the top navigation bar, click the **Tenant Selector** dropdown (showing "Northwind Studio").
2. Select **Luma Health**.
   - **Verify**: The theme, pages, notices, and live simulator instantly update to Luma Health's brand identity.
3. Switch back to **Northwind Studio**.
4. Click the **"+ New Brand"** button in the header.
5. In the modal:
   - Enter Brand Name: `Apex Fitness`
   - Enter Domain: `apexfitness.com`
   - Enter Logo Text: `APEX`
   - Choose a Theme Preset (e.g. *Emerald Glow* or *Cyber Sunset*).
   - Click **Create Brand**.
6. **Verify**: The new tenant `Apex Fitness` is immediately active in the sidebar and live preview.

---

### Test 3: Theme & Branding Engine
**Objective**: Test global color palettes, theme modes, layout styles, container width, and margins.

1. In the sidebar, select the **🎨 Theme & Branding** tab.
2. **Palette Engine**:
   - Click on different palette presets (e.g., *Rose Garden*, *Electric Indigo*, *Neon Sunset*, *Forest Emerald*).
   - **Verify**: The primary, accent, and secondary colors update in real time in the right-hand **Live Preview Simulator**.
3. **Custom Hex Inputs**:
   - Type `#f472b6` into **Primary Brand Color** and `#fb7185` into **Accent / Highlight**.
4. **Theme Mode**:
   - Switch between **☀️ Light Mode** and **🌙 Dark Mode**.
   - **Verify**: Background flips between crisp light and sleek obsidian dark in the simulator.
5. **Page Container Max-Width**:
   - Select **1440px (Wide Standard)**, **1280px (Standard)**, **100% Fluid (Full Width)**, and **1024px (Compact)**.
   - **Verify**: The simulator adapts its content container width.
6. **Side Margins & Screen Padding**:
   - Switch between **Spacious (px-16)**, **Standard (px-8)**, and **Compact (px-4)**.
7. Click **"Save Changes"** at the top right.
   - **Verify**: Toast notification confirms "Workspace saved successfully!".

---

### Test 4: Page Management & Block Builder
**Objective**: Verify creating pages, editing metadata, adding sections, and reordering.

1. In the sidebar, click the **📄 Pages & Content** tab.
2. **Select Page**:
   - Click **Home** from the page list.
3. **Edit Page Metadata**:
   - Change **Hero Title** to: `Build World-Class Websites in Minutes`
   - Change **Hero Subtitle** to: `The ultimate visual studio for multi-tenant teams.`
   - Change **CTA Button Text** to: `Start Free Trial →`
   - **Verify**: The live preview updates instantly with your new text.
4. **Add a New Content Section**:
   - Scroll to **Page Content Sections** and click **"+ Add Section"**.
   - Select section type: **Features**, **Testimonials**, **Text**, or **CTA**.
   - Enter Section Title: `Enterprise Grade Security`
   - Enter Section Description: `Protected with bank-grade encryption and tenant isolation.`
5. **Reorder Sections**:
   - Click the **▲ Move Up** or **▼ Move Down** buttons on section cards.
   - **Verify**: Section ordering shifts instantly in the preview simulator.
6. **Delete Section**:
   - Click the **🗑️ Delete** button on any section.

---

### Test 5: Per-Section Theme Overrides
**Objective**: Test custom colors and background styling for individual sections.

1. While editing a page or special block, find the **"Section Theme & Background"** panel.
2. Click on a Theme Preset:
   - *Midnight Deep* (Dark gradient)
   - *Sunset Glow* (Rose-amber gradient)
   - *Emerald Depth* (Mint-green dark gradient)
   - *Royal Indigo* (Deep purple-indigo)
3. Or manually choose:
   - **Background**: Pick a solid color or gradient.
   - **Text Color**: Light or dark contrast.
   - **Card Background & Border**: Custom tint.
4. **Verify**: Only that specific section applies the custom styling while maintaining harmony with the rest of the page.

---

### Test 6: Header & Submenu Navigation
**Objective**: Test top bar announcement, header styling, and multi-level dropdown menus.

1. Click the **🧭 Header & Navigation** tab.
2. **Top Bar Banner**:
   - Toggle **"Enable Top Announcement Bar"** ON.
   - Enter Top Bar Text: `⚡ Summer Special Offer — 50% Off All Plans!`
   - Enter Contact Email and Phone Number.
   - **Verify**: The top bar appears above the header in the preview.
3. **Header Theme**:
   - Choose a preset or custom background (e.g. Glassmorphic frosted blur).
4. **Navigation Menu & Submenus**:
   - Click **"+ Add Top Level Menu Item"**.
   - Set Label: `Solutions`.
   - Click **"+ Add Submenu"** under `Solutions`.
   - Add Child Item 1: `Enterprise CMS` (Link to page or custom URL).
   - Add Child Item 2: `Cloud Hosting`.
5. **Verify in Live Preview**:
   - Hover over or click `Solutions` in the simulator.
   - A dropdown menu opens showing `Enterprise CMS` and `Cloud Hosting`.

---

### Test 7: Footer, Socials & Newsletter
**Objective**: Test footer branding, multi-column navigation links, social icons, and newsletter toggle.

1. Click the **🦶 Footer & Socials** tab.
2. **Company Bio & Copyright**:
   - Enter Company Name: `Northwind Studio Inc.`
   - Enter About Text: `Leading digital agency crafting high-impact experiences.`
3. **Footer Columns**:
   - Under Column 1 (Quick Links), add a link: Label: `Documentation`, URL: `/docs`.
   - Add a new column: Title: `Company`, with links `Careers`, `Press`, `Contact`.
4. **Social Links**:
   - Add social links for **Twitter / X**, **LinkedIn**, **GitHub**, **Instagram**, **YouTube**.
   - **Verify**: Corresponding social platform icons render in the footer preview.
5. **Newsletter Block**:
   - Toggle **"Show Newsletter Subscription"** ON.
   - Set Headline: `Subscribe for weekly product updates & changelogs`.
   - **Verify**: An interactive newsletter email input box appears in the footer.

---

### Test 8: Special Content Blocks
**Objective**: Test Official Notices, Academic Programs, Services, and Statistics.

1. Click the **⚡ Special Content Blocks** tab.
2. **📌 Official Notices & Announcements**:
   - Click **"+ Add Notice"**.
   - Title: `Q3 Platform Release Scheduled for Friday`.
   - Date: `2026-08-25`.
   - Status: Choose `New`, `Updated`, or `Regular`.
   - Toggle `Pinned Notice` ON.
   - **Verify**: Pinned notices show a glowing badge and appear at the top of the ticker.
3. **🎓 Academic Programs / Courses**:
   - Click **"+ Add Program"**.
   - Name: `Full-Stack AI Engineering`.
   - Duration: `6 Months`.
   - Eligibility: `Basic JavaScript Knowledge`.
   - Icon: Choose or type an emoji (e.g. `🤖`).
4. **🛠️ Services & Offerings**:
   - Add or edit services with custom icons (e.g. `⚡`, `🛡️`, `💼`).
5. **📊 Key Statistics & Metrics**:
   - Edit Counter: Value: `10,000+`, Label: `Active Developers`.
   - **Verify**: All special modules display beautifully in the live preview.

---

### Test 9: Media Library & File Uploads
**Objective**: Test uploading images from local disk and applying them to pages and logos.

1. Click the **🖼️ Media Library** tab.
2. Click **"Upload Media"** or drop an image file (JPG, PNG, WebP, SVG).
   - **Verify**: The image uploads through `/api/upload` and appears in the gallery with size and preview.
3. Click **"Copy URL"** on any uploaded image.
4. Go to **Pages & Content** -> **Home** -> Click **Change Hero Image**.
5. Select the uploaded image from your Media Library or paste the URL.
   - **Verify**: The hero image immediately updates in the simulator.

---

### Test 10: Rich HTML Code Editor Mode
**Objective**: Test the direct HTML/CSS builder for bespoke custom pages.

1. Go to **Pages & Content**.
2. Toggle **"Use Custom HTML for this page"** to ON.
3. Notice the **Monaco-style Code Editor** appears with syntax highlighting.
4. Click on one of the **Prebuilt HTML Templates**:
   - *Modern Landing*
   - *College / University Portal*
   - *Product Showcase*
5. Edit any HTML text directly inside the editor (e.g., change `<h1>`).
6. **Verify**: The simulator renders your custom HTML and CSS with full fidelity.

---

### Test 11: Live Device Simulator
**Objective**: Test responsive multi-device viewport rendering.

1. Look at the top bar of the **Live Preview Pane** on the right side.
2. Click the **💻 Desktop** button (full standard width).
   - **Verify**: Layout displays multi-column grids, horizontal navigation bar, and desktop hero section.
3. Click the **📱 Tablet (768px)** button.
   - **Verify**: Layout dynamically adjusts to 768px width with condensed columns.
4. Click the **📲 Mobile (375px)** button.
   - **Verify**:
     - Layout shrinks to iPhone viewport width (375px).
     - Navigation collapses into a mobile **☰ Hamburger menu**.
     - Clicking the hamburger button smoothly expands the full mobile navigation drawer.

---

### Test 12: Publishing & Public Tenant View
**Objective**: Test publishing changes and verifying live public production routes.

1. Click the **"Publish Live"** button in the top action bar.
   - **Verify**: Status indicator changes to **🟢 Live (Active)**.
2. Click **"🔗 View Public Site"** (or open `http://localhost:3000/tenant/tenant-1` in a new tab).
3. **Verify the Public Web Page**:
   - The live site loads at `/tenant/tenant-1`.
   - Your configured theme colors, primary buttons, gradients, fonts, and dark/light modes match perfectly.
   - Header, Announcement bar, Hero section, Modules, and Footer render seamlessly.
4. Test a sub-page route:
   - Navigate to `http://localhost:3000/tenant/tenant-1/about` (or any configured slug).
   - **Verify**: The sub-page loads correctly with proper SEO title and metadata.

---

### Test 13: Interactive Public Features
**Objective**: Verify inquiry modal submissions and newsletter signups on the public site.

1. On the public site (`/tenant/tenant-1`):
2. **Hero CTA Button**:
   - Click the primary button (e.g. `Launch your website` or `Book a call`).
   - **Verify**: The **Inquiry Modal** pops up smoothly with frosted glass backdrop.
   - Enter Name: `Alex Johnson`, Email: `alex@example.com`, Message: `Interested in enterprise plan.`
   - Click **Send Inquiry**.
   - **Verify**: Instant success checkmark animation displays: *"Message sent successfully!"*.
3. **Newsletter Form in Footer**:
   - Scroll to the footer newsletter section.
   - Enter your email address and click **Subscribe**.
   - **Verify**: Toast/Inline feedback confirms subscription: *"Thank you for subscribing!"*.
4. **Notices Interaction**:
   - Click on any notice row or link.

---

## 📊 5. End-to-End Testing Checklist Matrix

Use this checklist to run a full QA / sanity pass on the application:

| Feature / Area | Test Action | Expected Result | Pass/Fail |
| :--- | :--- | :--- | :---: |
| **Authentication** | Sign in as Admin, Editor, Designer | Dashboard opens with role-scoped tenants and tools | `[ ]` |
| **RBAC Security** | Editor tries to switch to unauthorized tenant | Scoped to permitted tenant only | `[ ]` |
| **Tenant Creation** | Create brand "Apex Studio" | Appears in selector, editable immediately | `[ ]` |
| **Theme Engine** | Switch Palette to "Rose Garden", Mode to "Dark" | Simulator updates colors and dark background | `[ ]` |
| **Container Width** | Change from "1440px" to "1024px" | Preview container contracts smoothly | `[ ]` |
| **Page Editor** | Edit Hero Title & Subtitle | Text updates instantly in preview | `[ ]` |
| **Section Manager** | Add Features section, move up, delete | Grid updates in preview in real-time | `[ ]` |
| **Section Themes** | Apply "Sunset Glow" preset to Hero | Hero section gets custom sunset gradient | `[ ]` |
| **Navigation Menus** | Add top item + 2 nested submenus | Dropdown appears on hover in preview & public site | `[ ]` |
| **Header & Top Bar** | Toggle announcement bar, set text | Banner appears above header | `[ ]` |
| **Footer & Socials** | Add LinkedIn, Twitter, and custom columns | Footer displays columns and social icons | `[ ]` |
| **Special Blocks** | Add Pinned Notice & Academic Program | Notice ticker and program cards render | `[ ]` |
| **Media Library** | Upload PNG/JPG, select for Hero | Image uploads and applies to page hero | `[ ]` |
| **Rich HTML Mode** | Enable Custom HTML, load "College Portal" | Full bespoke HTML/CSS renders in viewport | `[ ]` |
| **Responsive Sim** | Switch Desktop -> Tablet -> Mobile | Mobile hamburger menu toggles navigation drawer | `[ ]` |
| **Publishing** | Click "Publish Live" | Data persists; `/tenant/[id]` is publicly accessible | `[ ]` |
| **Interactive CTA** | Click Hero button on public site | Inquiry modal opens and submits successfully | `[ ]` |
| **Newsletter** | Submit email in public footer | Subscription feedback triggers successfully | `[ ]` |

---

## ❓ 6. Troubleshooting & FAQs

### Q1: Why didn't my theme changes show up on production?
- **Answer**: Ensure you click **"Save Changes"** or **"Publish Live"** in the top action bar so updates are saved to the persistent store. In serverless environments (like Vercel), data automatically hydrates from `data/cms.json` and memory cache.

### Q2: How do I add a new user account?
- **Answer**: Log in with the **👑 Admin** account (`admin@tenantflow.io`). Admins have access to the user management API payload and can grant access to specific tenant IDs in `lib/cms-store.ts` or via the API.

### Q3: Where are uploaded media files stored?
- **Answer**: Uploaded images are stored in `/public/uploads/` and served statically by Next.js at `/uploads/<filename>`.

### Q4: How do custom submenus work without dedicated CMS pages?
- **Answer**: If a submenu item is linked to a custom URL or direct rich HTML content, the dynamic slug resolver at `/tenant/[tenantId]/[slug]` automatically synthesizes a dedicated page on the fly with hero banners, breadcrumbs, and custom content.

---

*TenantFlow CMS — Built with Next.js 16, React 19, and Tailwind CSS.*
