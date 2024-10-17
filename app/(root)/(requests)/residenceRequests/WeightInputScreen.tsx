import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useWeights } from '../../hooks/useWeights';
import { usePickupData } from '../../hooks/usePickupData';
import { submitWeights } from '../../services/PickupService';

const COST_PER_KG = 250; // LKR 250 per kg

export default function WeightInput() {
  const route = useRoute();
  const navigation = useNavigation();
  const { request } = route.params || {};
  const { weights, totalAmount, handleWeightChange } = useWeights();
  const { pickupData, isLoading } = usePickupData(request?._id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!request) {
      Alert.alert('Error', 'No request data available.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  }, [request, navigation]);

  const handleSubmit = async () => {
    if (!request?._id) {
      Alert.alert('Error', 'No request data available.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitWeights(request._id, weights);
      if (response?.totalCost) {
        Alert.alert('Success', `Total cost submitted: LKR ${response.totalCost.toFixed(2)}`, [
          { text: 'OK', onPress: () => navigation.navigate('Home') }
        ]);
      } else {
        throw new Error('Failed to submit weights');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading pickup details...</Text>
      </View>
    );
  }

  if (!pickupData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No pickup data available.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pickup Request Details</Text>
        <RequestDetails pickupData={pickupData} />
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Enter Garbage Weights (kg)</Text>
        {pickupData.garbagetypes && Array.isArray(pickupData.garbagetypes) ? (
          pickupData.garbagetypes.map((type) => (
            <GarbageWeightInput
              key={type}
              garbageType={type}
              weight={weights[type]}
              onChange={handleWeightChange}
            />
          ))
        ) : (
          <Text style={styles.errorText}>No garbage types available.</Text>
        )}
      </View>

      <TotalAmountDisplay totalAmount={totalAmount} />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Submitting..." : "Submit Weights"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const RequestDetails = ({ pickupData }) => (
  <View>
    <Text style={styles.detailText}>User ID: {pickupData.userid}</Text>
    <Text style={styles.detailText}>Date: {new Date(pickupData.date).toLocaleDateString()}</Text>
    <Text style={styles.detailText}>Status: {pickupData.status}</Text>
  </View>
);

const GarbageWeightInput = ({ garbageType, weight, onChange }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{garbageType}:</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={weight ? weight.toString() : ''}
      onChangeText={(value) => onChange(garbageType, value)}
      placeholder="0.00"
    />
  </View>
);

const TotalAmountDisplay = ({ totalAmount }) => (
  <View style={[styles.card, styles.totalAmountCard]}>
    <Text style={styles.totalAmountText}>Total Amount:</Text>
    <Text style={styles.totalAmountValue}>LKR {totalAmount.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: 120,
    fontSize: 16,
  },
  totalAmountCard: {
    backgroundColor: '#e6f7ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
});
