import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import MapHeader from "@/components/MapHeader";
import GarbageMapView from "@/components/GarbageMapView";
import PickupList from "@/components/PickupList";
import { useGarbagePickups } from "../hooks/useGarbagePickups";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import Track from "./Track";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const GarbageMap = () => {
  const router = useRouter();
  const { pickupGarbage } = useGarbagePickups();
  const { currentLocation, mapRegion } = useCurrentLocation();
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const handlePickupPress = () => {
    if (selectedPickup) {
      setShowDirections(true);
    } else {
      Alert.alert(
        "No Location Selected",
        "Please select a pickup location first."
      );
    }
  };

  const handleMarkerPress = (pickup) => {
    setSelectedPickup(pickup);
    setShowDirections(false); // Reset directions when a new pickup is selected
  };

  const handleCloseTracking = () => {
    setShowDirections(false);
  };

  const handleCompletePickup = () => {
    const updatedPickups = pickupGarbage.filter((pickup) => pickup !== selectedPickup);
    setSelectedPickup(null);
    setShowDirections(false); // Hide the Track component
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("passengerDetails");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MapHeader onLogout={handleLogout} />

      {/* Map */}
      <View style={{ flex: 1 }}>
        <GarbageMapView
          mapRegion={mapRegion}
          currentLocation={currentLocation}
          pickupGarbage={pickupGarbage}
          onMarkerPress={handleMarkerPress}
        />
      </View>

      {/* Location List and Pickup Button */}
      <View style={{ padding: 10 }} className="flex-row justify-between px-4">
        <Text style={{ color: "#0C6C41", fontWeight: "bold", fontSize: 18 }}>
          Pickup Addresses
        </Text>
        <TouchableOpacity onPress={handlePickupPress}>
          <Text className="p-2 text-sm text-white bg-green-600 rounded-lg">
            {showDirections ? "Hide Directions" : "Show Directions"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pickup Locations List */}
      <View style={{ padding: 16, maxHeight: 200 }}>
        <PickupList
          pickups={pickupGarbage}
          selectedPickup={selectedPickup}
          onPickupPress={handleMarkerPress}
        />
      </View>

      {/* Track Component */}
      {showDirections && selectedPickup && (
        <Track
          currentLocation={currentLocation}
          selectedPickup={selectedPickup}
          onCloseTracking={handleCloseTracking}
          onComplete={handleCompletePickup}
        />
      )}
    </View>
  );
};

export default GarbageMap;
