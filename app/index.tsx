import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.hello}>Hello, Alex</Text>

      <Pressable style={styles.scanCard} onPress={() => router.push("/scan")}>
        <Text style={styles.scanText}>Start New Scalp Scan</Text>
      </Pressable>

      <Text style={styles.section}>Recent Activity</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Oct 24, 2023</Text>
        <Text style={styles.cardSub}>Analysis Report: Mild Dermatitis</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Oct 15, 2023</Text>
        <Text style={styles.cardSub}>Weekly Plan Completed</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f4f7fb", flexGrow: 1 },
  hello: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  scanCard: {
    backgroundColor: "#5cc6ba",
    padding: 30,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  scanText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  section: { fontWeight: "600", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardTitle: { fontWeight: "600" },
  cardSub: { color: "#6b7280", marginTop: 4 },
});
