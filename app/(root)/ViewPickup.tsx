import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc'; // Tailwind CSS for React Native
import Garbagebag from "../../assets/images/garbageba.png"
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook


const ViewPickup = () => {

    const navigation = useNavigation(); // Hook for navigation inside the component

    
  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* Step Indicator */}
      <View style={tw`flex-row justify-between items-center mb-8`}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={tw`items-center`}>
            <View
              style={tw`w-8 h-8 rounded-full ${
                step === 2 ? 'bg-green-500' : 'bg-gray-200'
              } flex items-center justify-center`}
            >
              <Text style={tw`${step === 2 ? 'text-white' : 'text-black'} font-bold`}>
                {String(step).padStart(2, '0')}
              </Text>
            </View>
            {step < 3 && <View style={tw`h-0.5 w-16 bg-gray-200 mt-4`} />}
          </View>
        ))}
      </View>

      {/* Garbage Card */}
      <View style={tw`bg-green-100 rounded-lg p-4 mt-20`}>
        <View style={tw`flex-row items-center`}>
          {/* Icon */}
          <View style={tw`mr-4`}>
          <Image
              source={Garbagebag} // Add your icon here
              style={tw`w-24 h-24`}
            />
          </View>

          {/* Garbage Info */}
          <View>
            <Text style={tw`text-lg font-semibold mb-2`}>Garbage</Text>
            <Text style={tw`text-gray-500`}>
              Sell Price{' '}
              <Text style={tw`text-orange-500 font-semibold`}>1 kg - LKR 250.00</Text>
            </Text>
            <Text style={tw`text-gray-500 mt-2`}>
              Quantity (kg) <Text style={tw`text-black text-2xl font-bold`}>5Kg</Text>
            </Text>
            <Text style={tw`text-gray-500 mt-2`}>
              Total Sell Price{' '}
              <Text style={tw`text-red-500 text-lg font-bold`}>LKR 1250.00</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Next Button */}
      <TouchableOpacity style={tw`bg-black rounded-md py-3 mt-16`} onPress={() => navigation.navigate('Pay')}>
        <Text style={tw`text-white text-center font-semibold`}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ViewPickup;
