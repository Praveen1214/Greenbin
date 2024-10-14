// services/RequestItemService.ts
import axios from 'axios';

const BASE_URL = 'http://192.168.8.187:5000/api/requestitem';

export const submitRequestItem = async (requestData) => {
  try {
    const response = await axios.post(`${BASE_URL}/request-item`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting request item:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit request');
  }
};
