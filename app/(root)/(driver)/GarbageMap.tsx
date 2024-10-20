import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useGarbagePickups } from "../hooks/useGarbagePickups";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { Linking } from 'react-native';


const GarbageMap = () => {
  const router = useRouter();
  const { pickupGarbage } = useGarbagePickups();
  const { currentLocation, mapRegion } = useCurrentLocation();
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showPickupList, setShowPickupList] = useState(false);
  const [completedPickups, setCompletedPickups] = useState(0);

  useEffect(() => {
    // Load completed pickups count from AsyncStorage
    const loadCompletedPickups = async () => {
      const count = await AsyncStorage.getItem('completedPickups');
      setCompletedPickups(count ? parseInt(count) : 0);
    };
    loadCompletedPickups();
  }, []);

  const handleMarkerPress = (pickup) => {
    setSelectedPickup(pickup);
    setShowPickupList(false);
  };

  const handleStartNavigation = () => {
    if (selectedPickup) {
      const { latitude, longitude } = selectedPickup.location;
      const url = `http://maps.google.com/?daddr=${latitude},${longitude}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "Please select a pickup location first.");
    }
  };

  const handleCompletePickup = () => {
    // Navigate to the QR Code Scanner screen
    router.push("(requests)/residenceRequests/QRCodeScanner");  // Adjust the path as per your route structure
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("passengerDetails");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const renderPickupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pickupItem}
      onPress={() => handleMarkerPress(item)}
    >
      <MaterialIcons name="location-on" size={24} color="#0C6C41" />
      <View style={styles.pickupItemContent}>
        <Text style={styles.pickupAddress}>{item.location.address}</Text>
        <Text style={styles.pickupTime}>{item.time || 'Time not specified'}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#0C6C41" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCompletePickup} style={styles.headerButton}>
          <MaterialIcons name="qr-code" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Garbage Pickup Map</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: 6.9271,  // Example region (Colombo)
          longitude: 79.8612,
          latitudeDelta: 0.1,  // Smaller delta for closer zoom
          longitudeDelta: 0.1,
        }}
      >
        {pickupGarbage.map((pickup) => (
          pickup.location && pickup.location.latitude && pickup.location.longitude ? (
            <Marker
              key={pickup._id}  // Use _id instead of id
              coordinate={{
                latitude: pickup.location.latitude,  // Use the correct latitude
                longitude: pickup.location.longitude,  // Use the correct longitude
              }}
              onPress={() => handleMarkerPress(pickup)}
            />
          ) : null
        ))}
      </MapView>

      
      {showPickupList && (
        <View style={styles.pickupList}>
          <Text style={styles.pickupListTitle}>Pickup Locations</Text>
          <FlatList
            data={pickupGarbage}
            renderItem={renderPickupItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {selectedPickup && (
        <View style={styles.selectedPickup}>
          <View style={styles.selectedPickupHeader}>
            <MaterialIcons name="location-on" size={24} color="#0C6C41" />
            <Text style={styles.selectedPickupTitle}>Selected Location</Text>
          </View>
          <Text style={styles.selectedPickupAddress}>{selectedPickup.location.address}</Text>
          <View style={styles.selectedPickupDetails}>
            <Text style={styles.selectedPickupDetail}>
              <Ionicons name="time-outline" size={16} /> Expected Time: {selectedPickup.time || 'N/A'}
            </Text>
            <Text style={styles.selectedPickupDetail}>
              <MaterialIcons name="delete" size={16} /> Bin Type: {selectedPickup.garbagetypes || 'Recycle'}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleStartNavigation}>
              <FontAwesome5 name="route" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.completeButton]} onPress={handleCompletePickup}>
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedPickups}</Text>
          <Text style={styles.statLabel}>Completed Pickups</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pickupGarbage.length}</Text>
          <Text style={styles.statLabel}>Total Pickups</Text>
        </View>
        <TouchableOpacity
        style={styles.listButton}
        onPress={() => setShowPickupList(!showPickupList)}
      >
        <MaterialIcons name={showPickupList ? "close" : "list"} size={24} color="#fff" />
      </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C6C41',
    padding: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  listButton: {
    position: 'absolute',
    top:15,
    right: 46,
    backgroundColor: '#0C6C41',
    padding: 18,
    borderRadius: 30,
    elevation: 10,
  },
  pickupList: {
    position: 'absolute',
    top: 130,
    right: 16,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '60%',
    elevation: 5,
  },
  pickupListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0C6C41',
  },
  pickupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pickupItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  pickupAddress: {
    fontSize: 16,
    color: '#333',
  },
  pickupTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsBar: {
    flexDirection: 'row',
    gap: 30,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0C6C41',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedPickup: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 5,
  },
  selectedPickupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedPickupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#0C6C41',
  },
  selectedPickupAddress: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  selectedPickupDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectedPickupDetail: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C6C41',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default GarbageMap;