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
import { useRouter } from "expo-router";
import QRCode from 'react-native-qrcode-svg';
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
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [userId, setUserId] = useState(null); // Initialize as null
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
          setUserId(passengerDetails._id); // Storing user ID (_id) from MongoDB
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPassengerDetails();
  }, []);

  const downloadQRCode = async () => {
    if (!userId) {
      alert("Error: Unable to fetch user ID for QR Code");
      return;
    }
    
    try {
      // Use the cache directory to save the QR code as an image file
      const filePath = `${FileSystem.cacheDirectory}qr-code.png`;
      
      const qrRef = qrCodeRef.current;
      if (qrRef) {
        // Get the QR code data in Base64 format
        qrRef.toDataURL(async (data) => {
          // Append the proper prefix for Base64 image
          const base64Data = `data:image/png;base64,${data}`;
          
          // Write the file to the filesystem
          await FileSystem.writeAsStringAsync(filePath, data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // Share the QR code image
          await Sharing.shareAsync(filePath);
        });
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const qrCodeRef = React.useRef(null); // Reference to the QR code

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
          <ProfileItem icon="person-outline" label="Full Name" value={userName} />
          <ProfileItem icon="mail-outline" label="Email Address" value={email} />
          <ProfileItem icon="phone-portrait-outline" label="Mobile Number" value={contact} />
          <ProfileItem icon="male-female-outline" label="Gender" value={gender} />

          {/* Conditionally render QR Code */}
          {userId ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text className="text-lg font-bold">Your QR Code</Text>
              <QRCode
                value={userId} // Storing only the _id (userId) in the QR code
                size={200}
                getRef={qrCodeRef} // Ref to download the QR code
              />
            </View>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Loading QR Code...
            </Text>
          )}

          {/* Download QR Code Button */}
          {userId && (
            <TouchableOpacity
              onPress={downloadQRCode}
              style={{
                backgroundColor: '#0C6C41',
                padding: 10,
                borderRadius: 5,
                marginTop: 20,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Download QR Code
              </Text>
            </TouchableOpacity>
          )}
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
