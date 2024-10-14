import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import AllrequestItems from "../AllrequestItems";

type ActivityStatus = "Ongoing" | "Completed" | "Complaint" | "Cancelled";

interface Activity {
  id: string;
  type: string;
  date: string;
  time: string;
  forPerson: string;
  phoneNumber: string;
  pickup: string;
  pickupTime: string;
  drop: string;
  dropTime: string;
  status: ActivityStatus;
  amount: number;
  driverName?: string;
  vehicleInfo?: string;
  estimatedArrival?: string;
}

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  const [showRating, setShowRating] = useState(false);
  const isOngoing = activity.status === "Ongoing";

  return (
    <View>
      <AllrequestItems />
    </View>
  );
};

const RideSharingActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActivityStatus>("Ongoing");

  const activities: Activity[] = [
    {
      id: "1",
      type: "Rides",
      date: "02 October 2024",
      time: "10:30 AM",
      forPerson: "Sasindu",
      phoneNumber: "786073966",
      pickup: "3A, Welivita Road, Malabe, Colombo",
      pickupTime: "10:30 AM",
      drop: "744/1, B47, Sri Jayawardenepura Kotte, Colombo",
      dropTime: "11:00 AM",
      status: "Ongoing",
      amount: 0,
      driverName: "Kumara Perera",
      vehicleInfo: "Toyota Prius - CAR 1234",
      estimatedArrival: "5 minutes",
    },
  ];

  const platformSpecificStyle = Platform.select({
    ios: "mb-4",
    android: "mb-5 mt-8",
  });

  return (
    <SafeAreaView
      className={`flex-1 bg-gray-100 ${platformSpecificStyle} text-black`}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <View className="bg-white px-5 py-4 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-2xl font-bold text-[#0C6C41]">Your activities</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#0C6C41" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-around bg-white py-2 border-b border-gray-200">
        {["Ongoing", "Completed", "Complaint", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as ActivityStatus)}
            className={`py-2 px-3 ${
              activeTab === tab ? "border-b-2 border-[#0C6C41]" : ""
            }`}
          >
            <Text
              className={
                activeTab === tab
                  ? "text-[#0C6C41] font-medium"
                  : "text-gray-600"
              }
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Activity List */}
      <ScrollView className="flex-1">
        {/* Display "Hello" in the Completed section */}
        {activeTab === "Completed" ? (
          <Text style={{ textAlign: "center", marginTop: 20, fontSize: 18 }}>
            Completed
          </Text>
        ) : null}

        {activities
          .filter((activity) => activity.status === activeTab)
          .map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideSharingActivity;
