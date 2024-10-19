import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Feather,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import tw from "twrnc";

const RequestItem = ({ item, onEdit, onViewDetails }) => (
  <View style={tw`p-4 mb-4 bg-white rounded-lg shadow-md`}>
    <View style={tw`flex-row items-center justify-between mb-2`}>
      <View style={tw`flex-row items-center`}>
        {renderIcon(item.category)}
        <Text style={tw`ml-2 text-lg font-bold`}> {item.category} </Text>
      </View>
      {item.status === "Pending" && (
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={24} color="blue" />
        </TouchableOpacity>
      )}
    </View>
    <View style={tw`flex-row justify-between`}>
      <Text>Quantity(kg): {item.quantity} </Text>
      <Text> Total Sell Price: LKR {item.totalSellPrice.toFixed(2)} </Text>
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
      <Text style={tw`text-blue-500`}> View Request Details </Text>
    </TouchableOpacity>
  </View>
);

// Function to render the correct icon based on the category
const renderIcon = (category) => {
  switch (category) {
    case "Paper":
      return <FontAwesome5 name="newspaper" size={24} color="#4CAF50" />;
    case "Plastic":
      return (
        <MaterialCommunityIcons name="bottle-soda" size={24} color="#2196F3" />
      );
    case "Metal":
      return <FontAwesome5 name="tools" size={24} color="#FF9800" />;
    case "Clothes":
      return <FontAwesome5 name="tshirt" size={24} color="#E91E63" />;
    case "E-waste":
      return <FontAwesome5 name="laptop" size={24} color="#9C27B0" />;
    case "Glass":
      return <FontAwesome5 name="wine-bottle" size={24} color="#009688" />;
    default:
      return <AntDesign name="question" size={24} color="black" />;
  }
};

export default RequestItem;
