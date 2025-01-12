// services/GarbageService.ts
import axios from "axios";


const BASE_URL = "http://192.168.134.196:5000/api/pickupgarbage";


export const fetchGarbagePickups = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getallpickupgarbage`);
    return response.data;
  } catch (error) {
    console.error("Error fetching garbage pickup data:", error);
    throw error;
  }
};
