import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from 'expo-router';  // Import router for navigation
import { AntDesign } from '@expo/vector-icons';

const Resycle = () => {
  const categories = [
    { name: 'Paper', icon: <FontAwesome5 name="newspaper" size={24} color="black" /> },
    { name: 'Plastic', icon: <FontAwesome5 name="bottle-plastic" size={24} color="black" /> },
    { name: 'Metol', icon: <FontAwesome5 name="tools" size={24} color="black" /> },
    { name: 'Clothes', icon: <FontAwesome5 name="tshirt" size={24} color="black" /> },
    { name: 'E waste', icon: <FontAwesome5 name="laptop" size={24} color="black" /> },
    { name: 'Glass', icon: <FontAwesome5 name="wine-bottle" size={24} color="black" /> },
  ];

  const handleNavigate = (category) => {
    // Use router to navigate to the RequestItem page, passing the category as a parameter if needed
    router.push('Requestitem');
  };

  return (
    <TailwindProvider>
      <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>Recycle</Text>
        </View>
      </View>

      <View className="flex-1 p-5 bg-gray-100">
        {/* Title */}
        <Text className="text-lg text-gray-700 mb-5">What do you want to collect?</Text>

        {/* Grid */}
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className="w-[45%] bg-gray-200 rounded-lg p-5 mb-5 items-center"
              onPress={() => handleNavigate(category)}  // Navigate when a category is pressed
            >
              {/* Render the FontAwesome5 icon */}
              {category.icon}
              {/* Render the category name */}
              <Text className="text-base font-semibold text-gray-700 mt-3">{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TailwindProvider>
  );
};

export default Resycle;
