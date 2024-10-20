import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Entypo } from '@expo/vector-icons';
import Garbagetruck from "../../../assets/images/garbagetruck.png";
import Garbagebag from "../../../assets/images/garbageba.png";
import { fetchDirections } from '../services/DirectionsService';

const Track = ({ currentLocation, selectedPickup, onCloseTracking, onComplete }) => {
  const [route, setRoute] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [distance, setDistance] = useState('');
  const [completed, setCompleted] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    if (currentLocation && selectedPickup) {
      getRoute();
      updateMapRegion();
    }
  }, [currentLocation, selectedPickup]);

  const getRoute = async () => {
    try {
      const { route, duration, distance } = await fetchDirections(
        currentLocation,
        selectedPickup.location
      );
      setRoute(route);
      setEstimatedTime(duration);
      setDistance(distance);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const updateMapRegion = () => {
    setMapRegion({
      latitude: (currentLocation.latitude + selectedPickup.location.latitude) / 2,
      longitude: (currentLocation.longitude + selectedPickup.location.longitude) / 2,
      latitudeDelta: Math.abs(currentLocation.latitude - selectedPickup.location.latitude) * 1.5,
      longitudeDelta: Math.abs(currentLocation.longitude - selectedPickup.location.longitude) * 1.5,
    });
  };

  const handleComplete = () => {
    setCompleted(true);
    Alert.alert("Success", "Garbage collection completed successfully!");
    onComplete();
  };

  if (!currentLocation || !selectedPickup || !route || !mapRegion) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onCloseTracking}>
            <Entypo name="cross" size={30} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>
            Tracking
          </Text>
        </View>
      </View>

      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        region={mapRegion}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {/* Marker for Driver's Current Location with Garbagetruck Icon */}
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

        {/* Marker for Garbage Pickup Location with Garbagebag Icon */}
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

        {/* Polyline for Route */}
        <Polyline
          coordinates={route}
          strokeColor="#0C6C41"
          strokeWidth={4}
        />
      </MapView>

      {/* Estimated Time, Distance, and Garbage Category */}
      <View style={{ padding: 16, backgroundColor: 'white', position: 'absolute', bottom: 8, left: 5, right: 5, borderRadius: 10, shadowOpacity: 0.25, shadowRadius: 5, shadowColor: 'black', shadowOffset: { height: 2, width: 0 }, elevation: 5 }}>
        <Text style={{ fontWeight: 'bold', color: '#0C6C41' }}>Arrival time: {estimatedTime}</Text>
        <Text style={{ fontWeight: 'bold', color: '#0C6C41' }}>Distance: {distance}</Text>
        <Text style={{ fontWeight: 'bold', color: '#0C6C41' }}>Garbage Category: {selectedPickup.garbagetypes}</Text>
        <Text style={{ fontWeight: 'bold', color: '#0C6C41' }}>Address: {selectedPickup.location.address}</Text>

        {/* Complete Button */}
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ backgroundColor: '#0C6C41', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}
            onPress={handleComplete}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Track;