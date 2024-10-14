// hooks/useCurrentLocation.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use this feature."
      );
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (newLocation) => {
          setCurrentLocation(newLocation.coords);
        }
      );
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        "Error",
        "Failed to get your current location. Please try again."
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return { currentLocation, mapRegion };
};
