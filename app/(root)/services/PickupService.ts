// services/PickupService.ts
import axios from "axios";

const BASE_URL = "http://192.168.8.174:5000/api/pickupgarbage";

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
export const submitWeights = async (bookingId, weights) => {
  try {
    const response = await axios.post(`${BASE_URL}/updateweights`, {
      bookingId,
      weights,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update weights: ${error.message}`);
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
