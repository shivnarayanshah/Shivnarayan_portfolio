import "server-only";

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import type { SessionPayload } from "@/lib/auth/token";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  await connectDB();

  const user = await User.findOne({ email: email.trim().toLowerCase() })
    .select("+passwordHash")
    .lean();

  if (!user || user.role !== "admin") {
    // Run a comparison anyway to keep timing closer to a real check.
    await bcrypt.compare(
      password,
      "$2b$12$3mHu5RzbrHiZNf.7BvZAKu0g9YAB3QwUaxDMCLCw/atTyP90V4nJu",
    );
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: "admin",
  };
}

export async function verifyAdminSessionUser(
  session: SessionPayload,
): Promise<AdminUser | null> {
  await connectDB();
  const user = await User.findById(session.sub).lean();
  if (!user || user.role !== "admin") return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: "admin",
  };
}
