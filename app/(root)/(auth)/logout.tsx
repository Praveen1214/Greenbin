import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

export const handleLogout = async () => {
  const router = useRouter();
  try {
    await AsyncStorage.removeItem("passengerDetails");
    router.replace("/(auth)/sign-in");
  } catch (error) {
    Alert.alert("Error", "Failed to log out. Please try again.");
  }
};
