import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import tw from 'twrnc';
import { AntDesign, Feather } from '@expo/vector-icons';
import axios from 'axios';
import Garbagebag from "../../assets/images/garbageba.png";
import * as Location from 'expo-location';

const GarbageMap = () => {
  const navigation = useNavigation();
  const [pickupgarbage, setPickupGarbage] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.9.96:5000/api/pickupgarbage/getallpickupgarbage"
      );
      setPickupGarbage(response.data);
    } catch (error) {
      console.error("Error fetching garbage pickup data:", error);
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  useEffect(() => {
    fetchData();
    getCurrentLocation();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>
            Garbage Map
          </Text>
        </View>
      </View>
     
      {/* Map */}
      <View style={{ flex: 1 }}>
        {mapRegion && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />
            )}
            {pickupgarbage.map((pickup, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: pickup.location.latitude,
                  longitude: pickup.location.longitude,
                }}
                title={pickup.location.address}
                description={`Garbage types: ${pickup.garbagetypes}`}
              >
                <View style={{ padding: 5, borderRadius: 5 }}>
                  <Image
                    source={Garbagebag}
                    style={tw`w-12 h-12`}
                  />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
      </View>
     
      {/* Location List */}
      <View style={{ alignItems: 'center', padding: 10 }}>
        <Text style={{ color: '#0C6C41', fontWeight: 'bold', fontSize: 18 }}>
          Pickup Addresses
        </Text>
      </View>
      <View style={{ padding: 16, maxHeight: 200 }}>
        <FlatList
          data={pickupgarbage}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Feather name="map-pin" size={20} color="black" />
              <Text style={{ marginLeft: 8, fontSize: 16, color: 'black' }}>{item.location.address}</Text>
              <TouchableOpacity style={{ marginLeft: 'auto', padding: 8 }}>
                <Feather name="square" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default GarbageMap;