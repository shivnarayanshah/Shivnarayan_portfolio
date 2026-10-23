import { config as loadEnv } from "dotenv";

// Match Next.js' environment precedence: .env.local overrides .env.
// Real deployment variables already present in process.env are never replaced.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { FALLBACK_PROJECTS, FALLBACK_SITE_CONFIG } from "../lib/data/fallback";
import { Project } from "../models/Project";
import { SiteConfig } from "../models/SiteConfig";
import { User } from "../models/User";

const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
const reset = process.argv.includes("--reset");
const adminOnly = process.argv.includes("--admin-only");
const bootstrap = process.argv.includes("--bootstrap");
const strict = /^(1|true)$/i.test(process.env.SEED_STRICT ?? "");

function readAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
  const password = process.env.ADMIN_PASSWORD || "";

  if (Boolean(email) !== Boolean(password)) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set together.");
  }

  return { email, password };
}

async function seedAdminUser() {
  const { email, password } = readAdminCredentials();
  const name = process.env.ADMIN_NAME?.trim() || "ShivNarayan Sah";

  if (!email || !password) {
    console.warn(
      "! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipped admin user creation.",
    );
    return;
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        email,
        passwordHash,
        role: "admin",
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );
  console.log(`✓ Admin user ready: ${email}`);
}

async function seedSiteConfig({ onlyIfMissing = false } = {}) {
  if (onlyIfMissing) {
    const existing = await SiteConfig.exists({ key: "main" });
    if (existing) {
      console.log("• Site configuration already exists — left unchanged.");
      return;
    }
  }

  const { updatedAt: _configUpdatedAt, ...siteConfig } = FALLBACK_SITE_CONFIG;
  await SiteConfig.findOneAndUpdate(
    { key: "main" },
    { $set: { ...siteConfig, key: "main" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(
    onlyIfMissing
      ? "✓ Site configuration seeded."
      : "✓ Site configuration ready.",
  );
}

async function seedProjects({
  resetProjects = false,
  onlyIfEmpty = false,
} = {}) {
  if (resetProjects) {
    const deleted = await Project.deleteMany({});
    console.log(`✓ Removed ${deleted.deletedCount} existing projects.`);
  }

  if (onlyIfEmpty) {
    const existing = await Project.countDocuments({});
    if (existing > 0) {
      console.log(
        `• ${existing} project(s) already exist — left unchanged.`,
      );
      return;
    }
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
}

async function main() {
  if (adminOnly && bootstrap) {
    throw new Error("Choose either --admin-only or --bootstrap, not both.");
  }

  const admin = readAdminCredentials();

  // `seed:admin` has nothing to do without credentials. Skip before opening a
  // connection so a manual or preview run cannot fail on a missing database.
  if (adminOnly && !admin.email) {
    console.warn(
      "! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed.",
    );
    return;
  }

  if (!uri) {
    if (bootstrap && !strict) {
      console.warn("! MONGO_URI not set — skipping build-time initial seed.");
      return;
    }
    throw new Error(
      "MONGO_URI is not set. Copy .env.example to .env.local and add your MongoDB connection string.",
    );
  }

  console.log("Connecting to MongoDB…");
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB,
      serverSelectionTimeoutMS: 10_000,
    });
  } catch (error) {
    // A transient database failure should not block a deployment when the
    // public site can run from bundled content. Set SEED_STRICT=true to turn
    // connection failures into build failures instead.
    if (bootstrap && !strict) {
      console.warn(
        `! MongoDB unavailable during build — skipping initial seed: ${
          error instanceof Error ? error.message : "unknown error"
        }`,
      );
      console.warn(
        "  Public pages will use the bundled fallback content. Set SEED_STRICT=true to fail the build instead.",
      );
      return;
    }
    throw error;
  }
  console.log("Connected.");

  if (adminOnly) {
    // Only the user index is needed for the admin-only seed.
    await User.init();
    await seedAdminUser();
    console.log("\nAdmin seed complete.");
    return;
  }

  // Ensure unique indexes exist even when production runs with autoIndex off.
  await Promise.all([Project.init(), User.init(), SiteConfig.init()]);

  await seedAdminUser();

  if (bootstrap) {
    // First-run seed: add defaults without overwriting content an admin may
    // have edited later. This also makes projects available to the static
    // build that runs immediately after this script.
    await seedSiteConfig({ onlyIfMissing: true });
    await seedProjects({ onlyIfEmpty: true });
    console.log("\nInitial seed check complete.");
    return;
  }

  await seedSiteConfig();
  await seedProjects({ resetProjects: reset });

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
