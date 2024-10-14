// RequestsList.tsx (activity.tsx)
import React, { useState } from "react";
import { View, FlatList, Text, Modal } from "react-native";
import tw from "twrnc";
import { useRequests } from "../hooks/useRequests";
import RequestDetails from "@/components/RequestDetails";
import EditRequestForm from "@/components/EditRequestForm";
import RequestItem from "@/components/RequestItem";
import { cancelRequest, updateRequest } from "../services/RequestService";
import { Alert } from "react-native";

const RequestsList = () => {
  const { requests, loadRequests } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelRequest = async (item) => {
    try {
      const updatedRequest = await cancelRequest(item._id);
      loadRequests();
      setSelectedRequest(null);
      Alert.alert("Success", "Request has been canceled");
    } catch (error) {
      Alert.alert("Error", "Failed to cancel request. Please try again.");
    }
  };

  const handleSave = async (editedItem) => {
    try {
      await updateRequest(editedItem);
      loadRequests();
      setIsEditing(false);
      setSelectedRequest(null);
      Alert.alert("Success", "Request updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update request. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <RequestItem
      item={item}
      onEdit={() => {
        setSelectedRequest(item);
        setIsEditing(true);
      }}
      onViewDetails={() => setSelectedRequest(item)}
    />
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
                onCancelRequest={handleCancelRequest}
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