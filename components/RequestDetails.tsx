import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import tw from "twrnc";

const RequestDetails = ({ item, onClose, onEdit, onCancelRequest }) => (
  <View style={tw`flex-1 p-6 bg-white rounded-lg`}>
    <View style={tw`flex-row justify-between mb-4`}>
      <TouchableOpacity onPress={onClose}>
        <AntDesign name="close" size={24} color="black" />
      </TouchableOpacity>
      {item.status === "Pending" && (
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={24} color="blue" />
        </TouchableOpacity>
      )}
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={tw`flex-row items-center mb-4`}>
        {/* Use AntDesign from @expo/vector-icons to display the icon */}
        <AntDesign name={getIconName(item.category)} size={24} color="black" />
        <Text style={tw`ml-4 text-2xl font-bold`}>{item.category}</Text>
      </View>
      <Text style={tw`mb-2 text-lg font-semibold`}>Request Details</Text>
      <View style={tw`p-4 mb-4 bg-gray-100 rounded-lg`}>
        <Text style={tw`mb-2`}>Quantity: {item.quantity} kg</Text>
        <Text style={tw`mb-2`}>Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}</Text>
        <Text style={tw`mb-2`}>Status: {item.status}</Text>
        <Text style={tw`mb-2`}>Factory Name: {item.factoryName}</Text>
        <Text style={tw`mb-2`}>Factory Address: {item.factoryAddress}</Text>
      </View>
    </ScrollView>
    {item.status === "Pending" && (
      <TouchableOpacity
        style={tw`px-4 py-2 mt-4 bg-red-500 rounded-lg`}
        onPress={() => onCancelRequest(item)}
      >
        <Text style={tw`font-bold text-white`}>Cancel Request</Text>
      </TouchableOpacity>
    )}
  </View>
);

const getIconName = (category) => {
  switch (category) {
    case 'Metal':
      return 'smileo'; // Use the AntDesign smile icon as an example
    case 'Plastic':
      return 'rocket1'; // Another icon from AntDesign
    default:
      return 'questioncircleo'; // A default icon
  }
};

export default RequestDetails;
