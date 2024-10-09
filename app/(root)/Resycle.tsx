import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const Resycle = () => {
  const categories = [
    {
      name: "Paper",
      icon: <FontAwesome5 name="newspaper" size={24} color="black" />
    },
    {
      name: "Plastic",
      icon: (
        <MaterialCommunityIcons name="bottle-soda" size={24} color="black" />
      )
    }, // Use MaterialCommunityIcons for plastic
    {
      name: "Metol",
      icon: <FontAwesome5 name="tools" size={24} color="black" />
    },
    {
      name: "Clothes",
      icon: <FontAwesome5 name="tshirt" size={24} color="black" />
    },
    {
      name: "E waste",
      icon: <FontAwesome5 name="laptop" size={24} color="black" />
    },
    {
      name: "Glass",
      icon: <FontAwesome5 name="wine-bottle" size={24} color="black" />
    }
  ];

  const handleNavigate = (category) => {
    router.push("Requestitem");
  };

  return (
    <TailwindProvider>
      <View style={{ backgroundColor: "#0C6C41", padding: 16, marginTop: 24 }}>
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
            {" "}
            Recycle{" "}
          </Text>
        </View>
      </View>

      <View className="flex-1 p-5 bg-gray-100">
        <Text className="mb-5 text-lg text-gray-700">
          {" "}
          What do you want to collect ?{" "}
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="w-[45%] bg-gray-200 rounded-lg p-5 mb-5 items-center"
              onPress={() => handleNavigate(category)}
            >
              {category.icon}
              <Text className="mt-3 text-base font-semibold text-gray-700">
                {" "}
                {category.name}{" "}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TailwindProvider>
  );
};

export default Resycle;
