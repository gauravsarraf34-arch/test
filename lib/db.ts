import mysql, { Pool, RowDataPacket } from "mysql2/promise";
import { CmsData, CmsTenant, CmsPage, CmsUser, CmsMediaItem, CmsNotice, CmsProgram, CmsService, CmsStatistic } from "./cms-store";

let pool: Pool | null = null;
let isInitialized = false;

function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "tenantflow_cms",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 4000,
  };
}

export function getPool(): Pool {
  if (!pool) {
    const config = getDbConfig();
    pool = mysql.createPool(config);
  }
  return pool;
}

export async function initDatabase(): Promise<boolean> {
  if (isInitialized) return true;

  const config = getDbConfig();

  try {
    // 1. Connect to MySQL server without database first to ensure DB exists
    const serverConn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      connectTimeout: 4000,
    });

    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await serverConn.end();

    // 2. Connect to the database pool and create tables
    const db = getPool();

    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'editor',
        tenant_ids JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tenants table
    await db.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        logo_text VARCHAR(255) NULL,
        logo_image TEXT NULL,
        theme JSON NULL,
        header_config JSON NULL,
        footer_config JSON NULL,
        modules_theme JSON NULL,
        navigation JSON NULL,
        seo_title VARCHAR(255) NULL,
        seo_description TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Pages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        hero_title TEXT NULL,
        hero_subtitle TEXT NULL,
        button_text VARCHAR(255) NULL,
        hero_image TEXT NULL,
        published BOOLEAN NOT NULL DEFAULT FALSE,
        sections JSON NULL,
        custom_html LONGTEXT NULL,
        use_custom_html BOOLEAN NOT NULL DEFAULT FALSE,
        hero_theme JSON NULL,
        container_width VARCHAR(50) NULL,
        page_padding VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tenant_id (tenant_id),
        INDEX idx_slug (slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Media table
    await db.query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'image',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_media_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Notices table
    await db.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Regular',
        link TEXT NULL,
        is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_notices_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Programs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        duration VARCHAR(100) NULL,
        eligibility VARCHAR(255) NULL,
        icon VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_programs_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Services table
    await db.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NULL,
        icon VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_services_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Statistics table
    await db.query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id VARCHAR(100) PRIMARY KEY,
        tenant_id VARCHAR(100) NOT NULL,
        label VARCHAR(255) NOT NULL,
        value VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_stats_tenant (tenant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    isInitialized = true;
    return true;
  } catch (error) {
    console.warn("MySQL initialization note (using fallback if unavailable):", error);
    return false;
  }
}

function parseJsonField<T>(field: unknown, fallback: T): T {
  if (!field) return fallback;
  if (typeof field === "object") return field as T;
  try {
    return JSON.parse(field as string) as T;
  } catch {
    return fallback;
  }
}

