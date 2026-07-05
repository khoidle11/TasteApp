import { describe, expect, it } from "vitest";

import { CurrentTasteAppUserResponseSchema } from "../src/index.js";

describe("account contracts", () => {
  it("accepts the current TasteApp User response", () => {
    expect(
      CurrentTasteAppUserResponseSchema.parse({
        user: {
          displayName: "Khoi Le",
          id: "00000000-0000-4000-8000-000000000001",
          primaryEmail: "khoi@example.com"
        }
      })
    ).toEqual({
      user: {
        displayName: "Khoi Le",
        id: "00000000-0000-4000-8000-000000000001",
        primaryEmail: "khoi@example.com"
      }
    });
  });
});
