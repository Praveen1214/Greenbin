import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function WeightInput({ route, navigation }) {
  const { request } = route.params;
  const [weights, setWeights] = useState({});

  const handleWeightChange = (garbageType, value) => {
    setWeights({ ...weights, [garbageType]: parseFloat(value) || 0 });
  };

  const handleCalculate = async () => {
    try {
      const response = await axios.post('http://your-api-url/api/pickupgarbage/updateweights', {
        bookingId: request._id,
        weights: weights
      });

      if (response.data && response.data.totalCost) {
        Alert.alert(
          'Cost Calculated',
          `Total cost: LKR ${response.data.totalCost.toFixed(2)}`,
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        Alert.alert('Error', 'Failed to calculate cost. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update weights and calculate cost. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup Request Details</Text>
      <Text>User ID: {request.userid}</Text>
      <Text>Address: {request.location.address}</Text>
      <Text>Date: {request.date}</Text>
      <Text>Status: {request.status}</Text>
      
      <Text style={styles.subtitle}>Enter Garbage Weights (kg)</Text>
      {request.garbagetypes.map((type) => (
        <View key={type} style={styles.inputContainer}>
          <Text>{type}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => handleWeightChange(type, value)}
            value={weights[type] ? weights[type].toString() : ''}
          />
        </View>
      ))}
      
      <Button title="Calculate Cost" onPress={handleCalculate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 100,
  },
});