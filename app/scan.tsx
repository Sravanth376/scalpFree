import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRef, useState } from "react";
import { useRouter } from "expo-router";

import api from "../services/api";

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  if (!cameraPermission?.granted) {
    requestCameraPermission();
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  const uploadImage = async (uri: string) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "scalp.jpg",
        type: "image/jpeg",
      } as any);

      const response = await api.post("/api/v1/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.disease === "Scalp not detected") {
        Alert.alert("Scalp Not Detected", "Upload a clear scalp image.");
        return;
      }

      router.push({
        pathname: "/result",
        params: {
          disease: response.data.disease,
          confidence: String(response.data.confidence),
          scalpImage: uri,
        },
      });
    } catch (err: any) {
      console.log("FULL ERROR:", err);
      console.log("SERVER RESPONSE:", err?.response?.data);

      if (err?.message?.includes("timeout")) {
        Alert.alert(
          "Server Slow",
          "The server may still be waking up. Please try again."
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
      });

      if (photo?.uri) {
        uploadImage(photo.uri);
      }
    } catch {
      Alert.alert("Error", "Failed to capture image.");
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  return (
    <CameraView ref={cameraRef} style={{ flex: 1 }}>
      <View style={styles.overlay}>
        <View style={styles.circle} />

        {loading ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={{ color: "#fff", marginTop: 10 }}>Processing...</Text>
          </View>
        ) : (
          <>
            <Pressable style={styles.captureBtn} onPress={takePhoto}>
              <Text style={styles.btnText}>CAPTURE</Text>
            </Pressable>

            <Pressable style={styles.galleryBtn} onPress={pickFromGallery}>
              <Text style={styles.btnText}>GALLERY</Text>
            </Pressable>
          </>
        )}
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
    gap: 14,
  },
  captureBtn: {
    backgroundColor: "#2193b0",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  galleryBtn: {
    backgroundColor: "#374151",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 40,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    top: "35%",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
  },
});
