export type MobileAccountShellState = {
  actionLabel: string;
  heading: string;
  statusLabel: string;
};

export type AccountShellUser = {
  displayName: string | null;
};

export function getMobileAccountShellState(user: AccountShellUser | null): MobileAccountShellState {
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
