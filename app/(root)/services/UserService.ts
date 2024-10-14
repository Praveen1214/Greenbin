// services/UserService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPassengerDetails = async () => {
  try {
    const passengerDetailsString = await AsyncStorage.getItem("passengerDetails");
    if (passengerDetailsString) {
      return JSON.parse(passengerDetailsString);
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
