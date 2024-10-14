import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ProfileItem = ({ icon, label, value }) => (
  <View className="flex-row items-center py-3 border-b border-gray-200">
    <Ionicons name={icon} size={20} color="#000" />
    <View className="flex-1 ml-3">
      <Text className="text-sm text-black">{label}</Text>
      <Text className="text-xs text-gray-600">{value}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </View>
);

const Profile = () => {
  const [userData, setUserData] = useState({
    _id: "",
    fullName: "",
    email: "",
    contact: "",
    gender: "",
    address: ""
  });

  const router = useRouter();
  const qrRef = useRef();

  useEffect(() => {
    const getPassengerDetails = async () => {
      try {
        const passengerDetailsString = await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setUserData({
            _id: passengerDetails._id || "",
            fullName: `${passengerDetails.firstname} ${passengerDetails.lastname}`,
            email: passengerDetails.email,
            contact: passengerDetails.contact,
            gender: passengerDetails.gender,
            address: passengerDetails.address || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPassengerDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("passengerDetails");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
      console.error("Error logging out:", error);
    }
  };

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    _id: userData._id,
    fullName: userData.fullName,
    email: userData.email,
    contact: userData.contact,
    address: userData.address
  });

  const downloadQRCode = async () => {
    try {
      const uri = await qrRef.current.capture();
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const filename = `${FileSystem.documentDirectory}MyQRCode_${Date.now()}.png`;
      await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filename);
      } else {
        Alert.alert("Saved", `QR Code saved to ${filename}`);
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert("Error", "Failed to save QR code. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C6C41] text-white">
      <View className="bg-[#0C6C41] p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="bg-white">
        <View className="p-6">
          <Text className="mb-3 text-lg font-bold">Your Info</Text>
          <ProfileItem icon="person-outline" label="Full Name" value={userData.fullName} />
          <ProfileItem icon="mail-outline" label="Email Address" value={userData.email} />
          <ProfileItem icon="phone-portrait-outline" label="Mobile Number" value={userData.contact} />
          <ProfileItem icon="male-female-outline" label="Gender" value={userData.gender} />
          <ProfileItem icon="home-outline" label="Address" value={userData.address || "Add Address"} />
        </View>

        <View className="p-6">
          <Text className="mb-3 text-lg font-bold">Your QR Code</Text>
          <View className="items-center justify-center">
            {userData._id ? (
              <ViewShot ref={qrRef} options={{ format: "png", quality: 0.9 }}>
                <QRCode
                  value={qrCodeData}
                  size={200}
                  color="#000"
                  backgroundColor="#FFF"
                />
              </ViewShot>
            ) : (
              <Text className="text-sm text-red-600">QR code cannot be generated: Missing user data</Text>
            )}
            <Text className="mt-2 text-sm text-gray-600">
              Scan this QR code to get user details for garbage collection
            </Text>
            <TouchableOpacity 
              onPress={downloadQRCode}
              className="mt-4 mb-6 bg-[#0C6C41] py-2 px-4 rounded-full"
            >
              <Text className="text-white font-semibold">Download QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;