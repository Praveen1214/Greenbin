// hooks/useGarbagePickups.ts
import { useState, useEffect } from "react";
import { fetchGarbagePickups } from "../services/GarbageService";
import { Alert } from "react-native";

export const useGarbagePickups = () => {
  const [pickupGarbage, setPickupGarbage] = useState([]);

  const loadGarbagePickups = async () => {
    try {
      const data = await fetchGarbagePickups();
      setPickupGarbage(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to fetch garbage pickup data. Please try again."
      );
    }
  };

  useEffect(() => {
    loadGarbagePickups();
  }, []);

  return { pickupGarbage };
};
