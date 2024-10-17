import React, { useState } from "react";
import { View, FlatList, Text, Modal, TouchableOpacity, Alert, SafeAreaView, StatusBar } from "react-native";
import tw from "twrnc";
import { useRequests } from "../hooks/useRequests";
import RequestDetails from "@/components/RequestDetails";
import EditRequestForm from "@/components/EditRequestForm";
import RequestItem from "@/components/RequestItem";
import { cancelRequest, updateRequest } from "../services/RequestService";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const RequestsList = () => {
  const { requests, loadRequests } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleCancelRequest = async (item) => {
    try {
      await cancelRequest(item._id);
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
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={tw`bg-[#4CAF50] px-4 py-3 flex-row items-center shadow-md`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 rounded-full bg-white bg-opacity-20`}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`ml-4 text-2xl font-bold text-white`}>Requests</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-4`}
        ItemSeparatorComponent={() => <View style={tw`h-4`} />}
        ListEmptyComponent={() => (
          <View style={tw`flex-1 items-center justify-center py-20`}>
            <Text style={tw`text-lg text-gray-500`}>No requests found</Text>
          </View>
        )}
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
        <View style={tw`flex-1 bg-black bg-opacity-50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl h-5/6 px-4 pt-6 pb-8`}>
            <View style={tw`absolute right-4 top-4 z-10`}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedRequest(null);
                  setIsEditing(false);
                }}
                style={tw`p-2 rounded-full bg-gray-200`}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {selectedRequest && !isEditing && (
              <RequestDetails
                item={selectedRequest}
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
    </SafeAreaView>
  );
};

export default RequestsList;