import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { Camera } from 'expo-camera';

const QRCodeGenerator = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null); // Camera permission state
  const [scanned, setScanned] = useState(false); // Scan state
  const [userId, setUserId] = useState(null); // User ID from the scanned QR code
  const [loading, setLoading] = useState(false); // Loading state
  const [bookingDetails, setBookingDetails] = useState(null); // Booking details state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const userData = JSON.parse(data); // Parse QR code data (assumes it contains JSON)
      if (!userData._id) {
        throw new Error('Invalid QR code: User ID not found');
      }
      setUserId(userData._id); // Set the user ID from the QR code
      fetchBookingDetails(userData._id); // Fetch booking details based on the user ID
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code');
      setScanned(false);
    }
  };

  const fetchBookingDetails = async (userId) => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const response = await axios.get(
        `http://your-api-url.com/api/pickupgarbage/getbyuserid/${userId}`
      );
      if (response.data && response.data.length > 0) {
        setBookingDetails(response.data[0]); // Assuming the first request is the latest
      } else {
        setError('No booking details found for this user.');
      }
    } catch (err) {
      setError('Failed to fetch booking details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

 // Show the QR code scanner if we haven't scanned yet
 if (!scanned && !userId) {
  return (
    <SafeAreaView style={styles.container}>
      {hasPermission === true && (
        <Camera
          onBarCodeScanned={handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.overlay}>
            <Text style={styles.scanText}>Scan the QR code</Text>
          </View>
        </Camera>
      )}
      {hasPermission === false && <Text>No access to camera</Text>}
      {hasPermission === null && <Text>Requesting camera permission...</Text>}
    </SafeAreaView>
  );
}

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching booking details...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      </SafeAreaView>
    );
  }

  // Check if bookingDetails exists and has the expected structure
  if (!bookingDetails || !bookingDetails.id) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: Invalid booking details</Text>
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      </SafeAreaView>
    );
  }

  // Convert booking details to a JSON string for the QR code
  const qrData = JSON.stringify(bookingDetails);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Pickup QR Code</Text>
        <QRCode value={qrData} size={200} />
        <Text style={styles.instructions}>
          Show this QR code to the truck driver when they arrive.
        </Text>
        <Text style={styles.bookingInfo}>Booking ID: {bookingDetails.id}</Text>
        <Text style={styles.bookingInfo}>Location: {bookingDetails.location}</Text>
        <Text style={styles.bookingInfo}>Date: {new Date(bookingDetails.datetime).toLocaleString()}</Text>
        <Text style={styles.bookingInfo}>Garbage Types: {bookingDetails.garbagetypes.join(', ')}</Text>
        <Button title="Scan Again" onPress={() => setScanned(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  bookingInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default QRCodeGenerator;
