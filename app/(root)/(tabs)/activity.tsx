import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Feather
} from "@expo/vector-icons";
import axios from "axios";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

// Function to get the appropriate icon based on the category
const getIcon = (category) => {
  switch (category) {
    case "Paper":
      return <FontAwesome5 name="newspaper" size={50} color="black" />;
    case "Plastic":
      return (
        <MaterialCommunityIcons name="bottle-soda" size={50} color="black" />
      );
    case "Metal":
      return <FontAwesome5 name="tools" size={50} color="black" />;
    case "Clothes":
      return <FontAwesome5 name="tshirt" size={50} color="black" />;
    case "E waste":
      return <FontAwesome5 name="laptop" size={50} color="black" />;
    case "Glass":
      return <FontAwesome5 name="wine-bottle" size={50} color="black" />;
    default:
      return null;
  }
};

// Request Details component
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
        {getIcon(item.category)}
        <Text style={tw`ml-4 text-2xl font-bold`}>{item.category}</Text>
      </View>
      <Text style={tw`mb-2 text-lg font-semibold`}>Request Details</Text>
      <View style={tw`p-4 mb-4 bg-gray-100 rounded-lg`}>
        <Text style={tw`mb-2`}>Quantity: {item.quantity} kg</Text>
        <Text style={tw`mb-2`}>
          Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}
        </Text>
        <Text style={tw`mb-2`}>
          Status:{" "}
          <Text
            style={tw`${item.status === "Approved" ? "text-green-500" : "text-yellow-500"} font-semibold`}
          >
            {item.status}
          </Text>
        </Text>
        <Text style={tw`mb-2`}>Factory Name: {item.factoryName}</Text>
        <Text style={tw`mb-2`}>Factory Address: {item.factoryAddress}</Text>
      </View>
      <Text style={tw`mb-2 text-lg font-semibold`}>Payment Information</Text>
      <View style={tw`p-4 bg-gray-100 rounded-lg`}>
        <Text style={tw`mb-2`}>Beneficiary Name: {item.beneficiaryName}</Text>
        <Text style={tw`mb-2`}>Bank: {item.bank}</Text>
        <Text>Account No: {item.accountNo}</Text>
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

// Edit Request Form component
const EditRequestForm = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState(item);

  const handleChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedItem);
  };

  return (
    <ScrollView style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`mb-4 text-2xl font-bold`}>Edit Request</Text>
      <Text style={tw`mb-2 mb-3 font-bold`}>
        Category: {editedItem.category}
      </Text>
      <Text style={tw`mb-2`}>Factory Name</Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.factoryName}
        onChangeText={(value) => handleChange("factoryName", value)}
        placeholder="Factory Name"
      />
      <Text style={tw`mb-2`}>Factory Address</Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.factoryAddress}
        onChangeText={(value) => handleChange("factoryAddress", value)}
        placeholder="Factory Address"
      />
      <Text style={tw`mb-2`}>Beneficiary Name</Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.beneficiaryName}
        onChangeText={(value) => handleChange("beneficiaryName", value)}
        placeholder="Beneficiary Name"
      />
      <Text style={tw`mb-2`}>Bank</Text>
      <View style={tw`p-2 mb-4 border border-gray-300 rounded-lg`}>
        <Picker
          selectedValue={editedItem.bank} // Set the selected value from editedItem.bank
          onValueChange={(itemValue) => handleChange("bank", itemValue)} // Update the bank field on change
        >
          <Picker.Item label="Select Bank" value="" />
          <Picker.Item label="BOC" value="BOC" />
          <Picker.Item label="Commercial Bank" value="Commercial Bank" />
          <Picker.Item label="DFCC Bank" value="DFCC Bank" />
          <Picker.Item label="HNB" value="HNB" />
          <Picker.Item label="NSB" value="NSB" />
          <Picker.Item label="Peoples Bank" value="Peoples Bank" />
          <Picker.Item label="RDB" value="RDB" />
          <Picker.Item label="SDB" value="SDB" />
          <Picker.Item label="Sampath Bank" value="Sampath Bank" />
          <Picker.Item label="Seylan Bank" value="Seylan Bank" />
          <Picker.Item label="Union Bank" value="Union Bank" />
        </Picker>
      </View>
      <Text style={tw`mb-2`}>Account No.</Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.accountNo}
        onChangeText={(value) => handleChange("accountNo", value)}
        placeholder="Account No"
        keyboardType="numeric"
      />
      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-blue-500 rounded`}
          onPress={handleSave}
        >
          <Text style={tw`font-bold text-white`}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-gray-500 rounded`}
          onPress={onCancel}
        >
          <Text style={tw`font-bold text-white`}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Requests List component
const RequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getPassengerDetails = async () => {
      try {
        const passengerDetailsString =
          await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setUserName(
            passengerDetails.firstname + " " + passengerDetails.lastname
          );
          setEmail(passengerDetails.email);
          setContact(passengerDetails.contact);
          setGender(passengerDetails.gender);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPassengerDetails();

    if (contact) {
      fetchRequests();
    }
  }, [contact]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.43.196:5000/api/requestitem/getallrequestitems/${contact}`
      );
      setRequests(response.data.req);
    } catch (error) {
      console.error("Error fetching requests:", error);
      Alert.alert("Error", "Failed to fetch requests. Please try again later.");
    }
  };

  const handleCancelRequest = async (item) => {
    try {
      // Update the request status to "Canceled" using the backend API
      const response = await axios.put(
        `http://192.168.43.196:5000/api/requestitem/cancelrequest/${item._id}`
      );

      if (response.status === 200) {
        // If the API call succeeds, update the local state with the new status from the response
        const updatedRequest = response.data.updatedAppointment;

        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === item._id
              ? { ...req, status: updatedRequest.status }
              : req
          )
        );
        setSelectedRequest(null); // Close the modal
        Alert.alert("Success", "Request has been canceled");
      } else {
        Alert.alert("Error", "Failed to cancel request. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      Alert.alert("Error", "Failed to cancel request. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setSelectedRequest(item);
  };

  const handleSave = async (editedItem) => {
    try {
      const response = await axios.put(
        `http://192.168.43.196:5000/api/requestitem/updaterequest/${editedItem._id}`,
        editedItem
      );
      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req._id === editedItem._id ? editedItem : req
          )
        );
        setIsEditing(false);
        setSelectedRequest(null);
        Alert.alert("Success", "Request updated successfully");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert("Error", "Failed to update request. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={tw`p-4 mb-4 bg-white rounded-lg shadow-md`}>
      <View style={tw`flex-row items-center justify-between mb-2`}>
        <View style={tw`flex-row items-center`}>
          {getIcon(item.category)}
          <Text style={tw`ml-2 text-lg font-bold`}>{item.category}</Text>
        </View>
        {item.status === "Pending" && (
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Feather name="edit" size={24} color="blue" />
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`flex-row justify-between`}>
        <Text>Quantity(kg): {item.quantity}</Text>
        <Text>Total Sell Price: LKR {item.totalSellPrice.toFixed(2)}</Text>
      </View>
      <Text
        style={tw`mt-2 ${item.status === "Approved" ? "text-green-500" : item.status === "Canceled" ? "text-red-500" : "text-yellow-500"}`}
      >
        {item.status} {/* Displays status (Pending, Approved, Canceled) */}
      </Text>
      <TouchableOpacity
        style={tw`mt-2`}
        onPress={() => setSelectedRequest(item)}
      >
        <Text style={tw`text-blue-500`}>View Request Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-[#4CAF50] p-10 flex-row items-center mb-5`}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`ml-4 text-2xl font-bold text-white`}>Requests</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedRequest !== null}
        onRequestClose={() => {
          setSelectedRequest(null);
          setIsEditing(false);
        }}
      >
        <View
          style={tw`items-center justify-center flex-1 bg-black bg-opacity-50`}
        >
          <View style={tw`w-11/12 overflow-hidden bg-white rounded-lg h-5/6`}>
            {selectedRequest && !isEditing && (
              <RequestDetails
                item={selectedRequest}
                onClose={() => {
                  setSelectedRequest(null);
                  setIsEditing(false);
                }}
                onEdit={() => setIsEditing(true)}
                onCancelRequest={handleCancelRequest} // Pass cancel handler
              />
            )}
            {selectedRequest && isEditing && (
              <EditRequestForm
                item={selectedRequest}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RequestsList;
