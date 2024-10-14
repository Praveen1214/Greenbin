import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const COST_PER_KG = 250; // LKR 250 per kg

export default function WeightInput() {
  const route = useRoute();
  const navigation = useNavigation();
  const [request, setRequest] = useState(null);
  const [weights, setWeights] = useState({});
  const [response, setResponse] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (route.params && route.params.request) {
      const requestId = route.params.request._id;
      setRequest(route.params.request);

      axios
        .get(`http://192.168.8.154:5000/api/pickupgarbage/getbyuserid/${requestId}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setResponse(res.data[0]);
            setStatus(res.data[0].status);
          } else {
            Alert.alert('Error', 'No pickup data found for this request.');
            navigation.goBack();
          }
        })
        .catch((error) => {
          console.error('Error fetching pickup data:', error);
          Alert.alert('Error', 'Failed to fetch request data.');
          navigation.goBack();
        });
    } else {
      Alert.alert('Error', 'No request data available.');
      navigation.goBack();
    }
  }, [route.params]);

  const handleWeightChange = (garbageType, value) => {
    const newWeights = { ...weights, [garbageType]: parseFloat(value) || 0 };
    setWeights(newWeights);
    calculateTotalAmount(newWeights);
  };

  const calculateTotalAmount = (currentWeights) => {
    const totalWeight = Object.values(currentWeights).reduce((sum, weight) => sum + weight, 0);
    const total = totalWeight * COST_PER_KG;
    setTotalAmount(total);
  };

  const handleSubmit = async () => {
    
    try {
      // Update status to "Completed"
      const response = await axios.put(`http://192.168.8.154:5000/api/pickupgarbage/updatestatus/${request._id}`);
      
      if (response.data.status === "Pending") {
        Alert.alert('Success', 'Status updated to Completed successfully');
        setStatus("Completed");
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `Failed to update status: ${error.message}`);
    }
  };

  if (!response) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pickup Request Details</Text>
      <Text>User ID: {response.userid}</Text>
      <Text>Date: {response.date}</Text>
      <Text style={styles.status}>Status: {status}</Text>

      <Text style={styles.subtitle}>Enter Garbage Weights (kg)</Text>

      {response.garbagetypes && Array.isArray(response.garbagetypes) ? (
        response.garbagetypes.map((type) => (
          <View key={type} style={styles.inputContainer}>
            <Text>{type}:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(value) => handleWeightChange(type, value)}
              value={weights[type] ? weights[type].toString() : ''}
            />
          </View>
        ))
      ) : (
        <Text>No garbage types available.</Text>
      )}

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Total Amount: LKR {totalAmount.toFixed(2)}</Text>
      </View>

      <Button title="Submit Weights" onPress={handleSubmit} />
    </ScrollView>
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
  resultContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 5,
  },
});
