import "dotenv/config";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { FALLBACK_PROJECTS, FALLBACK_SITE_CONFIG } from "../lib/data/fallback";
import { Project } from "../models/Project";
import { SiteConfig } from "../models/SiteConfig";
import { User } from "../models/User";

const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
const reset = process.argv.includes("--reset");

async function main() {
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Copy .env.example to .env.local and add your MongoDB connection string.",
    );
  }

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB,
    serverSelectionTimeoutMS: 10_000,
  });
  console.log("Connected.");

  // Ensure unique indexes exist even when production runs with autoIndex off.
  await Promise.all([
    Project.init(),
    User.init(),
    SiteConfig.init(),
  ]);

  // 1. Admin account ---------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || "ShivNarayan Sah";

  if (adminEmail && adminPassword) {
    if (adminPassword.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
    }
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: adminName,
          email: adminEmail,
          passwordHash,
          role: "admin",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`✓ Admin user ready: ${adminEmail}`);
  } else {
    console.warn(
      "! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipped admin user creation.",
    );
  }

  // 2. Site config -----------------------------------------------------------
  const { updatedAt: _configUpdatedAt, ...siteConfig } = FALLBACK_SITE_CONFIG;
  await SiteConfig.findOneAndUpdate(
    { key: "main" },
    { $set: { ...siteConfig, key: "main" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log("✓ Site configuration ready.");

  // 3. Projects --------------------------------------------------------------
  if (reset) {
    const deleted = await Project.deleteMany({});
    console.log(`✓ Removed ${deleted.deletedCount} existing projects.`);
  }

  for (const fallback of FALLBACK_PROJECTS) {
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...project
    } = fallback;

    await Project.findOneAndUpdate(
      { slug: project.slug },
      { $set: project },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`  · ${project.title}`);
  }
  console.log(`✓ ${FALLBACK_PROJECTS.length} projects seeded.`);

  if (reset) {
    console.log("\nSeed complete. Existing projects were replaced.");
  } else {
    console.log(
      "\nSeed complete. Projects were upserted by slug (existing content preserved).",
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error(
      "\nSeed failed:",
      error instanceof Error ? error.message : error,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
