import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Garbagebag from "@/assets/images/garbageba.png";
import axios from 'axios';
import GoogleTextInput from "@/components/GoogleTextInput";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values'; // Polyfill for crypto.getRandomValues
import { v4 as uuidv4 } from 'uuid'; // Import UUID

const Book_a_pickup = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState({});
  const [message, setMessage] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userid, setUserid] = useState('');

  const garbageTypes = ['Papers', 'Plastic', 'Metal', 'Cloths', 'E-waste', 'Glass'];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const passengerDetailsString = await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setUserid(passengerDetails._id);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const toggleGarbageType = (type) => {
    setSelectedTypes(prevTypes =>
      prevTypes.includes(type)
        ? prevTypes.filter(item => item !== type)
        : [...prevTypes, type]
    );
  };

  const handlePickup = (location) => {
    setLocation(location);
  };

  const handleSchedulePickUp = async () => {
    if (!location.address) {
      Alert.alert("Error", "Please select a pickup location.");
      return;
    }
    if (selectedTypes.length === 0) {
      Alert.alert("Error", "Please select at least one garbage type.");
      return;
    }

    setIsLoading(true);
    try {

      const response = await axios.post('http://192.168.134.196:5000/api/pickupgarbage/addpickupgarbage', {

        userid,
        location,
        garbagetypes: selectedTypes,
        message,
        datetime: date.toISOString(),
        pickupId: uuidv4(), // Generate unique ID for the pickup request
      });

      Alert.alert("Success", "Pickup booked successfully!", [
        { text: "OK", onPress: () => navigation.navigate('home') }
      ]);
    } catch (error) {
      console.error('Error details:', error.response?.data);
      Alert.alert(
        "Error",
        "Failed to book pickup. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={tw`flex-grow`}>
        <View style={tw`bg-[#0C6C41] p-4 pt-12`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`ml-4 text-2xl font-bold text-white`}>Book a Pickup</Text>
          </View>
        </View>

        <View style={tw`p-5 mx-4 mt-5 mb-5 bg-green-100 rounded-lg shadow-md`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Image
              source={Garbagebag}
              style={{ width: 100, height: 100 }}
            />
            <View style={tw`flex-col items-end`}>
              <Text style={tw`text-lg font-semibold text-gray-800`}>Purchase price</Text>
              <Text style={tw`text-xl font-bold text-green-600`}>1Kg = LKR 250.00</Text>
            </View>
          </View>
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`mb-4 font-semibold text-gray-600`}>Pickup Address</Text>
          <GoogleTextInput
            icon={null}
            initialLocation={location ? location.address : null}
            handlePress={handlePickup}
            textInputBackgroundColor="white"
            containerStyle="flex-1"
          />
        </View>

        <View style={tw`p-4 mb-4`}>
          <Text style={tw`mb-2 font-semibold text-gray-600`}>Select Garbage Types</Text>
          <View style={tw`flex-row flex-wrap`}>
            {garbageTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={tw`w-[30%] border rounded-md px-2 py-3 mr-3 mb-3 flex-row items-center justify-center ${
                  selectedTypes.includes(type) ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                }`}
                onPress={() => toggleGarbageType(type)}
              >
                <Text style={tw`${selectedTypes.includes(type) ? 'text-white' : 'text-gray-600'} text-center`}>{type}</Text>
                {selectedTypes.includes(type) && (
                  <MaterialIcons name="check" size={18} color="white" style={tw`ml-1`} />
                )}
              </TouchableOpacity>
            ))}
          </View> 
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`mb-2 font-semibold text-gray-600`}>Additional Notes</Text>
          <TextInput
            style={tw`h-24 p-4 border border-gray-300 rounded-md`}
            multiline
            placeholder="Any special instructions or comments..."
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />
        </View>

        <TouchableOpacity 
          style={tw`p-4 mt-6 mx-4 bg-[#0C6C41] rounded-md ${isLoading ? 'opacity-70' : ''}`} 
          onPress={handleSchedulePickUp} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={tw`text-lg font-semibold text-center text-white`}>Schedule Pickup</Text>
          )}
        </TouchableOpacity>

        <View style={tw`mb-10`} />
      </ScrollView>
    </View>
  );
};

export default Book_a_pickup;
