import { View, Text, StyleSheet } from "react-native";

export default function Plan() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lifestyle Plan</Text>

      <View style={styles.row}>
        <View style={styles.include}>
          <Text style={styles.boxTitle}>Include</Text>
          <Text>🥬 Greens</Text>
          <Text>🐟 Fish</Text>
          <Text>🥜 Nuts</Text>
        </View>

        <View style={styles.limit}>
          <Text style={styles.boxTitle}>Limit</Text>
          <Text>🍩 Sugar</Text>
          <Text>🍟 Fried</Text>
        </View>
      </View>

      <Text style={styles.week}>Your Weekly Plan</Text>
      <Text>✔ Use medicated shampoo</Text>
      <Text>✔ Apply soothing aloe</Text>
      <Text>✔ Track symptoms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  row: { flexDirection: "row", gap: 12 },
  include: {
    flex: 1,
    backgroundColor: "#c7f9cc",
    padding: 14,
    borderRadius: 12,
  },
  limit: {
    flex: 1,
    backgroundColor: "#ffd6d6",
    padding: 14,
    borderRadius: 12,
  },
  boxTitle: { fontWeight: "700", marginBottom: 6 },
  week: { marginTop: 20, fontWeight: "700" },
});
