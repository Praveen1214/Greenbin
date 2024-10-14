import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const Recycle = () => {
  const categories = [
    {
      name: "Paper",
      icon: <FontAwesome5 name="newspaper" size={32} color="#4CAF50" />,
      description: "Newspapers, magazines, cardboard"
    },
    {
      name: "Plastic",
      icon: <MaterialCommunityIcons name="bottle-soda" size={32} color="#2196F3" />,
      description: "Bottles, containers, packaging"
    },
    {
      name: "Metal",
      icon: <FontAwesome5 name="tools" size={32} color="#FF9800" />,
      description: "Cans, appliances, scrap metal"
    },
    {
      name: "Clothes",
      icon: <FontAwesome5 name="tshirt" size={32} color="#E91E63" />,
      description: "Used clothing, textiles, fabrics"
    },
    {
      name: "E-waste",
      icon: <FontAwesome5 name="laptop" size={32} color="#9C27B0" />,
      description: "Electronics, batteries, gadgets"
    },
    {
      name: "Glass",
      icon: <FontAwesome5 name="wine-bottle" size={32} color="#009688" />,
      description: "Bottles, jars, broken glass"
    }
  ];

  const handleCategoryPress = (categoryName) => {
    router.push({
      pathname: "/(requests)/factroyRequests/Requestitem",
      params: { category: categoryName }
    });
  };

  return (
    <TailwindProvider>
      <SafeAreaView className="flex-1 bg-white">
        <View className="bg-[#4CAF50] p-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white ml-2">
              Recycle
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          <Text className="mb-6 text-xl font-semibold text-gray-800">
            What would you like to recycle?
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] bg-white rounded-xl p-4 mb-4 items-center shadow-md"
                onPress={() => handleCategoryPress(category.name)}
              >
                <View className="bg-gray-100 rounded-full p-4 mb-2">
                  {category.icon}
                </View>
                <Text className="text-lg font-semibold text-gray-800 mb-1">{category.name}</Text>
                <Text className="text-xs text-gray-600 text-center">{category.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TailwindProvider>
  );
};

export default Recycle;