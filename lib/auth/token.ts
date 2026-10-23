import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "sn_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const ISSUER = "shivnarayan-portfolio";
const AUDIENCE = "admin";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: "admin";
}

function getEncodedSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return new TextEncoder().encode(
        "dev-only-insecure-secret-set-AUTH_SECRET-before-deploying",
      );
    }
    throw new Error("AUTH_SECRET is required in production.");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getEncodedSecret());
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getEncodedSecret(), {
      algorithms: ["HS256"],
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      payload.role !== "admin"
    ) {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      role: "admin",
    };
  } catch {
    return null;
  }
}
