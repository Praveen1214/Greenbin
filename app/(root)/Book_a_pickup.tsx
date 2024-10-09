import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView ,Platform} from 'react-native';
import tw from 'twrnc'; // Import Tailwind CSS for React Native
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import { router } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Book_a_pickup = () => {
  const navigation = useNavigation(); // Hook for navigation inside the component
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]); // Changed to multiple selections

  const garbageTypes = ['Papers', 'Plastic', 'Mentol', 'Cloths', 'E waste', 'Glass'];

  // Function to handle multiple selections
  const toggleGarbageType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const platformSpecificStyle = Platform.select({
    ios: "mb-1",
    android: "mt-2 mb-2"
  });

  return (
    <SafeAreaView className={`flex-1 bg-gray-100 ${platformSpecificStyle} text-black`}>

    <ScrollView style={tw`flex-1 bg-white mt-5`}>
      <View style={{ backgroundColor: '#0C6C41', padding: 16 ,marginTop:4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>Book a pickup</Text>
        </View>
      </View>
      {/* Stepper */}
      <View style={tw`flex-row justify-between items-center mt-4 p-4`}>
  {[1, 2, 3].map((step) => (
    <View key={step} style={tw`flex-row items-center`}>
      <View
        style={tw`w-8 h-8 rounded-full border-2 ${
          step === 1 ? 'bg-green-500 border-green-500' : ' border-green-300'
        } flex items-center justify-center`}
      >
        <Text style={tw`${step === 1 ? 'text-white' : 'text-black'} font-bold`}>
          {String(step).padStart(2, '0')}
        </Text>
      </View>
      {step < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
    </View>
  ))}
</View>


      {/* Address Input */}
      <View style={tw` p-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Address</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-md p-2`}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Garbage Type Selection (Multiple Choice) */}
      <View style={tw`mb-4 p-4`}>
        <Text style={tw`text-gray-600`}>Garbage type select here</Text>
        <View style={tw`flex-row flex-wrap mt-4 ml-5`}>
          {garbageTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={tw`w-[28%] border rounded-md px-3 py-4 mr-4 mb-2 flex-row items-center justify-between ${
                selectedTypes.includes(type) ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-300'
              }`}
              onPress={() => toggleGarbageType(type)}
            >
              <Text style={tw`${selectedTypes.includes(type) ? 'text-white' : 'text-gray-600'}`}>{type}</Text>
              {selectedTypes.includes(type) && (
                <Text style={tw`text-white font-bold`}>✓</Text>  // You can replace with icon if needed
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Message Input */}
      <Text style={tw`text-gray-600 p-4`}>Message</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-md  h-24 p-4 ml-4 mr-4`}
        multiline
        placeholder="Write your comments here..."
        textAlignVertical="top"
        value={message}
        onChangeText={setMessage}
      />

      {/* Next Button */}
      <TouchableOpacity style={tw`bg-black rounded-md py-3 mt-16 p-4 px-5 ml-4 mr-4`} onPress={() => navigation.navigate('ViewPickup')}>
        <Text style={tw`text-white text-center font-semiboldml-`}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Book_a_pickup;
