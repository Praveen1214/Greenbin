// hooks/useWeights.ts
import { useState, useCallback } from 'react';

const COST_PER_KG = 250;

export const useWeights = () => {
  const [weights, setWeights] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const handleWeightChange = (garbageType, value) => {
    const parsedValue = parseFloat(value) || 0;
    const newWeights = { ...weights, [garbageType]: parsedValue };
    setWeights(newWeights);
    calculateTotalAmount(newWeights);
  };

  const calculateTotalAmount = useCallback((currentWeights) => {
    const totalWeight = Object.values(currentWeights).reduce((sum, weight) => sum + weight, 0);
    const total = totalWeight * COST_PER_KG;
    setTotalAmount(total);
  }, []);

  return { weights, totalAmount, handleWeightChange };
};
