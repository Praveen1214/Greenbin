import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import Garbagebag from "../../assets/images/garbageba.png";
import Garbagetruck from "../../assets/images/garbagetruck.png";
import * as Location from "expo-location";
import Track from "../(root)/(driver)/Track";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Use the router for navigation

const GarbageMap = () => {
  const navigation = useNavigation();
  const router = useRouter(); // Initialize the router for navigation
  const [pickupgarbage, setPickupGarbage] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(

        "http://192.168.8.154:5000/api/pickupgarbage/getallpickupgarbage"

      );
      setPickupGarbage(response.data);
    } catch (error) {
      console.error("Error fetching garbage pickup data:", error);
      Alert.alert(
        "Error",
        "Failed to fetch garbage pickup data. Please try again."
      );
    }
  };

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
        longitudeDelta: 0.0421
      });

      // Start watching the position changes
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
    fetchData();
    getCurrentLocation();
  }, []);

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

  // Function to remove the completed pickup
  const handleCompletePickup = () => {
    if (selectedPickup) {
      const updatedPickups = pickupgarbage.filter(
        (pickup) => pickup !== selectedPickup
      );
      setPickupGarbage(updatedPickups); // Update the state to remove the completed pickup
      setSelectedPickup(null); // Clear the selected pickup after completion
      setShowDirections(false); // Hide the Track component
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("passengerDetails"); // Clear AsyncStorage to log out
      router.replace("/(auth)/sign-in"); // Navigate to the sign-in screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#0C6C41", padding: 16, marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "white",
                marginLeft: 16
              }}
            >
              Garbage Map
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} style={{ padding: 8 }}>
            <Feather name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={{ flex: 1 }}>
        {mapRegion && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={true}
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude
                }}
                title="Your Location"
              >
                <Image
                  source={Garbagetruck}
                  style={{ width: 40, height: 40 }}
                />
              </Marker>
            )}

            {pickupgarbage.map((pickup, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: pickup.location.latitude,
                  longitude: pickup.location.longitude
                }}
                title={pickup.location.address}
                description={`Garbage types: ${pickup.garbagetypes}`}
                onPress={() => handleMarkerPress(pickup)}
              >
                <View style={{ padding: 5, borderRadius: 5 }}>
                  <Image
                    source={Garbagebag}
                    style={{ width: 40, height: 40 }}
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
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
        <FlatList
          data={pickupgarbage}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMarkerPress(item)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16
                }}
              >
                <Feather name="map-pin" size={20} color="black" />
                <Text style={{ marginLeft: 8, fontSize: 16, color: "black" }}>
                  {item.location.address}
                </Text>
                <View style={{ marginLeft: "auto", padding: 8 }}>
                  <Feather
                    name={selectedPickup === item ? "check-square" : "square"}
                    size={20}
                    color={selectedPickup === item ? "green" : "gray"}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Track Component */}
      {showDirections && selectedPickup && (
        <Track
          currentLocation={currentLocation}
          selectedPickup={selectedPickup}
          onCloseTracking={handleCloseTracking}
          onComplete={handleCompletePickup} // Pass the completion function
        />
      )}
    </View>
  );
};

export default GarbageMap;
