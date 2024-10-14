import { Tabs, Stack } from "expo-router";
import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const TabIcon = ({
  name,
  focused,
  title
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
};

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(driver)" options={{ headerShown: false }} />
      <Stack.Screen name="(requests)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