export async function fetchCmsDataFromDb(): Promise<CmsData | null> {
  const ready = await initDatabase();
  if (!ready) return null;

  try {
    const db = getPool();

    // 1. Fetch Users
    const [userRows] = await db.query<RowDataPacket[]>("SELECT * FROM users");
    const users: CmsUser[] = userRows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      role: row.role,
      tenantIds: parseJsonField<string[]>(row.tenant_ids, []),
    }));

    // 2. Fetch Tenants
    const [tenantRows] = await db.query<RowDataPacket[]>("SELECT * FROM tenants");
    if (tenantRows.length === 0) {
      return null; // DB is initialized but empty, needs initial seeding
    }

    // 3. Fetch all related tables
    const [pageRows] = await db.query<RowDataPacket[]>("SELECT * FROM pages");
    const [mediaRows] = await db.query<RowDataPacket[]>("SELECT * FROM media");
    const [noticeRows] = await db.query<RowDataPacket[]>("SELECT * FROM notices");
    const [programRows] = await db.query<RowDataPacket[]>("SELECT * FROM programs");
    const [serviceRows] = await db.query<RowDataPacket[]>("SELECT * FROM services");
    const [statRows] = await db.query<RowDataPacket[]>("SELECT * FROM statistics");

    const tenants: CmsTenant[] = tenantRows.map((tRow) => {
      const tenantId = tRow.id;

      const pages: CmsPage[] = pageRows
        .filter((p) => p.tenant_id === tenantId)
        .map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description || "",
          heroTitle: p.hero_title || "",
          heroSubtitle: p.hero_subtitle || "",
          buttonText: p.button_text || "",
          heroImage: p.hero_image || "",
          published: Boolean(p.published),
          sections: parseJsonField(p.sections, []),
          customHtml: p.custom_html || "",
          useCustomHtml: Boolean(p.use_custom_html),
          heroTheme: parseJsonField(p.hero_theme, undefined),
          containerWidth: p.container_width,
          pagePadding: p.page_padding,
        }));

      const media: CmsMediaItem[] = mediaRows
        .filter((m) => m.tenant_id === tenantId)
        .map((m) => ({
          id: m.id,
          name: m.name,
          url: m.url,
          type: m.type || "image",
        }));

      const notices: CmsNotice[] = noticeRows
        .filter((n) => n.tenant_id === tenantId)
        .map((n) => ({
          id: n.id,
          title: n.title,
          date: n.date,
          status: n.status,
          link: n.link || "",
          isPinned: Boolean(n.is_pinned),
        }));

      const programs: CmsProgram[] = programRows
        .filter((pr) => pr.tenant_id === tenantId)
        .map((pr) => ({
          id: pr.id,
          name: pr.name,
          description: pr.description || "",
          duration: pr.duration || "",
          eligibility: pr.eligibility || "",
          icon: pr.icon || undefined,
        }));

      const services: CmsService[] = serviceRows
        .filter((s) => s.tenant_id === tenantId)
        .map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description || "",
          icon: s.icon || "",
        }));

      const statistics: CmsStatistic[] = statRows
        .filter((st) => st.tenant_id === tenantId)
        .map((st) => ({
          id: st.id,
          label: st.label,
          value: st.value,
          icon: st.icon || undefined,
        }));

      return {
        id: tenantId,
        name: tRow.name,
        domain: tRow.domain,
        status: tRow.status,
        logoText: tRow.logo_text || tRow.name,
        logoImage: tRow.logo_image || undefined,
        nav: (parseJsonField(tRow.navigation, []) as Array<{ label: string }>).map((n) => n.label),
        navigation: parseJsonField(tRow.navigation, []),
        headerConfig: parseJsonField(tRow.header_config, undefined),
        footerConfig: parseJsonField(tRow.footer_config, undefined),
        modulesTheme: parseJsonField(tRow.modules_theme, undefined),
        theme: parseJsonField(tRow.theme, {
          primary: "#f472b6",
          secondary: "#1e1b2e",
          accent: "#fb7185",
          mode: "light",
          layout: "modern",
        }),
        pages,
        media,
        notices,
        programs,
        services,
        statistics,
        seoTitle: tRow.seo_title || "",
        seoDescription: tRow.seo_description || "",
      };
    });

    return {
      users,
      tenants,
    };
  } catch (error) {
    console.error("Error fetching CMS data from MySQL:", error);
    return null;
  }
}

