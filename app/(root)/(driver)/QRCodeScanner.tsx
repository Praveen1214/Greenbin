import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getPickupByUserId } from '../services/PickupService';
import { decodeQRData } from '../../utils/qrDecoder';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setRawData(data);
    setLoading(true);

    try {
      console.log('Raw scanned data:', data);
      const bookingDetails = decodeQRData(data);
      setScannedData(bookingDetails);

      console.log('Booking details:', bookingDetails);
      
      const pickupData = await getPickupByUserId(bookingDetails._id);

      setLoading(false);

      if (pickupData.length > 0) {
        Alert.alert(
          'QR Code Scanned Successfully',
          'Would you like to proceed to weight input?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => {
                if (navigation.getState().routeNames.includes('WeightInputScreen')) {
                  navigation.navigate('WeightInputScreen', { request: bookingDetails });
                } else {
                  console.error('WeightInputScreen is not defined in the navigation stack');
                  Alert.alert('Error', 'Unable to navigate to Weight Input Screen');
                }
              }
            },
          ]
        );
      } else {
        Alert.alert('Error', 'No pickups found for this user.');
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setLoading(false);
      Alert.alert('Error', error.message || 'Failed to process the QR code.');
      setScannedData(null);
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
          <MaterialIcons 
            name={flashOn ? "flash-on" : "flash-off"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          flashMode={flashOn ? 'torch' : 'off'}
        />
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerMarker} />
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Processing QR Code...</Text>
        </View>
      )}

      <ScrollView style={styles.dataContainer}>
        {scannedData && (
          <>
            <Text style={styles.title}>Scanned QR Code Data:</Text>
            <Text style={styles.rawData}>{JSON.stringify(scannedData, null, 2)}</Text>
          </>
        )}
      </ScrollView>

      {scanned && (
        <TouchableOpacity
          style={styles.scanAgainButton}
          onPress={() => {
            setScanned(false);
            setScannedData(null);
            setRawData('');
          }}
        >
          <Text style={styles.scanAgainButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backButton: {
    padding: 8,
  },
  flashButton: {
    padding: 8,
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scannerMarker: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  dataContainer: {
    maxHeight: 200,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  rawData: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  scanAgainButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});