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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.100:8000"; // ✅ YOUR BACKEND IP

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [loading, setLoading] = useState(false);

  // ✅ CAMERA PERMISSION
  if (!cameraPermission?.granted) {
    requestCameraPermission();
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }

  // ---------------------------
  // 🔼 UPLOAD IMAGE
  // ---------------------------
const uploadImage = async (uri: string) => {
  try {
    setLoading(true);

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Session expired", "Please login again");
      router.replace("/(auth)/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "scalp.jpg",
      type: "image/jpeg",
    } as any);

    const response = await axios.post(
      `${API_URL}/predict`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 🚫 NOT A SCALP IMAGE
    if (response.data.disease === "Scalp not detected") {
      setLoading(false);
      Alert.alert(
        "Scalp Not Detected",
        "Please upload a clear scalp image.\nMake sure hair & scalp are clearly visible."
      );
      return;
    }

    // ✅ VALID SCALP IMAGE
    router.push({
      pathname: "/result",
      params: {
        disease: response.data.disease,
        confidence: String(response.data.confidence),
        scalpImage: uri,
      },
    });

  } catch (err: any) {
    console.log("Prediction error:", err?.response?.data);
    Alert.alert("Prediction failed", "Please try again");
  } finally {
    setLoading(false);
  }
};



  // ---------------------------
  // 📸 CAMERA
  // ---------------------------
  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      quality: 0.8,
    });

    if (photo?.uri) {
      uploadImage(photo.uri);
    }
  };

  // ---------------------------
  // 🖼️ GALLERY (FIXED)
  // ---------------------------
  const pickFromGallery = async () => {
    // ✅ REQUEST GALLERY PERMISSION
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
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
          <ActivityIndicator size="large" color="#fff" />
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
