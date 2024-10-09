import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';  // Import router for navigation

const GarbageMap = () => {
  const navigation = useNavigation();

  // Example coordinates for the map markers
  const locations = [
    { id: 1, address: '453 A ABCD Street, Colombo', latitude: 6.927045, longitude: 79.861244 },
    { id: 2, address: '453 A ABCD Street, Colombo', latitude: 6.926979, longitude: 79.860144 },
    { id: 3, address: '453 A ABCD Street, Colombo', latitude: 6.927479, longitude: 79.861744 },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
     <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>Garbage Map</Text>
        </View>
      </View>
     

      {/* Map */}
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 6.927079, // Center of Colombo
            longitude: 79.861244,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.address}
            />
          ))}
        </MapView>
      </View>

      {/* Location List */}
      <View className='items-center'>
        <Text className=' text-green-700 font-bold text-xl'>
            Pickup address
        </Text>
      </View>
      <View style={{ padding: 16 }}>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Feather name="map-pin" size={20} color="black" />
              <Text style={{ marginLeft: 8, fontSize: 16, color: 'black' }}>{item.address}</Text>
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
