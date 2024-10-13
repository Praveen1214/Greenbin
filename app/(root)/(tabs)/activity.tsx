import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from "react-native";
import { FontAwesome5, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";

const getIcon = (category) => {
  switch (category) {
    case "Paper":
      return <FontAwesome5 name="newspaper" size = { 50} color = "black" />;
    case "Plastic":
      return <MaterialCommunityIcons name="bottle-soda" size = { 50} color = "black" />;
    case "Metol":
      return <FontAwesome5 name="tools" size = { 50} color = "black" />;
    case "Clothes":
      return <FontAwesome5 name="tshirt" size = { 50} color = "black" />;
    case "E waste":
      return <FontAwesome5 name="laptop" size = { 50} color = "black" />;
    case "Glass":
      return <FontAwesome5 name="wine-bottle" size = { 50} color = "black" />;
    default:
      return null;
  }
};

const RequestDetails = ({ item, onClose }) => (
  <View style= { tw`flex-1 p-6 bg-white rounded-lg`}>
    <TouchableOpacity onPress={ onClose } style = { tw`self-end mb-4`}>
      <AntDesign name="close" size = { 24} color = "black" />
        </TouchableOpacity>
        < ScrollView showsVerticalScrollIndicator = { false} >
          <View style={ tw`flex-row items-center mb-4` }>
            { getIcon(item.category) }
            < Text style = { tw`ml-4 text-2xl font-bold`}> { item.category } </Text>
              </View>
              < Text style = { tw`mb-2 text-lg font-semibold`}> Request Details </Text>
                < View style = { tw`p-4 mb-4 bg-gray-100 rounded-lg`}>
                  <Text style={ tw`mb-2` }> Quantity: { item.quantity } kg </Text>
                    < Text style = { tw`mb-2`}> Total Sell Price: LKR { item.totalSellPrice.toFixed(2) } </Text>
                      < Text style = { tw`mb-2`}> Status: <Text style={ tw`${item.status === "Approved" ? "text-green-500" : "text-yellow-500"} font-semibold` }> { item.status } < /Text></Text >
                        <Text style={ tw`mb-2` }> Factory Name: { item.factoryName } </Text>
                          < Text style = { tw`mb-2`}> Factory Address: { item.factoryAddress } </Text>
                            </View>
                            < Text style = { tw`mb-2 text-lg font-semibold`}> Payment Information </Text>
                              < View style = { tw`p-4 bg-gray-100 rounded-lg`}>
                                <Text style={ tw`mb-2` }> Beneficiary Name: { item.beneficiaryName } </Text>
                                  < Text style = { tw`mb-2`}> Bank: { item.bank } </Text>
                                    < Text > Account No: { item.accountNo } </Text>
                                      </View>
                                      </ScrollView>
                                      </View>
);

const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://192.168.43.196:5000/api/requestitem/getallrequestitems"
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style= { tw`p-4 mb-4 bg-white rounded-lg shadow-md`
}>
  <View style={ tw`flex-row items-center mb-2` }>
    { getIcon(item.category) }
    < Text style = { tw`ml-2 text-lg font-bold`}> { item.category } </Text>
      </View>
      < View style = { tw`flex-row justify-between`}>
        <Text>Quantity(kg): { item.quantity } </Text>
          < Text > Total Sell Price LKR { item.totalSellPrice.toFixed(2) } </Text>
            </View>
            < Text style = { tw`mt-2 ${item.status === "Approved" ? "text-green-500" : "text-yellow-500"}`}>
              { item.status }
              </Text>
              < TouchableOpacity style = { tw`mt-2`} onPress = {() => setSelectedRequest(item)}>
                <Text style={ tw`text-blue-500` }> View Request Details </Text>
                  </TouchableOpacity>
                  </View>
  );

return (
  <View style= { tw`flex-1 p-4 bg-gray-100`}>
    <Text style={ tw`mb-4 text-2xl font-bold` }> Requests </Text>
      < FlatList
data = { requests }
renderItem = { renderItem }
keyExtractor = {(item) => item._id}
showsVerticalScrollIndicator = { false}
  />
  <Modal
        animationType="slide"
transparent = { true}
visible = { selectedRequest !== null}
onRequestClose = {() => setSelectedRequest(null)}
      >
  <View style={ tw`items-center justify-center flex-1 bg-black bg-opacity-50` }>
    <View style={ tw`w-11/12 overflow-hidden bg-white rounded-lg h-5/6` }>
      { selectedRequest && (
        <RequestDetails item={ selectedRequest } onClose = {() => setSelectedRequest(null)} />
            )}
</View>
  </View>
  </Modal>
  </View>
  );
};

export default RequestsList;