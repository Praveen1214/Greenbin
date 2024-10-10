import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import Garbagetruck from "../../assets/images/garbagetruck.png";
import Garbagebag from "../../assets/images/garbageba.png";

const Track = ({ currentLocation, selectedPickup, onCloseTracking, onComplete }) => {
  const [route, setRoute] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distance, setDistance] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (currentLocation && selectedPickup) {
      fetchDirections();
    }
  }, [currentLocation, selectedPickup]);

  const fetchDirections = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${selectedPickup.location.latitude},${selectedPickup.location.longitude}&key=AIzaSyDa1olgsfiH0ktBXGGkG2P_PXy1f5bIUdE`
      );
      if (response.data.routes.length > 0) {
        const points = decodePolyline(response.data.routes[0].overview_polyline.points);
        setRoute(points);
        const duration = response.data.routes[0].legs[0].duration.text;
        const dist = response.data.routes[0].legs[0].distance.text;
        setEstimatedTime(duration);
        setDistance(dist);
      } else {
        Alert.alert("No Route Found", "Unable to find a route to the selected location.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      Alert.alert("Error", "Failed to fetch directions. Please try again.");
    }
  };

  const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) !== 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      poly.push({ latitude: lat / 1E5, longitude: lng / 1E5 });
    }
    return poly;
  };

  const handleComplete = () => {
    setCompleted(true);
    Alert.alert("Success", "Garbage collection completed successfully!");
    onComplete(); // Call the onComplete function passed from GarbageMap
  };

  if (!currentLocation || !selectedPickup || !route) {
    return null;
  }

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Header */}
      <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onCloseTracking}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>
            Tracking
          </Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: (currentLocation.latitude + selectedPickup.location.latitude) / 2,
          longitude: (currentLocation.longitude + selectedPickup.location.longitude) / 2,
          latitudeDelta: Math.abs(currentLocation.latitude - selectedPickup.location.latitude) * 1.5,
          longitudeDelta: Math.abs(currentLocation.longitude - selectedPickup.location.longitude) * 1.5,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Your Location"
        >
          <Image
            source={Garbagetruck}
            style={{ width: 40, height: 40 }}
          />
        </Marker>

        {!completed && (
          <Marker
            coordinate={{
              latitude: selectedPickup.location.latitude,
              longitude: selectedPickup.location.longitude,
            }}
            title={selectedPickup.location.address}
          >
            <Image
              source={Garbagebag}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        )}

        <Polyline
          coordinates={route}
          strokeColor="#0C6C41"
          strokeWidth={4}
        />
      </MapView>

      {/* Estimated Time, Distance and Garbage Category */}
      <View className="absolute bottom-8 left-5 right-5 p-4 bg-white rounded-lg shadow-lg">
        <View className="flex-row mt-2 items-center">
          <Text className="text-base font-semibold text-green-600">Arrival time :</Text>
          <Text className="text-base text-gray-700"> {estimatedTime}</Text>
        </View>

        <View className="flex-row mt-2 items-center">
          <Text className="text-base font-semibold text-green-600">Distance: </Text>
          <Text className="text-base text-gray-700"> {distance}</Text>
        </View>

        <View className="flex-row mt-2 items-center">
          <Text className="text-base font-semibold text-green-600">Garbage Category: </Text>
          <Text className="text-base text-gray-700"> {selectedPickup.garbagetypes}</Text>
        </View>

        <View className="flex-row mt-2 items-center">
          <Text className="text-base font-semibold text-green-600">Address: </Text>
          <Text className="text-base text-gray-700"> {selectedPickup.location.address}</Text>
        </View>

        {/* Complete Button */}
        <View className="flex-row justify-center mt-4">
          <TouchableOpacity
            className="bg-green-600 py-2 px-4 rounded-lg"
            onPress={handleComplete}
          >
            <Text className="text-white font-medium">Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Track;
