import { verifyToken } from "@clerk/backend";

import type { AuthenticatedRequestContext } from "./identity.js";

type ClerkJwtPayload = {
  email?: unknown;
  name?: unknown;
  sub?: unknown;
};

export async function getClerkAuthContextFromAuthorization(
  authorization: string | string[] | undefined,
  secretKey: string | undefined
): Promise<AuthenticatedRequestContext | null> {
  const token = getBearerToken(authorization);

  if (!token || !secretKey) {
    return null;
  }

  const payload = await verifyClerkToken(token, secretKey);

  if (!payload) {
    return null;
  }

  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    return null;
  }

  return {
    displayName: typeof payload.name === "string" ? payload.name : null,
    email: typeof payload.email === "string" ? payload.email : null,
    provider: "clerk",
    providerSubject: payload.sub
  };
}

async function verifyClerkToken(token: string, secretKey: string): Promise<ClerkJwtPayload | null> {
  try {
    return await verifyToken(token, { secretKey });
  } catch {
    return null;
  }
}

function getBearerToken(authorization: string | string[] | undefined): string | null {
  const header = Array.isArray(authorization) ? authorization[0] : authorization;

  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}
