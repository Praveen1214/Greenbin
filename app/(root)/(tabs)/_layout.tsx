import { Tabs } from "expo-router";
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
};

const Layout = () => {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          overflow: "hidden",
          height: Platform.OS === "ios" ? 80 : 60, // Adjust height for Android
          paddingBottom: Platform.OS === "ios" ? 20 : 5, // Adjust padding for Android
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
        },
        tabBarItemStyle: {
          padding: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="list-outline" focused={focused} title="Activity" />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="notifications-outline"
              focused={focused}
              title="Notification"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" focused={focused} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
