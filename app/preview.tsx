import { View, Image, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Preview() {
  const { img } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image source={{ uri: img as string }} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});