// hooks/useGarbagePickups.ts
import { useState, useEffect } from "react";
import { fetchGarbagePickups } from "../services/GarbageService";
import { Alert } from "react-native";

export const useGarbagePickups = () => {
  const [pickupGarbage, setPickupGarbage] = useState([]);

  const loadGarbagePickups = async () => {
    try {
      const data = await fetchGarbagePickups();
      console.log("Fetched Pickups:", data); // Log the data here
      setPickupGarbage(data);  // Make sure data is correctly set
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

