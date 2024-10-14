import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function WeightInput() {
  const route = useRoute();
  const navigation = useNavigation();
  const [request, setRequest] = useState(null);
  const [weights, setWeights] = useState({});
  const [response, setResponse] = useState(null); // To hold the pickup data from the API

  useEffect(() => {
    if (route.params && route.params.request) {
      const requestId = route.params.request._id;
      setRequest(requestId);

      // Fetch the pickup request data using request ID
      axios
        .get(`http://192.168.8.187:5000/api/pickupgarbage/getbyuserid/${requestId}`)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setResponse(res.data[0]); // Assume the first item is the one we need
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
    setWeights({ ...weights, [garbageType]: parseFloat(value) || 0 });
  };

  const handleCalculate = async () => {
    if (!request) {
      Alert.alert('Error', 'No request data available.');
      return;
    }

    try {
      const response = await axios.post("http://192.168.8.187:5000/api/pickupgarbage/updateweights", {
        userId : request,
        weights: weights,
      });

      console.log('Cost calculation response:', response.data);

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

  if (!response) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pickup Request Details</Text>
      <Text>User ID: {response.userid}</Text>
      <Text>Date: {response.date}</Text>
      <Text>Status: {response.status}</Text>

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
