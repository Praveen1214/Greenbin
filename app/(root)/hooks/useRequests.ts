// hooks/useRequests.ts
import { useState, useEffect } from "react";
import { fetchRequests } from "../services/RequestService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const useRequests = () => {
  const [requests, setRequests] = useState([]);
  const [contact, setContact] = useState("");

  useEffect(() => {
    const getUserContact = async () => {
      try {
        const passengerDetailsString = await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setContact(passengerDetails.contact);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserContact();
  }, []);

  useEffect(() => {
    if (contact) {
      loadRequests();
    }
  }, [contact]);

  const loadRequests = async () => {
    try {
      const requestsData = await fetchRequests(contact);
      setRequests(requestsData);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch requests. Please try again later.");
    }
  };

  return { requests, loadRequests };
};
