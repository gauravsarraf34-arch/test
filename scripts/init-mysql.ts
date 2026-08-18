import { initDatabase, fetchCmsDataFromDb, saveCmsDataToDb, getPool } from "../lib/db";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { CmsData } from "../lib/cms-store";

async function main() {
  console.log("🚀 Initializing MySQL database connection for XAMPP...");

  const success = await initDatabase();
  if (!success) {
    console.error("❌ Failed to initialize MySQL database. Please verify XAMPP MySQL is running on port 3306.");
    process.exit(1);
  }

  console.log("✅ Database 'tenantflow_cms' and all 8 tables created successfully!");

  // Load existing data from data/cms.json
  const jsonPath = path.join(process.cwd(), "data", "cms.json");
  if (existsSync(jsonPath)) {
    try {
      const raw = readFileSync(jsonPath, "utf-8");
      const data: CmsData = JSON.parse(raw);
      console.log(`📦 Found data/cms.json with ${data.tenants.length} tenants and ${data.users.length} users.`);

      const saved = await saveCmsDataToDb(data);
      if (saved) {
        console.log("🎉 Successfully migrated data from data/cms.json into MySQL database!");
      } else {
        console.error("⚠️ Failed to write initial data to MySQL.");
      }
    } catch (e) {
      console.error("Error reading data/cms.json:", e);
    }
  }

  // Verify fetch
  const fetched = await fetchCmsDataFromDb();
  if (fetched) {
    console.log(`🔍 Verification fetch from MySQL successful!`);
    console.log(`   - Tenants in DB: ${fetched.tenants.map((t) => t.name).join(", ")}`);
    console.log(`   - Users in DB: ${fetched.users.map((u) => u.email).join(", ")}`);
  }

  const pool = getPool();
  await pool.end();
  console.log("🏁 MySQL initialization and verification complete!");
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
