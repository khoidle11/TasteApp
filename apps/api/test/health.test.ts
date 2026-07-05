import { describe, expect, it } from "vitest";

import { routeRequest } from "../src/http.js";
import { InMemoryTasteAppUserRepository, type TasteAppUserRepository } from "../src/identity.js";

describe("API health routes", () => {
  it("returns the liveness response for GET /health", async () => {
    await expect(routeRequest("GET", "/health")).resolves.toEqual({
      body: {
        service: "tasteapp",
        status: "ok"
      },
      statusCode: 200
    });
  });

  it("returns the readiness response for GET /health/ready", async () => {
    await expect(routeRequest("GET", "/health/ready")).resolves.toEqual({
      body: {
        checks: [],
        ready: true,
        service: "tasteapp"
      },
      statusCode: 200
    });
  });

  it("returns a not found response for unknown routes", async () => {
    await expect(routeRequest("GET", "/missing")).resolves.toEqual({
      body: {
        error: "Not found"
      },
      statusCode: 404
    });
  });
});

describe("API account routes", () => {
  it("requires authentication for the current TasteApp User route", async () => {
    await expect(routeRequest("GET", "/account/me")).resolves.toEqual({
      body: {
        error: "Authentication required"
      },
      statusCode: 401
    });
  });

  it("returns the current TasteApp User for an authenticated Clerk identity", async () => {
    await expect(
      routeRequest("GET", "/account/me", {
        accountRepository: new InMemoryTasteAppUserRepository(),
        authContext: {
          displayName: "Khoi Le",
          email: "khoi@example.com",
          provider: "clerk",
          providerSubject: "user_123"
        }
      })
    ).resolves.toEqual({
      body: {
        user: {
          displayName: "Khoi Le",
          id: "00000000-0000-4000-8000-000000000001",
          primaryEmail: "khoi@example.com"
        }
      },
      statusCode: 200
    });
  });

  it("reuses the same local TasteApp User and refreshes profile fields", async () => {
    const accountRepository = new InMemoryTasteAppUserRepository();
    const authContext = {
      displayName: "Khoi Le",
      email: "khoi@example.com",
      provider: "clerk" as const,
      providerSubject: "user_123"
    };

    const firstResponse = await routeRequest("GET", "/account/me", {
      accountRepository,
      authContext
    });
    const secondResponse = await routeRequest("GET", "/account/me", {
      accountRepository,
      authContext: {
        ...authContext,
        displayName: "Khoi Updated",
        email: "updated@example.com"
      }
    });

    expect(secondResponse).toEqual({
      body: {
        user: {
          displayName: "Khoi Updated",
          id: "00000000-0000-4000-8000-000000000001",
          primaryEmail: "updated@example.com"
        }
      },
      statusCode: 200
    });
    expect(firstResponse).toMatchObject({
      body: {
        user: {
          id: "00000000-0000-4000-8000-000000000001"
        }
      }
    });
  });

  it("preserves known profile fields when the Clerk token omits them", async () => {
    const accountRepository = new InMemoryTasteAppUserRepository();
    const authContext = {
      displayName: "Khoi Le",
      email: "khoi@example.com",
      provider: "clerk" as const,
      providerSubject: "user_123"
    };

    await routeRequest("GET", "/account/me", {
      accountRepository,
      authContext
    });

    await expect(
      routeRequest("GET", "/account/me", {
        accountRepository,
        authContext: {
          displayName: null,
          email: null,
          provider: "clerk",
          providerSubject: "user_123"
        }
      })
    ).resolves.toEqual({
      body: {
        user: {
          displayName: "Khoi Le",
          id: "00000000-0000-4000-8000-000000000001",
          primaryEmail: "khoi@example.com"
        }
      },
      statusCode: 200
    });
  });

  it("returns an internal server error when account resolution fails", async () => {
    const failingRepository: TasteAppUserRepository = {
      findOrCreateByExternalIdentity: () => Promise.reject(new Error("database unavailable"))
    };

    await expect(
      routeRequest("GET", "/account/me", {
        accountRepository: failingRepository,
        authContext: {
          displayName: "Khoi Le",
          email: "khoi@example.com",
          provider: "clerk",
          providerSubject: "user_123"
        }
      })
    ).resolves.toEqual({
      body: {
        error: "Internal server error"
      },
      statusCode: 500
    });
  });
});
