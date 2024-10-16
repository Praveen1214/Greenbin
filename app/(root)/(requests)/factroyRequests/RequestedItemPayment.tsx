import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc"; // Tailwind CSS for React Native
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RequestedItemPayment = () => {
  const [quantity, setQuantity] = useState(5);
  const [bank, setBank] = useState("");
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
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-[#0C6C41] p-4 mt-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`ml-4 text-2xl font-bold text-white`}>Payment</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={tw`p-5 mx-4 mt-4 mb-5 bg-green-100 rounded-lg`}>
          <View style={tw`flex-row justify-between p-5`}>
            {/* Left Section: Product Info */}
            <View style={tw`items-start mt-12`}>
              <FontAwesome5 name="bottle-plastic" size={50} color="black" />
              <Text style={tw`mt-2 text-lg`}>Plastic</Text>
            </View>

            {/* Right Section: Price and Quantity */}
            <View style={tw`items-end`}>
              <View style={tw`mb-4`}>
                <Text style={tw`mb-2 text-sm text-gray-700`}>Sell Price</Text>
                <Text style={tw`text-sm text-gray-700`}>1 kg - LKR 250.00</Text>
              </View>
              <Text style={tw`mb-4 ml-4 mr-2 text-lg`}>Quantity (kg)</Text>
              <View style={tw`flex-row items-center mr-1`}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={tw`w-6 p-1 bg-green-500 rounded`}
                >
                  <Text style={tw`text-lg text-center`}>-</Text>
                </TouchableOpacity>
                <Text style={tw`mx-5 text-lg`}>{quantity}</Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={tw`w-6 p-1 bg-green-500 rounded`}
                >
                  <Text style={tw`text-lg text-center`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Total Price Section */}
          <View style={tw`ml-48`}>
            <Text style={tw`text-xl font-bold text-gray-900`}>Total Price</Text>
            <Text style={tw`text-xl font-bold text-red-500`}>
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
                    : "border-green-300"
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

        {/* Payment Details */}
        <Text style={tw`ml-4 text-2xl font-semibold`}>Payment Details</Text>

        {/* Request Details Form */}
        <View style={tw`p-4 mb-5`}>
          <Text style={tw`mb-2 text-lg text-gray-700`}>Beneficiary Name</Text>
          <TextInput
            value=""
            placeholder="Enter name"
            editable={false}
            style={tw`p-3 mb-3 bg-gray-100 border border-gray-300 rounded-md`}
          />

          <View style={tw`p-2 mb-4 border border-gray-300 rounded-lg`}>
            <Picker
              selectedValue={bank}
              onValueChange={(itemValue) => setBank(itemValue)}
            >
              <Picker.Item label="Select Bank" value="" />
              <Picker.Item label="BOC" value="BOC" />
              <Picker.Item label="Commercial Bank" value="Commercial Bank" />
              <Picker.Item label="DFCC Bank" value="DFCC Bank" />
              <Picker.Item label="HNB" value="HNB" />
              <Picker.Item label="NSB" value="NSB" />
              <Picker.Item label="Peoples Bank" value="Peoples Bank" />
              <Picker.Item label="RDB" value="RDB" />
              <Picker.Item label="SDB" value="SDB" />
              <Picker.Item label="Sampath Bank" value="Sampath Bank" />
              <Picker.Item label="Seylan Bank" value="Seylan Bank" />
              <Picker.Item label="Union Bank" value="Union Bank" />
            </Picker>
          </View>

          <Text style={tw`mb-2 text-lg text-gray-700`}>Account No.</Text>
          <TextInput
            value=""
            placeholder="Enter account number"
            editable={false}
            style={tw`p-3 bg-gray-100 border border-gray-300 rounded-md`}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
          onPress={() => navigation.navigate("")}
        >
          <Text style={tw`text-lg text-center text-white`}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RequestedItemPayment;