export async function saveCmsDataToDb(data: CmsData): Promise<boolean> {
  const ready = await initDatabase();
  if (!ready) return false;

  const db = getPool();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Upsert Users
    for (const user of data.users) {
      await conn.query(
        `INSERT INTO users (id, name, email, password, role, tenant_ids)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           password = VALUES(password),
           role = VALUES(role),
           tenant_ids = VALUES(tenant_ids)`,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.role,
          JSON.stringify(user.tenantIds || []),
        ]
      );
    }

    // 2. Sync Tenants & Sub-Entities
    // Get existing tenant IDs to handle removals if needed
    const tenantIds = data.tenants.map((t) => t.id);

    for (const tenant of data.tenants) {
      await conn.query(
        `INSERT INTO tenants (
          id, name, domain, status, logo_text, logo_image, theme,
          header_config, footer_config, modules_theme, navigation, seo_title, seo_description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          domain = VALUES(domain),
          status = VALUES(status),
          logo_text = VALUES(logo_text),
          logo_image = VALUES(logo_image),
          theme = VALUES(theme),
          header_config = VALUES(header_config),
          footer_config = VALUES(footer_config),
          modules_theme = VALUES(modules_theme),
          navigation = VALUES(navigation),
          seo_title = VALUES(seo_title),
          seo_description = VALUES(seo_description)`,
        [
          tenant.id,
          tenant.name,
          tenant.domain,
          tenant.status || "Active",
          tenant.logoText || tenant.name,
          (tenant as { logoImage?: string }).logoImage || null,
          JSON.stringify(tenant.theme || {}),
          JSON.stringify(tenant.headerConfig || {}),
          JSON.stringify(tenant.footerConfig || {}),
          JSON.stringify(tenant.modulesTheme || {}),
          JSON.stringify(tenant.navigation || []),
          tenant.seoTitle || "",
          tenant.seoDescription || "",
        ]
      );

      // Clean & re-insert tenant-specific child entities for consistency
      await conn.query("DELETE FROM pages WHERE tenant_id = ?", [tenant.id]);
      for (const page of tenant.pages || []) {
        await conn.query(
          `INSERT INTO pages (
            id, tenant_id, slug, title, description, hero_title, hero_subtitle,
            button_text, hero_image, published, sections, custom_html, use_custom_html,
            hero_theme, container_width, page_padding
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            page.id,
            tenant.id,
            page.slug,
            page.title,
            page.description || "",
            page.heroTitle || "",
            page.heroSubtitle || "",
            page.buttonText || "",
            page.heroImage || "",
            page.published ? 1 : 0,
            JSON.stringify(page.sections || []),
            page.customHtml || "",
            page.useCustomHtml ? 1 : 0,
            JSON.stringify(page.heroTheme || {}),
            (page as { containerWidth?: string }).containerWidth || null,
            (page as { pagePadding?: string }).pagePadding || null,
          ]
        );
      }

      await conn.query("DELETE FROM media WHERE tenant_id = ?", [tenant.id]);
      for (const item of tenant.media || []) {
        await conn.query(
          "INSERT INTO media (id, tenant_id, name, url, type) VALUES (?, ?, ?, ?, ?)",
          [item.id, tenant.id, item.name, item.url, item.type || "image"]
        );
      }

      await conn.query("DELETE FROM notices WHERE tenant_id = ?", [tenant.id]);
      for (const notice of tenant.notices || []) {
        await conn.query(
          "INSERT INTO notices (id, tenant_id, title, date, status, link, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            notice.id,
            tenant.id,
            notice.title,
            notice.date,
            notice.status || "Regular",
            notice.link || "",
            notice.isPinned ? 1 : 0,
          ]
        );
      }

      await conn.query("DELETE FROM programs WHERE tenant_id = ?", [tenant.id]);
      for (const program of tenant.programs || []) {
        await conn.query(
          "INSERT INTO programs (id, tenant_id, name, description, duration, eligibility, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            program.id,
            tenant.id,
            program.name,
            program.description || "",
            program.duration || "",
            program.eligibility || "",
            program.icon || null,
          ]
        );
      }

      await conn.query("DELETE FROM services WHERE tenant_id = ?", [tenant.id]);
      for (const service of tenant.services || []) {
        await conn.query(
          "INSERT INTO services (id, tenant_id, name, description, icon) VALUES (?, ?, ?, ?, ?)",
          [service.id, tenant.id, service.name, service.description || "", service.icon || ""]
        );
      }

      await conn.query("DELETE FROM statistics WHERE tenant_id = ?", [tenant.id]);
      for (const stat of tenant.statistics || []) {
        await conn.query(
          "INSERT INTO statistics (id, tenant_id, label, value, icon) VALUES (?, ?, ?, ?, ?)",
          [stat.id, tenant.id, stat.label, stat.value, stat.icon || null]
        );
      }
    }

    await conn.commit();
    return true;
  } catch (error) {
    await conn.rollback();
    console.error("Error saving CMS data to MySQL:", error);
    return false;
  } finally {
    conn.release();
  }
}
