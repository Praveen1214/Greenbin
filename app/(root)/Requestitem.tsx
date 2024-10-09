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
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Requestitem = () => {
  const [quantity, setQuantity] = useState(5);
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

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

  const getGarbageTypeIcon = () => {
    switch (category) {
      case "Paper":
        return <FontAwesome5 name="newspaper" size={50} color="black" />;
      case "Plastic":
        return (
          <MaterialCommunityIcons name="bottle-soda" size={50} color="black" />
        );
      case "Metol":
        return <FontAwesome5 name="tools" size={50} color="black" />;
      case "Clothes":
        return <FontAwesome5 name="tshirt" size={50} color="black" />;
      case "E waste":
        return <FontAwesome5 name="laptop" size={50} color="black" />;
      case "Glass":
        return <FontAwesome5 name="wine-bottle" size={50} color="black" />;
      default:
        return null;
    }
  };

  return (
    <TailwindProvider>
      <View style={tw`flex-1 bg-gray-100`}>
        <View style={tw`bg-[#0C6C41] p-4 mt-6`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => router.back()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`ml-4 text-2xl font-bold text-white`}>
              Request Items
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Card */}
          <View style={tw`p-5 mx-4 mt-4 mb-5 bg-green-100 rounded-lg`}>
            <View style={tw`flex-row justify-between p-5`}>
              {/* Left Section: Product Info */}
              <View style={tw`items-start mt-12`}>
                {getGarbageTypeIcon()}
                <Text style={tw`mt-2 text-lg`}> {category} </Text>
              </View>

              {/* Right Section: Price and Quantity */}
              <View style={tw`flex-col items-end`}>
                <View style={tw`mb-4`}>
                  <Text style={tw`mb-2 text-sm text-gray-700`}>
                    {" "}
                    Sell Price{" "}
                  </Text>
                  <Text style={tw`text-sm text-gray-700`}>
                    1 kg - LKR 250.00
                  </Text>
                </View>
                <Text style={tw`mb-4 ml-4 mr-2 text-lg`}> Quantity(kg) </Text>
                <View style={tw`flex-row items-center mr-1`}>
                  <TouchableOpacity
                    onPress={handleDecrement}
                    style={tw`w-6 p-1 bg-green-500 rounded`}
                  >
                    <Text style={tw`items-center ml-1 text-lg`}> -</Text>
                  </TouchableOpacity>
                  <Text style={tw`mx-5 text-lg`}> {quantity} </Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    style={tw`w-6 p-1 bg-green-500 rounded`}
                  >
                    <Text style={tw`ml-1 text-lg`}> +</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Total Price Section */}
            <View style={tw`ml-48`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Total Price
              </Text>
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
                    style={tw`${
                      step === 1 ? "text-white" : "text-black"
                    } font-bold`}
                  >
                    {String(step).padStart(2, "0")}
                  </Text>
                </View>
                {step < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
              </View>
            ))}
          </View>

          {/* Request Details Form */}
          <View style={tw`p-4 mb-5`}>
            <Text style={tw`mb-2 text-lg font-semibold`}> Factory Name </Text>
            <TextInput
              value="Cleantech (Pvt) Ltd"
              editable={false}
              style={tw`p-3 mb-3 bg-gray-100 border border-gray-300 rounded-md`}
            />
            <Text style={tw`mb-2 text-lg font-semibold`}>
              {" "}
              Factory Address{" "}
            </Text>
            <TextInput
              placeholder="Enter factory address"
              style={tw`p-3 mb-3 border border-gray-300 rounded-md`}
            />
            <Text style={tw`mb-2 text-lg font-semibold`}>
              Garbage Special type
            </Text>
            <TextInput
              value={category}
              editable={false}
              style={tw`p-3 bg-gray-100 border border-gray-300 rounded-md`}
            />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
            onPress={() => navigation.navigate("RequestedItemPayment")}
          >
            <Text style={tw`text-lg text-center text-white`}> NEXT </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TailwindProvider>
  );
};

export default Requestitem;
