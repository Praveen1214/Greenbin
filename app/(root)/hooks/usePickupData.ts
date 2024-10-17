// hooks/usePickupData.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchPickupDataByUserId } from '../services/PickupService';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const usePickupData = (requestId) => {
  const [pickupData, setPickupData] = useState(null);
  const navigation = useNavigation();

  const fetchPickupData = useCallback(async () => {
    try {
      const data = await fetchPickupDataByUserId(requestId);
      setPickupData(data);
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    }
  }, [requestId, navigation]);

  useEffect(() => {
    if (requestId) {
      fetchPickupData();
    }
  }, [requestId, fetchPickupData]);

  return { pickupData };
};
