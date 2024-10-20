import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeGenerator = ({ route }) => {
  const { bookingDetails } = route.params || {};

  // Convert booking details to a JSON string
  const qrData = JSON.stringify({
    id: bookingDetails.id,
    garbagetypes: bookingDetails.garbagetypes,
    location: bookingDetails.location.address,
    datetime: bookingDetails.datetime,
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Your Pickup QR Code</Text>
        <QRCode
          value={qrData}
          size={200}
        />
        <Text style={styles.instructions}>
          Show this QR code to the truck driver when they arrive.
        </Text>
        <Text style={styles.bookingInfo}>Booking ID: {bookingDetails.id}</Text>
        <Text style={styles.bookingInfo}>Location: {bookingDetails.location}</Text>
        <Text style={styles.bookingInfo}>Date: {new Date(bookingDetails.datetime).toLocaleString()}</Text>
        <Text style={styles.bookingInfo}>Garbage Types: {bookingDetails.garbagetypes.join(', ')}</Text>
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
});

export default QRCodeGenerator;
