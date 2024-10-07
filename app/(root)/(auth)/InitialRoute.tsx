import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InitialRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const passengerDetails = await AsyncStorage.getItem("passengerDetails");
      setIsLoggedIn(!!passengerDetails);
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
};

export default InitialRoute;
