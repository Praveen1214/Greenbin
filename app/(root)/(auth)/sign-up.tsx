import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  StatusBar
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { icons, images } from "@/constants";
import { useRouter } from "expo-router";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const router = useRouter();
  const route = useRoute();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: ""
  });
  const { contact } = route.params || {};

  const scrollViewRef = useRef(null);

  const handleSubmit = async () => {
    if (!form.firstname || !form.lastname || !form.email || !form.gender) {
      Alert.alert("Warning", "Please fill in all fields");
      return;
    }
    try {
      const response = await axios.post(
        `http://192.168.43.196:5000/api/passenger/register`,
        {
          firstname: form.firstname,
          lastname: form.lastname,
          email: form.email,
          gender: form.gender,
          contact
        }
      );

      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.post(
          `http://192.168.43.196:5000/api/passenger/login`,
          {
            contact
          }
        );

        if (response.data.status === "Login Success") {
          const passengerDetails = response.data.loginPassenger;

          // Store user details in AsyncStorage
          await AsyncStorage.setItem(
            "passengerDetails",
            JSON.stringify(passengerDetails)
          );

          Alert.alert("Success", "Registration successfully", [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/(tabs)/home"
                })
            }
          ]);
        } else {
          Alert.alert(
            "Registarion Failed",
            "Something went wrong. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error registration:", error);
      Alert.alert("Error", "Failed to registration. Please try again.");
    }
  };

  const GenderOption = ({ value, icon }) => (
    <TouchableOpacity
      onPress={() => setForm({ ...form, gender: value })}
      className={`flex-row items-center justify-center p-4 rounded-full ${
        form.gender === value
          ? "border border-[#169958] bg-[#169958]"
          : "bg-gray-200"
      }`}
    >
      <Ionicons
        name={icon}
        size={24}
        color={form.gender === value ? "white" : "black"}
      />
      <Text
        className={`ml-2 font-semibold ${
          form.gender === value ? "text-white" : "text-black"
        }`}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-white">
            <View className="relative w-full h-[250px]">
              <Image
                source={images.signUpCar}
                className="z-1 absolute top-0 left-0 right-0 w-full h-[250px]"
              />
              <Text className="z-0 text-2xl text-[black] font-JakartaSemiBold absolute bottom-5 left-5">
                Create Your Profile
              </Text>
            </View>
            <View className="px-6 pb-6 -mt-1 bg-white rounded-t-3xl">
              <InputField
                placeholder="Enter your first name"
                label="Name"
                icon={icons.person}
                value={form.firstname}
                onChangeText={(value) => setForm({ ...form, firstname: value })}
              />
              <InputField
                placeholder="Enter your last name"
                icon={icons.person}
                value={form.lastname}
                onChangeText={(value) => setForm({ ...form, lastname: value })}
              />
              <InputField
                placeholder="Enter your email"
                icon={icons.email}
                textContentType="emailAddress"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
              />

              <Text className="mt-3 mb-3 text-sm font-semibold"> </Text>
              <View className="flex-row justify-between mb-6">
                <View className="flex-1 mr-3">
                  <GenderOption value="Male" icon="male" />
                </View>
                <View className="flex-1 ml-3">
                  <GenderOption value="Female" icon="female" />
                </View>
              </View>

              <CustomButton
                title="Create Account"
                onPress={handleSubmit}
                className="mt-5"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </>
  );
};

export default SignUp;
