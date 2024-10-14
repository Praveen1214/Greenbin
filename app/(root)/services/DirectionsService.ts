// services/DirectionsService.ts
import axios from 'axios';
import { decodePolyline } from "../../utils/polyline";

export const fetchDirections = async (origin, destination) => {
  const apiKey = 'AIzaSyDa1olgsfiH0ktBXGGkG2P_PXy1f5bIUdE';  // Replace with your actual API key
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.routes.length > 0) {
      const route = decodePolyline(response.data.routes[0].overview_polyline.points);
      const duration = response.data.routes[0].legs[0].duration.text;
      const distance = response.data.routes[0].legs[0].distance.text;

      return { route, duration, distance };
    } else {
      throw new Error("No route found");
    }
  } catch (error) {
    throw new Error("Failed to fetch directions");
  }
};
