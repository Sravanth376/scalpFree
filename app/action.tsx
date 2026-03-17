import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ActionPlan() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Action Plan</Text>

      {/* Diet */}
      <View style={styles.row}>
        <View style={[styles.box, styles.green]}>
          <Text style={styles.boxTitle}>Include</Text>
          <Text>🥬 Greens</Text>
          <Text>🐟 Fish</Text>
          <Text>🥜 Nuts</Text>
        </View>

        <View style={[styles.box, styles.red]}>
          <Text style={styles.boxTitle}>Limit</Text>
          <Text>🍩 Sugar</Text>
          <Text>🍟 Fried food</Text>
        </View>
      </View>

      {/* Weekly Plan */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weekly Routine</Text>
        <Text>✔ Use medicated shampoo (3x/week)</Text>
        <Text>✔ Apply soothing aloe or oil</Text>
        <Text>✔ Avoid scratching scalp</Text>
        <Text>✔ Track symptoms daily</Text>
      </View>

      {/* Doctor Advice */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Doctor Tips</Text>
        <Text style={styles.tip}>
          • Avoid harsh hair products
        </Text>
        <Text style={styles.tip}>
          • Manage stress levels
        </Text>
        <Text style={styles.tip}>
          • Stay consistent for 3–4 weeks
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  row: { flexDirection: "row", gap: 12, marginBottom: 20 },
  box: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
  },
  green: { backgroundColor: "#bbf7d0" },
  red: { backgroundColor: "#fecaca" },
  boxTitle: { fontWeight: "700", marginBottom: 6 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  tip: { fontSize: 14, marginBottom: 4 },
});
