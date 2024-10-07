import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';


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

const EmergencyContact = ({ icon, label, value }) => (
  <TouchableOpacity className="flex-1 p-4 mx-2 bg-white shadow-md rounded-xl">
    <View className="items-center mb-2">
      <View className="p-3 bg-red-100 rounded-full">
        <Ionicons name={icon} size={24} color="#DC2626" />
      </View>
    </View>
    <Text className="mb-1 text-sm font-bold text-center">{label}</Text>
    <Text className="text-xs text-center text-gray-600">{value}</Text>
  </TouchableOpacity>
);

const Profile = () => {

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
          setGender(passengerDetails.gender)
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPassengerDetails();
  }, []);

  // Simulated user data (to be replaced with MongoDB data in the future)
  const userData = {
    fullName: userName,
    email: email,
    mobileNumber: contact,
    gender: gender,
  };

  
  const platformSpecificStyle = Platform.select({
    ios: "mb-4",
    android: "mb-2",
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('passengerDetails');
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  
  return (
    <SafeAreaView className="flex-1 bg-[#0C6C41] text-white">
      <ScrollView className="bg-white">
        <View className="bg-[#0C6C41] p-4">
          <Text className="text-2xl font-bold text-white">Profile</Text>
        </View>

        <View className="p-6">
          <Text className="mb-3 text-lg font-bold">Your Info</Text>
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

        <View className="p-6 ">
          <Text className="mb-4 text-lg font-bold">Emergency Contacts</Text>
          <View className={`flex-row ${platformSpecificStyle}`}>
            <EmergencyContact
              icon="shield-checkmark"
              label="Police"
              value="119"
            />
            <EmergencyContact icon="medical" label="Ambulance" value="1990" />
          </View>
        </View>

        <TouchableOpacity className="bg-white border border-[#0C6C41] mx-6 my-2 p-3 rounded-lg" onPress={handleLogout}>
          <Text className="text-[#0C6C41] font-bold text-center text-base">
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
