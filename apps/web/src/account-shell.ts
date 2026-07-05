export type WebAccountShellState = {
  actionLabel: string;
  heading: string;
  statusLabel: string;
};

export type AccountShellUser = {
  displayName: string | null;
};

export function getWebAccountShellState(user: AccountShellUser | null): WebAccountShellState {
  if (!user) {
    return {
      actionLabel: "Sign in to TasteApp",
      heading: "Dish-first discovery is booting up.",
      statusLabel: "Signed out"
    };
  }

  return {
    actionLabel: "View account",
    heading: `Welcome back${user.displayName ? `, ${user.displayName}` : ""}.`,
    statusLabel: "Signed in"
  };
}
