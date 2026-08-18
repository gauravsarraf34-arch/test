# 🏢 TenantFlow CMS

A multi-tenant visual website builder and content management system with real-time responsive simulation, dynamic theme customization, role-based access control, and multi-brand isolation.

---

## 📖 Complete Documentation & Manual

👉 **For the full end-to-end testing guide, step-by-step feature instructions, and QA checklist, see [USER_MANUAL.md](USER_MANUAL.md).**

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database (XAMPP MySQL)
- Ensure **MySQL** is started in your **XAMPP Control Panel** (port 3306).
- The `tenantflow_cms` database and tables are created automatically.
- (Optional) Run the database initializer:
```bash
npx tsx scripts/init-mysql.ts
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Demo Credentials
- **👑 Admin**: `admin@tenantflow.io` / `admin123` (Full access to all brands and settings)
- **✍️ Editor**: `editor@tenantflow.io` / `editor123` (Content editing for Northwind Studio)
- **🎨 Designer**: `designer@tenantflow.io` / `designer123` (Theme and styling for Luma Health)

---

## 🚀 Key Features

- **Multi-Tenant Architecture**: Switch between multiple brands with complete visual and data isolation.
- **Theme Engine**: Color palettes, light/dark modes, container widths (1440px wide, 1280px standard, full width, 1024px compact), and margins.
- **Per-Section Styling**: Independent background gradients, card colors, text colors, and borders for individual blocks.
- **Live Viewport Simulator**: Test desktop, tablet (768px), and mobile (375px) layouts interactively.
- **Multi-Level Navigation**: Hierarchical menus with submenus and dropdowns.
- **Specialized Blocks**: Official notices ticker, academic programs, services, and statistics.
- **Media Library**: Upload and manage assets with instant preview and integration.
- **Rich HTML Editor**: Switch to Monaco-style direct HTML/CSS code editing with prebuilt templates.
- **Dynamic Publishing**: Instant live preview and public tenant URLs at `/tenant/[tenantId]`.

---

## 📦 Production Build

```bash
npm run build
npm run start
```
