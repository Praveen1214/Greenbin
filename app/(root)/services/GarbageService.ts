// services/GarbageService.ts
import axios from "axios";

const BASE_URL = "http://192.168.1.13:5000/api/pickupgarbage";

export const fetchGarbagePickups = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getallpickupgarbage`);
    return response.data;
  } catch (error) {
    console.error("Error fetching garbage pickup data:", error);
    throw error;
  }
};
