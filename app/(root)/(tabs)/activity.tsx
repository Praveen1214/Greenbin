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
      const response = await axios.get(
        `http://192.168.43.196:5000/api/requestitem/getallrequestitems/${contact}`
      );
      
      // Here you would typically navigate to a screen to input weights and calculate costs
    } catch (error) {
      Alert.alert('Error', 'Failed to parse the QR code data.');
    }
  };

  const handleCancelRequest = async (item) => {
    try {
      // Update the request status to "Canceled" using the backend API
      const response = await axios.put(
        `http://192.168.43.196:5000/api/requestitem/cancelrequest/${item._id}`
      );

      if (response.status === 200) {
        // If the API call succeeds, update the local state with the new status from the response
        const updatedRequest = response.data.updatedAppointment;

        setRequests(prevRequests =>
          prevRequests.map(req => req._id === item._id ? { ...req, status: updatedRequest.status } : req)
        );
        setSelectedRequest(null); // Close the modal
        Alert.alert("Success", "Request has been canceled");
      } else {
        Alert.alert("Error", "Failed to cancel request. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      Alert.alert("Error", "Failed to cancel request. Please try again.");
    }
  };


  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedRequest(item);
  };

  const handleSave = async (editedItem) => {
    try {
      const response = await axios.put(
        `http://192.168.43.196:5000/api/requestitem/updaterequest/${editedItem._id}`,
        editedItem
      );
      if (response.status === 200) {
        setRequests(prevRequests =>
          prevRequests.map(req => req._id === editedItem._id ? editedItem : req)
        );
        setIsEditing(false);
        setSelectedRequest(null);
        Alert.alert("Success", "Request updated successfully");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert("Error", "Failed to update request. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={tw`p-4 mb-4 bg-white rounded-lg shadow-md`}>
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <View style={tw`flex-row items-center`}>
          {getIcon(item.category)}
          <Text style={tw`ml-2 text-lg font-bold`}>{item.category}</Text>
        </View>
        {item.status === "Pending" && (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Feather name="edit" size={24} color="blue" />
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text>Quantity(kg): {item.quantity}</Text>
        <Text>Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}</Text>
      </View>
      <Text style={tw`mt-2 ${item.status === "Approved" ? "text-green-500" : item.status === "Canceled" ? "text-red-500" : "text-yellow-500"}`}>
        {item.status} {/* Displays status (Pending, Approved, Canceled) */}
      </Text>
      <TouchableOpacity style={tw`mt-2`} onPress={() => setSelectedRequest(item)}>
        <Text style={tw`text-blue-500`}>View Request Details</Text>
      </TouchableOpacity>
    </View>
  );

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
