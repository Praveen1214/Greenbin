import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InitialRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const passengerDetails = await AsyncStorage.getItem("passengerDetails");
      setIsLoggedIn(!!passengerDetails);
      setRole(passengerDetails ? JSON.parse(passengerDetails).role : "");
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isLoggedIn) {
    if (role === "Passenger") {
      return <Redirect href="/(tabs)/home" />;
    } else {
      return <Redirect href="/(driver)/GarbageMap" />;
    }
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
};

export default InitialRoute;