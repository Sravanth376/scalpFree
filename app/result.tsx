import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { diseaseDetails } from "@/constants/diseaseDetails";
import { useEffect, useRef, useState } from "react";

/* ================= SEVERITY LOGIC ================= */
const getSeverity = (confidence: number) => {
  if (confidence < 40)
    return { level: "Low", color: "#22c55e", note: "Low risk detected" };
  if (confidence < 70)
    return { level: "Medium", color: "#f59e0b", note: "Monitor closely" };
  return { level: "High", color: "#ef4444", note: "Consult a doctor" };
};

export default function Result() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    disease?: string;
    confidence?: string;
    scalpImage?: string;
  }>();

  const disease = params.disease ?? "Unknown";
  const confidence = Number(params.confidence ?? "0");
  const scalpImage = params.scalpImage;

  const details =
    diseaseDetails[disease] ?? {
      description:
        "Detailed information is not available for this condition.",
      symptoms: ["No symptom data available"],
      careTips: ["Consult a dermatologist"],
    };

  const severity = getSeverity(confidence);

  /* ================= ANIMATIONS ================= */
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: confidence,
      duration: 900,
      useNativeDriver: false,
    }).start();

    // Number animation
    Animated.timing(animatedValue, {
      toValue: confidence,
      duration: 900,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(Math.floor(value));
    });

    return () => animatedValue.removeListener(listener);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ================= HEADER ================= */}
      <View style={styles.headerCard}>
        <Text style={styles.disease}>{disease}</Text>

        <View
          style={[
            styles.severityBadge,
            { backgroundColor: severity.color },
          ]}
        >
          <Text style={styles.severityText}>
            {severity.level} Risk
          </Text>
        </View>

        <Text style={styles.confidenceText}>AI Confidence</Text>

        <View style={styles.progressBg}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth, backgroundColor: severity.color },
            ]}
          />
        </View>

        {/* 🔥 Animated confidence */}
        <Text style={styles.confidencePercent}>{displayValue}%</Text>

        <Text style={styles.severityNote}>{severity.note}</Text>

        {/* 🔥 AI message */}
        <Text style={styles.aiNote}>
          Based on visual patterns detected by AI model
        </Text>
      </View>

      {/* ================= IMAGE ================= */}
      <View style={styles.imageRow}>
        <View style={styles.imageBox}>
          {scalpImage ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/preview",
                  params: { img: scalpImage },
                })
              }
            >
              <Image source={{ uri: scalpImage }} style={styles.image} />
            </Pressable>
          ) : (
            <Text style={styles.placeholder}>Your Scalp</Text>
          )}
          <Text style={styles.imageLabel}>Your Scalp</Text>
        </View>
      </View>

      {/* ================= ABOUT ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What is it?</Text>
        <Text style={styles.description}>{details.description}</Text>
      </View>

      {/* ================= SYMPTOMS ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Common Symptoms</Text>
        {details.symptoms.map((item, index) => (
          <Text key={index} style={styles.list}>
            • {item}
          </Text>
        ))}
      </View>

      {/* ================= CARE ================= */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Care Tips</Text>
        {details.careTips.map((tip, index) => (
          <Text key={index} style={styles.list}>
            • {tip}
          </Text>
        ))}
      </View>

      {/* ================= ALERT ================= */}
      {confidence >= 70 && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠ Doctor Recommended</Text>
          <Text style={styles.alertText}>
            This condition shows a high confidence level. Please consult a
            certified dermatologist for further evaluation.
          </Text>
        </View>
      )}

      {/* ================= CTA ================= */}
      <Pressable
        style={styles.actionBtn}
        onPress={() => router.push("/action")}
      >
        <Text style={styles.actionText}>
          View Personalized Action Plan →
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
    padding: 20,
  },

  headerCard: {
    backgroundColor: "#6366f1",
    padding: 22,
    borderRadius: 22,
    marginBottom: 26,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#ffffff20",
  },

  disease: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  severityBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  severityText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  confidenceText: {
    marginTop: 12,
    color: "#e0e7ff",
    fontWeight: "600",
  },

  confidencePercent: {
    marginTop: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  severityNote: {
    marginTop: 4,
    color: "#e5e7eb",
    fontSize: 13,
  },

  aiNote: {
    marginTop: 6,
    color: "#c7d2fe",
    fontSize: 12,
  },

  progressBg: {
    marginTop: 10,
    height: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },

  imageBox: {
    width: "100%",
    height: 180,
    backgroundColor: "#e5e7eb",
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },

  placeholder: {
    color: "#9ca3af",
    fontWeight: "600",
    alignSelf: "center",
    marginTop: 70,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 3,
  },

  alertCard: {
    backgroundColor: "#fee2e2",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },

  alertTitle: {
    fontWeight: "800",
    color: "#b91c1c",
    marginBottom: 6,
  },

  alertText: {
    color: "#7f1d1d",
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  list: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },

  actionBtn: {
    marginTop: 18,
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 40,
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});