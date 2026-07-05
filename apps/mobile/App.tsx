import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { StyleSheet, Text, View } from "react-native";

import { getMobileAccountShellState } from "./src/account-shell";
import { getMobileHealthStatus } from "./src/health";

export default function App() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <TasteAppMobileShell />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <TasteAppAuthenticatedShell />
    </ClerkProvider>
  );
}

function TasteAppAuthenticatedShell() {
  const { user } = useUser();

  return (
    <TasteAppMobileShell
      displayName={user ? getClerkDisplayName(user) : null}
      isSignedIn={Boolean(user)}
    />
  );
}

type TasteAppMobileShellProps = {
  displayName?: string | null;
  isSignedIn?: boolean;
};

function TasteAppMobileShell({ displayName = null, isSignedIn = false }: TasteAppMobileShellProps) {
  const account = getMobileAccountShellState(
    isSignedIn
      ? {
          displayName
        }
      : null
  );
  const health = getMobileHealthStatus();

  return (
    <View style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>TasteApp Mobile</Text>
        <Text style={styles.title}>{account.heading}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{account.statusLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{health.service}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{health.status}</Text>
        </View>
        <Text style={styles.action}>{account.actionLabel}</Text>
      </View>
    </View>
  );
}

function getClerkDisplayName(user: {
  firstName?: string | null;
  fullName?: string | null;
  lastName?: string | null;
}): string | null {
  if (user.fullName) {
    return user.fullName;
  }

  const nameParts = [user.firstName, user.lastName].filter(Boolean);

  return nameParts.length > 0 ? nameParts.join(" ") : null;
}

const styles = StyleSheet.create({
  action: {
    color: "#8b3f2b",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 20
  },
  eyebrow: {
    color: "#8b3f2b",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
    textTransform: "uppercase"
  },
  label: {
    color: "#59615e",
    fontSize: 15,
    fontWeight: "600"
  },
  panel: {
    borderColor: "#d6d0c6",
    borderRadius: 8,
    borderWidth: 1,
    padding: 24,
    width: "100%"
  },
  row: {
    alignItems: "center",
    borderColor: "#d6d0c6",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12
  },
  screen: {
    alignItems: "center",
    backgroundColor: "#f7f4ef",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  title: {
    color: "#1f2523",
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 36,
    marginBottom: 28
  },
  value: {
    color: "#1f2523",
    fontFamily: "Courier",
    fontSize: 15
  }
});
