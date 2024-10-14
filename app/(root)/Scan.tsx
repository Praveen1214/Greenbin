import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import both hooks

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [rawData, setRawData] = useState('');
  const navigation = useNavigation(); // Use the hook to get navigation object
  const route = useRoute(); // Use the hook to get route object

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setRawData(data);
    try {
      console.log('Raw scanned data:', data);
      const decodedData = decodeURIComponent(data);
      console.log('Decoded data:', decodedData);
      const bookingDetails = JSON.parse(decodedData);
      setScannedData(bookingDetails);
  
      console.log('Booking details:', bookingDetails);
  
      // Use the correct userid from the QR code
      const response = await axios.get(
        `http://192.168.8.187:5000/api/pickupgarbage/getbyuserid/${bookingDetails._id}`
      );
  
      if (response.data.length > 0) {
        Alert.alert(
          'QR Code Scanned Successfully',
          'Would you like to proceed to weight input?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                // Check if WeightInputScreen is defined in the navigation
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
      if (error.response && error.response.status === 404) {
        Alert.alert('Error', 'No pickups found for this user.');
      } else {
        Alert.alert('Error', `Failed to process the QR code: ${error.message}`);
      }
      setScannedData(null);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      <ScrollView style={styles.dataContainer}>
        <Text style={styles.title}>Scanned QR Code Data:</Text>
        <Text style={styles.rawData}>Raw data: {rawData}</Text>
      </ScrollView>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => {
        setScanned(false);
        setScannedData(null);
        setRawData('');
      }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scanner: {
    flex: 1,
  },
  dataContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rawData: {
    marginTop: 10,
    fontStyle: 'italic',
  },
});