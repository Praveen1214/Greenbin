import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc"; // Tailwind CSS for React Native
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Requestitem = () => {
  const [quantity, setQuantity] = useState(5);
  const navigation = useNavigation(); // Hook for navigation inside the component

  const pricePerKg = 250;
  const totalSellPrice = quantity * pricePerKg;

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <TailwindProvider>
      <View className="flex-1 bg-gray-100">
        <View
          style={{ backgroundColor: "#0C6C41", padding: 16, marginTop: 24 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "white",
                marginLeft: 16
              }}
            >
              Requesr Items
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Card */}
          <View className="p-5 mt-4 mb-5 ml-4 mr-4 bg-green-100 rounded-lg">
            <View className="flex-row justify-between p-5">
              {/* Left Section: Product Info */}
              <View className="items-start mt-12">
                <MaterialCommunityIcons
                  name="bottle-soda"
                  size={50}
                  color="black"
                />
                <Text className="mt-2 text-lg">Plastic</Text>
              </View>

              {/* Right Section: Price and Quantity */}
              <View className="flex-col items-end ">
                <View className="mb-4 ">
                  <Text className="mb-2 text-sm text-gray-700">Sell Price</Text>
                  <Text className="text-sm text-gray-700">
                    1 kg - LKR 250.00
                  </Text>
                </View>
                <Text className="mb-4 ml-4 mr-2 text-lg">Quantity (kg)</Text>
                <View className="flex-row items-center mr-1">
                  <TouchableOpacity
                    onPress={handleDecrement}
                    className="w-6 p-1 bg-green-500 rounded"
                  >
                    <Text className="items-center ml-1 text-lg">-</Text>
                  </TouchableOpacity>
                  <Text className="mx-5 text-lg">{quantity}</Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    className="w-6 p-1 bg-green-500 rounded"
                  >
                    <Text className="ml-1 text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Total Price Section */}
            <View className="ml-48">
              <Text className="text-xl font-bold text-gray-900">
                Total Price
              </Text>
              <Text className="text-xl font-bold text-red-500">
                LKR {totalSellPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Stepper */}
          <View style={tw`flex-row items-center justify-between p-4 mt-4`}>
            {[1, 2, 3].map((step) => (
              <View key={step} style={tw`flex-row items-center`}>
                <View
                  style={tw`w-8 h-8 rounded-full border-2 ${
                    step === 1
                      ? "bg-green-500 border-green-500"
                      : " border-green-300"
                  } flex items-center justify-center`}
                >
                  <Text
                    style={tw`${step === 1 ? "text-white" : "text-black"} font-bold`}
                  >
                    {String(step).padStart(2, "0")}
                  </Text>
                </View>
                {step < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
              </View>
            ))}
          </View>

          {/* Request Details Form */}
          <View className="p-4 mb-5">
            <Text className="mb-2 text-lg font-semibold">Factory Name</Text>
            <TextInput
              value="Cleantech (Pvt) Ltd"
              editable={false}
              className="p-3 mb-3 bg-gray-100 border border-gray-300 rounded-md"
            />
            <Text className="mb-2 text-lg font-semibold">Factory Address</Text>
            <TextInput
              placeholder="Enter factory address"
              className="p-3 mb-3 border border-gray-300 rounded-md"
            />
            <Text className="mb-2 text-lg font-semibold">
              Garbage Special type
            </Text>
            <TextInput
              value="Plastic"
              editable={false}
              className="p-3 bg-gray-100 border border-gray-300 rounded-md"
            />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            className="p-4 mb-4 ml-4 mr-4 bg-black rounded-lg "
            onPress={() => navigation.navigate("RequestedItemPayment")}
          >
            <Text className="text-lg text-center text-white">NEXT</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TailwindProvider>
  );
};

export default Requestitem;
