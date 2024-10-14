import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Using router for navigation
import QRCode from "react-native-qrcode-svg"; // Import QRCode component

const ProfileItem = ({ icon, label, value }) => (
  <View className="flex-row items-center py-3 border-b border-gray-200">
    <Ionicons name={icon} size={20} color="#000" />
    <View className="flex-1 ml-3">
      <Text className="text-sm text-black"> {label} </Text>
      <Text className="text-xs text-gray-600"> {value} </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </View>
);

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  const router = useRouter(); // Router for navigation

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
  }, []);

  const userData = {
    fullName: userName,
    email: email,
    mobileNumber: contact,
    gender: gender
  };

  // Handle logout by clearing AsyncStorage and navigating to sign-in screen
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("passengerDetails"); // Clear user data from AsyncStorage
      router.replace("/(auth)/sign-in"); // Navigate to sign-in screen
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0C6C41] text-white">
      {/* Header Section */}
      <View className="bg-[#0C6C41] p-4 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white"> Profile </Text>

        {/* Log Out Button in Header */}
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="bg-white">
        <View className="p-6">
          <Text className="mb-3 text-lg font-bold"> Your Info </Text>
          <ProfileItem
            icon="person-outline"
            label="Full Name"
            value={userData.fullName}
          />
          <ProfileItem
            icon="mail-outline"
            label="Email Address"
            value={userData.email}
          />
          <ProfileItem
            icon="phone-portrait-outline"
            label="Mobile Number"
            value={userData.mobileNumber}
          />
          <ProfileItem
            icon="calendar-outline"
            label="Birthday"
            value="Add Birthday"
          />
          <ProfileItem
            icon="male-female-outline"
            label="Gender"
            value={userData.gender}
          />
        </View>

        {/* QR Code Section */}
        <View className="p-6">
          <Text className="mb-3 text-lg font-bold"> Your QR Code </Text>
          <View className="items-center justify-center">
            {/* Only show QR Code if email or contact is available */}
            {email || contact ? (
              <QRCode
                value={email || contact} // You can use any unique data for generating the QR code
                size={150} // Set the size of the QR code
                color="#000"
                backgroundColor="#FFF"
              />
            ) : (
              <Text className="text-sm text-red-600">
                {" "}
                QR code cannot be generated: Missing user data{" "}
              </Text>
            )}
            <Text className="mt-2 text-sm text-gray-600">
              Scan this QR code to get user details
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
