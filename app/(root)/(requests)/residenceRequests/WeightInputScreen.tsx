import React, { useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useWeights } from '../../hooks/useWeights';
import { usePickupData } from '../../hooks/usePickupData';
import { submitWeights } from '../../services/PickupService';

export default function WeightInput() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request } = route.params || {};
  const { weights, totalAmount, handleWeightChange } = useWeights();
  const { pickupData } = usePickupData(request?._id);

  useEffect(() => {
    if (!request) {
      Alert.alert('Error', 'No request data available.');
      navigation.goBack();
    }
  }, [request, navigation]);

  const handleSubmit = async () => {
    if (!request?._id) {
      Alert.alert('Error', 'No request data available.');
      return;
    }

    try {
      const response = await submitWeights(request._id, weights);
      if (response?.totalCost) {
        Alert.alert('Success', `Total cost submitted: LKR ${response.totalCost.toFixed(2)}`);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to submit weights. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!pickupData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pickup Request Details</Text>
      <RequestDetails pickupData={pickupData} />

      <Text style={styles.subtitle}>Enter Garbage Weights (kg)</Text>

      {pickupData.garbagetypes && Array.isArray(pickupData.garbagetypes) ? (
        pickupData.garbagetypes.map((type) => (
          <GarbageWeightInput key={type} garbageType={type} weight={weights[type]} onChange={handleWeightChange} />
        ))
      ) : (
        <Text>No garbage types available.</Text>
      )}

      <TotalAmountDisplay totalAmount={totalAmount} />

      <Button title="Submit Weights" onPress={handleSubmit} />
    </ScrollView>
  );
}

const RequestDetails = ({ pickupData }) => (
  <View>
    <Text>User ID: {pickupData.userid}</Text>
    <Text>Date: {pickupData.date}</Text>
    <Text>Status: {pickupData.status}</Text>
  </View>
);

const GarbageWeightInput = ({ garbageType, weight, onChange }) => (
  <View style={styles.inputContainer}>
    <Text>{garbageType}:</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={weight ? weight.toString() : ''}
      onChangeText={(value) => onChange(garbageType, value)}
    />
  </View>
);

const TotalAmountDisplay = ({ totalAmount }) => (
  <View style={styles.resultContainer}>
    <Text style={styles.resultText}>Total Amount: LKR {totalAmount.toFixed(2)}</Text>
  </View>
);

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
});
