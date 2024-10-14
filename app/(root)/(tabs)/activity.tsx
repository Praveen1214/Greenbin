import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    try {
      const bookingDetails = JSON.parse(data);

      // Check if garbagetypes and location exist in bookingDetails
      const garbagetypes = bookingDetails.garbagetypes || [];
      const location = bookingDetails.location || { address: 'Unknown' };
      const datetime = bookingDetails.datetime || null;

      // Format the output safely
      const garbageTypesStr = garbagetypes.length > 0 ? garbagetypes.join(', ') : 'None';
      const dateStr = datetime ? new Date(datetime).toLocaleString() : 'Unknown';

      Alert.alert(
        'Booking scanned!',
        `Garbage Types: ${garbageTypesStr}\nLocation: ${location.address}\nDate: ${dateStr}`
      );
      
      // Here you would typically navigate to a screen to input weights and calculate costs
    } catch (error) {
      Alert.alert('Error', 'Failed to parse the QR code data.');
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
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
