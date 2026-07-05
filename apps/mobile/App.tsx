import { StyleSheet, Text, View } from "react-native";

import { getMobileHealthStatus } from "./src/health";

export default function App() {
  const health = getMobileHealthStatus();

  return (
    <View style={styles.screen}>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>TasteApp Mobile</Text>
        <Text style={styles.title}>Dish-first discovery is booting up.</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{health.service}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{health.status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
