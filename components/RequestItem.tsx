// components/RequestItem.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import tw from "twrnc";

const RequestItem = ({ item, onEdit, onViewDetails }) => (
  <View style={tw`p-4 mb-4 bg-white rounded-lg shadow-md`}>
    <View style={tw`flex-row items-center justify-between mb-2`}>
      <View style={tw`flex-row items-center`}>
        {/* Dynamically load the AntDesign icon based on the category */}
        <AntDesign name={getIconName(item.category)} size={24} color="black" />
        <Text style={tw`ml-2 text-lg font-bold`}>{item.category}</Text>
      </View>
      {item.status === "Pending" && (
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={24} color="blue" />
        </TouchableOpacity>
      )}
    </View>
    <View style={tw`flex-row justify-between`}>
      <Text>Quantity(kg): {item.quantity}</Text>
      <Text>Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}</Text>
    </View>
    <Text
      style={tw`mt-2 ${
        item.status === "Approved"
          ? "text-green-500"
          : item.status === "Canceled"
          ? "text-red-500"
          : "text-yellow-500"
      }`}
    >
      {item.status}
    </Text>
    <TouchableOpacity style={tw`mt-2`} onPress={onViewDetails}>
      <Text style={tw`text-blue-500`}>View Request Details</Text>
    </TouchableOpacity>
  </View>
);

// Function to map categories to specific icons
const getIconName = (category) => {
  switch (category) {
    case "Metal":
      return "smileo"; // Example AntDesign icon
    case "Plastic":
      return "rocket1"; // Example AntDesign icon
    case "Paper":
      return "book"; // Example AntDesign icon
    default:
      return "questioncircleo"; // Default icon for unknown categories
  }
};

export default RequestItem;
