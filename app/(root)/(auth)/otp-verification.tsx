import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


const OTPVerificationScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  const route = useRoute();
  const { contact } = route.params || {};
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleNext = async () => {
    if (otp.join("").length === 4) {
      setIsLoading(true);
      try {
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.post(`http://192.168.91.196:5000/api/passenger/login`, {
          contact
        });

        if (response.data.status === "Login Success") {
          const passengerDetails = response.data.loginPassenger;

          // Store user details in AsyncStorage
          await AsyncStorage.setItem('passengerDetails', JSON.stringify(passengerDetails));

          // Navigate to HomeScreen
          router.push({
            pathname: "/(tabs)/home",
          });
        } else {
          Alert.alert("Login Failed", "Contact number is incorrect");
        }
        
      } catch (error) {
        router.push({
          pathname: "/(auth)/sign-up",
          params: {
            contact
          }
        });
        shakeInputs();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar
          barStyle={Platform.OS === "ios" ? "dark-content" : "default"}
          backgroundColor="white"
        />

        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute z-10 top-12 left-2"
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <View className="items-center justify-center flex-1 px-6">
          <Text className="mb-2 text-xl font-semibold text-center">
            Enter 4-Digit Verification Code
          </Text>
          <Text className="mb-6 text-lg text-center">
            Sent to {contact}{" "}
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="font-semibold text-green-600">Change</Text>
            </TouchableOpacity>
          </Text>

          <Animated.View
            className="flex-row justify-center mb-6 space-x-4"
            style={{ transform: [{ translateX: shakeAnimation }] }}
          >
            {otp.map((digit, index) => (
              <View
                key={index}
                className={`w-14 h-14 border-2 ${
                  digit ? "border-green-600" : "border-gray-300"
                } rounded-lg overflow-hidden`}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-full h-full text-2xl text-center"
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              </View>
            ))}
          </Animated.View>

          <View className="flex-row justify-between w-full px-4 mb-6">
            <TouchableOpacity
              onPress={() => {
                if (countdown === 0) {
                  setCountdown(30);
                  // Implement resend logic here
                }
              }}
              disabled={countdown > 0}
            >
              <Text
                className={`text-sm ${countdown > 0 ? "text-gray-400" : "text-green-600"}`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className={`w-full h-12 rounded-lg ${
              otp.join("").length === 4 ? "bg-green-600" : "bg-gray-300"
            } justify-center items-center`}
            disabled={otp.join("").length !== 4 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-lg font-bold text-white">Verify</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;
