// services/PickupService.ts
import axios from "axios";

const BASE_URL = "http://192.168.8.154:5000/api/pickupgarbage";

// Fetch pickup data by request ID
export const fetchPickupDataByUserId = async (requestId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getbyuserid/${requestId}`);
    if (response.data?.length > 0) {
      return response.data[0];
    } else {
      throw new Error("No pickup data found for this request.");
    }
  } catch (error) {
    throw new Error("Failed to fetch pickup data.");
  }
};

// Submit the weights to the server
export const submitWeights = async (pickupId, weights) => {
  try {
    const response = await fetch(`${BASE_URL}/updateweights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pickupId, weights }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit weights');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPickupByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/getbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
