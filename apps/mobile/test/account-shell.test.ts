import { describe, expect, it } from "vitest";

import { getMobileAccountShellState } from "../src/account-shell";

describe("getMobileAccountShellState", () => {
  it("describes the signed-out shell state", () => {
    expect(getMobileAccountShellState(null)).toEqual({
      actionLabel: "Sign in to TasteApp",
      heading: "Dish-first discovery is booting up.",
      statusLabel: "Signed out"
    });
  });

  it("describes the signed-in shell state for a TasteApp User", () => {
    expect(
      getMobileAccountShellState({
        displayName: "Khoi Le"
      })
    ).toEqual({
      actionLabel: "View account",
      heading: "Welcome back, Khoi Le.",
      statusLabel: "Signed in"
    });
  });
});
