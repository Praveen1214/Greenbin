import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc'; // Import Tailwind CSS for React Native
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook

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

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {/* Stepper */}
      <View style={tw`flex-row justify-between items-center mb-8`}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={tw`items-center`}>
            <View style={tw`w-8 h-8 rounded-full ${step === 1 ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
              <Text style={tw`${step === 1 ? 'text-white' : 'text-black'} font-bold`}>{String(step).padStart(2, '0')}</Text>
            </View>
            {step < 3 && <View style={tw`h-0.5 w-16 bg-gray-300 mt-4`} />}
          </View>
        ))}
      </View>

      {/* Address Input */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Address</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-md p-2`}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
      </View>

      {/* Garbage Type Selection (Multiple Choice) */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Garbage type select here</Text>
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
      <Text style={tw`text-gray-600 mb-2`}>Message</Text>
      <TextInput
        style={tw`border border-gray-300 rounded-md p-2 h-24`}
        multiline
        placeholder="Write your comments here..."
        textAlignVertical="top"
        value={message}
        onChangeText={setMessage}
      />

      {/* Next Button */}
      <TouchableOpacity style={tw`bg-black rounded-md py-3 mt-16`} onPress={() => navigation.navigate('ViewPickup')}>
        <Text style={tw`text-white text-center font-semibold`}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Book_a_pickup;
