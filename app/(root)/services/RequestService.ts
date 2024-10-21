// services/RequestService.ts
import axios from "axios";

const BASE_URL = "http://192.168.1.13:5000/api/requestitem";

export const fetchRequests = async (contact: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/getallrequestitems/${contact}`);
    return response.data.req;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

export const cancelRequest = async (requestId: string) => {
  try {
    const response = await axios.put(`${BASE_URL}/cancelrequest/${requestId}`);
    return response.data.updatedAppointment;
  } catch (error) {
    console.error("Error canceling request:", error);
    throw error;
  }
};

export const updateRequest = async (editedItem: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/updaterequest/${editedItem._id}`, editedItem);
    return response.data;
  } catch (error) {
    console.error("Error updating request:", error);
    throw error;
  }
};
