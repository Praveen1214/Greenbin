import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const WeightInputScreen = ({ route, navigation }) => {
  const { bookingDetails } = route.params;
  const [weights, setWeights] = useState({});
  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWeightChange = (type, value) => {
    setWeights({ ...weights, [type]: parseFloat(value) || 0 });
  };

  // Calculate total cost based on input weights
  const calculateCost = () => {
    const costPerKg = 250; // LKR 250 per kg
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0) * costPerKg;
    setTotalCost(total);
  };

  // Save the weights and total cost on the backend when the driver submits the weights
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Assuming you have an API endpoint to save the weights and calculate the cost
      const response = await axios.post('http://192.168.8.174:5000/api/pickupgarbage/updateweights', {
        bookingId: bookingDetails.id,
        weights: weights,
        totalCost: totalCost
      });

      Alert.alert('Success', 'Weight and cost saved successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Error saving weights and cost:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to save weights and cost. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    calculateCost(); // Automatically calculate cost when weights change
  }, [weights]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Weights (kg)</Text>
      {bookingDetails.garbagetypes.map(type => (
        <View key={type} style={styles.inputContainer}>
          <Text>{type}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => handleWeightChange(type, value)}
          />
        </View>
      ))}
      <Button title="Calculate Cost" onPress={calculateCost} />
      <Text style={styles.totalCost}>Total Cost: LKR {totalCost.toFixed(2)}</Text>
      <Button title="Submit Weights" onPress={handleSubmit} disabled={isSubmitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 100,
    padding: 5,
  },
  totalCost: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default WeightInputScreen;
