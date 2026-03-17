// import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
// import { useState } from "react";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const login = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.post(
//         "http://192.168.29.58:8000/login",
//         { email, password }
//       );

//       await AsyncStorage.setItem("token", res.data.access_token);

//       router.replace("/"); // go to home
//     } catch (err) {
//       alert("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         placeholder="Email"
//         style={styles.input}
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />

//       <TextInput
//         placeholder="Password"
//         style={styles.input}
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <Pressable style={styles.button} onPress={login}>
//         <Text style={styles.btnText}>
//           {loading ? "Logging in..." : "Login"}
//         </Text>
//       </Pressable>

//       <Pressable onPress={() => router.push("/(auth)/signup")}>
//         <Text style={styles.link}>Create an account</Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 24,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#2193b0",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
//   link: {
//     textAlign: "center",
//     marginTop: 16,
//     color: "#2563eb",
//   },
// });
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

    const res = await axios.post(
    `${API_BASE_URL}/login`,
     { email, password }
   );


      // ✅ save JWT token
      await AsyncStorage.setItem("token", res.data.access_token);

      // ✅ go to home
      router.replace("/");
    } catch (err: any) {
      console.log("Login error:", err?.response?.data);

      alert(
        err?.response?.data?.detail ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={login} disabled={loading}>
        <Text style={styles.btnText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(auth)/signup")}>
        <Text style={styles.link}>Create an account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2193b0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    textAlign: "center",
    marginTop: 16,
    color: "#2563eb",
  },
});
