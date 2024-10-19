import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import tw from "twrnc";

const RequestDetails = ({ item, onClose, onEdit, onCancelRequest }) => (
  <View style={tw`flex-1 p-6 bg-white rounded-lg`}>
    <View style={tw`flex-row justify-between mb-4`}>
      {item.status === "Pending" && (
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={24} color="blue" />
        </TouchableOpacity>
      )}
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={tw`flex-row items-center mb-4`}>
        {renderIcon(item.category)}
        <Text style={tw`ml-4 text-2xl font-bold`}> {item.category} </Text>
      </View>
      <Text style={tw`mb-2 text-lg font-semibold`}> Request Details </Text>
      <View style={tw`p-4 mb-4 bg-gray-100 rounded-lg`}>
        <Text style={tw`mb-2`}> Quantity: {item.quantity} kg </Text>
        <Text style={tw`mb-2`}>
          {" "}
          Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}{" "}
        </Text>
        <Text style={tw`mb-2`}> Status: {item.status} </Text>
        <Text style={tw`mb-2`}> Factory Name: {item.factoryName} </Text>
        <Text style={tw`mb-2`}> Factory Address: {item.factoryAddress} </Text>
      </View>
      <Text style={tw`mb-2 text-lg font-semibold`}> Card Details </Text>
      <View style={tw`p-4 mb-4 bg-gray-100 rounded-lg`}>
        <Text style={tw`mb-2`}> Beneficiary Name: {item.beneficiaryName}</Text>
        <Text style={tw`mb-2`}> Bank: {item.bank}</Text>
        <Text style={tw`mb-2`}> Account No: {item.accountNo} </Text>
      </View>
    </ScrollView>
    {item.status === "Pending" && (
      <TouchableOpacity
        style={tw`px-4 py-2 mt-4 bg-red-500 rounded-lg`}
        onPress={() => onCancelRequest(item)}
      >
        <Text style={tw`font-bold text-white`}> Cancel Request </Text>
      </TouchableOpacity>
    )}
  </View>
);

// Function to render the correct icon based on the category
const renderIcon = (category) => {
  switch (category) {
    case "Paper":
      return <FontAwesome5 name="newspaper" size={32} color="#4CAF50" />;
    case "Plastic":
      return (
        <MaterialCommunityIcons name="bottle-soda" size={32} color="#2196F3" />
      );
    case "Metal":
      return <FontAwesome5 name="tools" size={32} color="#FF9800" />;
    case "Clothes":
      return <FontAwesome5 name="tshirt" size={32} color="#E91E63" />;
    case "E-waste":
      return <FontAwesome5 name="laptop" size={32} color="#9C27B0" />;
    case "Glass":
      return <FontAwesome5 name="wine-bottle" size={32} color="#009688" />;
    default:
      return <AntDesign name="question" size={32} color="black" />;
  }
};

export default RequestDetails;
