import { Tabs,Stack } from "expo-router";
import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TabIcon = ({
  name,
  focused,
  title,
}: {
  name: string;
  focused: boolean;
  title: string;
}) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Icon name={name} size={24} color={focused ? "green" : "gray"} />
    </View>
  );
}

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="Book_a_pickup" options={{ headerShown: false }} />
      <Stack.Screen name="ViewPickup" options={{ headerShown: false }} />
      <Stack.Screen name="Pay" options={{ headerShown: false }} />
      <Stack.Screen name="Recycle" options={{ headerShown: false }} />
      <Stack.Screen name="Requestitem" options={{ headerShown: false }} />
      <Stack.Screen name="RequestedItemPayment" options={{ headerShown: false }} />
      <Stack.Screen name="GarbageMap" options={{ headerShown: false }} />
      <Stack.Screen name="AllrequestItems" options={{ headerShown: false }} />

      
    </Stack>
    
  );
};

export default Layout;
