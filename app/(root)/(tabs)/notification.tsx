import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";

interface Notification {
  id: string;
  type: "info" | "promo" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const getIconName = (type: string) => {
    switch (type) {
      case "info":
        return "information-circle";
      case "promo":
        return "pricetag";
      case "alert":
        return "alert-circle";
      default:
        return "notifications";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "info":
        return "#0C6C41";
      case "promo":
        return "#FFA500";
      case "alert":
        return "#FF4500";
      default:
        return "#0C6C41";
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 border-b border-gray-200 ${
        notification.read ? "opacity-60" : ""
      }`}
    >
      <View
        className={`bg-${getIconColor(notification.type)}-100 rounded-full p-2 mr-3`}
      >
        <Ionicons
          name={getIconName(notification.type)}
          size={24}
          color={getIconColor(notification.type)}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {notification.title}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          {notification.message}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">{notification.time}</Text>
      </View>
      {!notification.read && (
        <View className="bg-[#0C6C41] rounded-full w-3 h-3 ml-2" />
      )}
    </TouchableOpacity>
  );
};

const NotificationScreen: React.FC = () => {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "info",
      title: "Your ride is complete",
      message: "Thank you for riding with us. Rate your experience!",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "promo",
      title: "Weekend special offer",
      message: "Get 20% off on your next 3 rides this weekend!",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "alert",
      title: "Ride cancellation",
      message: "Your scheduled ride for tomorrow has been cancelled.",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "Profile update",
      message: "Your profile information has been successfully updated.",
      time: "1 day ago",
      read: true,
    },
  ];

  const platformSpecificStyle = Platform.select({
    ios: "mb-4",
    android: "mb-5 mt-8",
  });

  return (
    <SafeAreaView
      className={`flex-1 bg-[#0C6C41] ${platformSpecificStyle} text-white `}
    >
      <View className="bg-[#0C6C41] p-4">
        <Text className="text-2xl font-bold text-white">Notifications</Text>
      </View>
      <ScrollView className="bg-white">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ScrollView>
      <TouchableOpacity className="m-4 p-3 mb-14 rounded-full">
        <Text className="text-white text-center font-semibold">
          Mark all as read
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NotificationScreen;
