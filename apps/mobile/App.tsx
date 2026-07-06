import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import type { CatalogSubmissionConfirmation, LocationKind } from "@tasteapp/contracts";

import { getMobileAccountShellState } from "./src/account-shell";
import {
  buildCatalogSubmissionPayload,
  createEmptyCatalogSubmissionForm,
  type MobileCatalogSubmissionForm
} from "./src/catalog-submission";
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
  const { getToken } = useAuth();

  return (
    <TasteAppMobileShell
      displayName={user ? getClerkDisplayName(user) : null}
      getAuthToken={getToken}
      isSignedIn={Boolean(user)}
    />
  );
}

type TasteAppMobileShellProps = {
  displayName?: string | null;
  getAuthToken?: () => Promise<string | null>;
  isSignedIn?: boolean;
};

function TasteAppMobileShell({
  displayName = null,
  getAuthToken,
  isSignedIn = false
}: TasteAppMobileShellProps) {
  const account = getMobileAccountShellState(
    isSignedIn
      ? {
          displayName
        }
      : null
  );
  const health = getMobileHealthStatus();

  return (
    <ScrollView contentContainerStyle={styles.screen}>
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
      {isSignedIn ? <CatalogSubmissionPanel getAuthToken={getAuthToken} /> : null}
    </ScrollView>
  );
}

type CatalogSubmissionPanelProps = {
  getAuthToken?: () => Promise<string | null>;
};

function CatalogSubmissionPanel({ getAuthToken }: CatalogSubmissionPanelProps) {
  const [form, setForm] = useState<MobileCatalogSubmissionForm>(createEmptyCatalogSubmissionForm);
  const [confirmation, setConfirmation] = useState<CatalogSubmissionConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitCatalogContribution() {
    setError(null);
    setConfirmation(null);

    try {
      const payload = buildCatalogSubmissionPayload(form);
      const apiUrl = process.env.EXPO_PUBLIC_TASTEAPP_API_URL;

      if (!apiUrl) {
        throw new Error("TasteApp API URL is not configured.");
      }

      const token = getAuthToken ? await getAuthToken() : null;

      if (!token) {
        throw new Error("Sign in again before submitting.");
      }

      setIsSubmitting(true);

      const response = await fetch(`${apiUrl}/catalog/submissions`, {
        body: JSON.stringify(payload),
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json"
        },
        method: "POST"
      });
      const body = (await response.json()) as unknown;

      if (!response.ok) {
        const maybeError = body as { error?: unknown };
        throw new Error(
          typeof maybeError.error === "string" ? maybeError.error : "Submission failed."
        );
      }

      const confirmedSubmission = body as CatalogSubmissionConfirmation;

      setConfirmation(confirmedSubmission);
      setForm(createEmptyCatalogSubmissionForm());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.sectionTitle}>Suggest a missing Restaurant</Text>
      <TextInput
        accessibilityLabel="Restaurant name"
        onChangeText={(restaurantName) => {
          setForm((current) => ({ ...current, restaurantName }));
        }}
        placeholder="Restaurant name"
        style={styles.input}
        value={form.restaurantName}
      />
      <TextInput
        accessibilityLabel="Location name"
        onChangeText={(locationName) => {
          setForm((current) => ({ ...current, locationName }));
        }}
        placeholder="Location name"
        style={styles.input}
        value={form.locationName}
      />
      <View style={styles.segmentedControl}>
        {locationKinds.map((kind) => (
          <Pressable
            accessibilityRole="button"
            key={kind}
            onPress={() => {
              setForm((current) => ({ ...current, locationKind: kind }));
            }}
            style={[
              styles.segmentedButton,
              form.locationKind === kind ? styles.segmentedButtonSelected : null
            ]}
          >
            <Text
              style={[
                styles.segmentedButtonText,
                form.locationKind === kind ? styles.segmentedButtonTextSelected : null
              ]}
            >
              {locationKindLabels[kind]}
            </Text>
          </Pressable>
        ))}
      </View>
      <TextInput
        accessibilityLabel="Address"
        onChangeText={(address) => {
          setForm((current) => ({ ...current, address }));
        }}
        placeholder="Address"
        style={styles.input}
        value={form.address}
      />
      <TextInput
        accessibilityLabel="Google Maps link"
        autoCapitalize="none"
        onChangeText={(googleMapsUrl) => {
          setForm((current) => ({ ...current, googleMapsUrl }));
        }}
        placeholder="Google Maps link"
        style={styles.input}
        value={form.googleMapsUrl}
      />
      <TextInput
        accessibilityLabel="Website"
        autoCapitalize="none"
        onChangeText={(websiteUrl) => {
          setForm((current) => ({ ...current, websiteUrl }));
        }}
        placeholder="Website"
        style={styles.input}
        value={form.websiteUrl}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {confirmation ? (
        <Text style={styles.success}>
          {confirmation.restaurantName} is with our review team. Tiny clipboard, big responsibility.
        </Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={() => void submitCatalogContribution()}
        style={[styles.submitButton, isSubmitting ? styles.submitButtonDisabled : null]}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? "Sending..." : "Submit"}</Text>
      </Pressable>
    </View>
  );
}

const locationKinds: LocationKind[] = ["STANDALONE", "FOOD_TRUCK", "CANTEEN"];

const locationKindLabels: Record<LocationKind, string> = {
  CANTEEN: "Canteen",
  FOOD_TRUCK: "Food truck",
  STANDALONE: "Standalone"
};

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
  error: {
    color: "#9f1d20",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12
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
    backgroundColor: "#fffdfa",
    borderColor: "#d6d0c6",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 24,
    width: "100%"
  },
  input: {
    borderColor: "#b9c1bd",
    borderRadius: 6,
    borderWidth: 1,
    color: "#1f2523",
    fontSize: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10
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
    backgroundColor: "#f7f4ef",
    flexGrow: 1,
    justifyContent: "flex-start",
    padding: 24
  },
  sectionTitle: {
    color: "#1f2523",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
    marginBottom: 8
  },
  segmentedButton: {
    alignItems: "center",
    borderColor: "#b9c1bd",
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 8
  },
  segmentedButtonSelected: {
    backgroundColor: "#1f2523",
    borderColor: "#1f2523"
  },
  segmentedButtonText: {
    color: "#1f2523",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center"
  },
  segmentedButtonTextSelected: {
    color: "#fffdfa"
  },
  segmentedControl: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#8b3f2b",
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 48
  },
  submitButtonDisabled: {
    opacity: 0.6
  },
  submitButtonText: {
    color: "#fffdfa",
    fontSize: 16,
    fontWeight: "800"
  },
  success: {
    color: "#1c6b4a",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 12
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
