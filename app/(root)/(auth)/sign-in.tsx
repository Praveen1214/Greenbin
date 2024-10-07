import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PhoneNumberScreen = () => {
  const [contact, setPhoneNumber] = useState("");
  const router = useRouter();
  const route = useRoute();

  const handleNext = () => {
    if (contact.length === 9) {
      router.push({
        pathname: "/(auth)/otp-verification",
        params: {
          contact: `+94${contact}`
        }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-white">
        {/* Show the Status Bar */}
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
          backgroundColor="white"
        />

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute z-10 top-10 left-3"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <View className="justify-start flex-1 px-5 pt-28">
          <Text className="mb-2 text-2xl font-bold text-center">
            Enter your mobile number
          </Text>
          <Text className="mb-8 text-base text-center text-gray-500">
            We'll send you a verification code.
          </Text>

          <View className="flex-row mb-4 border border-gray-200 rounded-lg">
            <View className="px-4 py-3 border-r border-gray-200">
              <Text className="text-lg"> +94 </Text>
            </View>
            <TextInput
              className="flex-1 px-4 py-3 text-m"
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setPhoneNumber}
              maxLength={9}
              onSubmitEditing={handleNext}
            />
          </View>

          {/* Display an error message if phone number length is not valid */}
          {contact.length > 0 && contact.length < 9 && (
            <Text className="mb-4 text-center text-red-500">
              Please enter a valid 9 - digit number.
            </Text>
          )}

          <TouchableOpacity
            className={`mt-5 py-4 rounded-lg ${contact.length === 9 ? "bg-green-600" : "bg-gray-400 opacity-70"}`}
            onPress={handleNext}
            disabled={contact.length !== 9}
          >
            <Text className="font-bold text-center text-white text-m">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneNumberScreen;
