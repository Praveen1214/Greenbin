import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import Garbagebag from "@/assets/images/garbageba.png";
import axios from 'axios';
import GoogleTextInput from "@/components/GoogleTextInput";
import  GooglePlacesAutocomplete  from 'react-native-google-places-autocomplete';
import 'react-native-get-random-values';
import AsyncStorage from "@react-native-async-storage/async-storage";


const googlePlacesApiKey = "AIzaSyDa1olgsfiH0ktBXGGkG2P_PXy1f5bIUdE";

const Book_a_pickup = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState({});
  const [message, setMessage] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [userid, setuserid] = useState(false);

  const garbageTypes = ['Papers', 'Plastic', 'Mentol', 'Cloths', 'E waste', 'Glass'];

  const toggleGarbageType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((item) => item !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handlePickup = (location) => {
    setLocation(location);
  };


  const handleSchedulePickUp = async () => {
    setIsLoading(true);
    try {
      const passengerDetailsString =
          await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setuserid(
            passengerDetails._id
          );
          const response = await axios.post('http://192.168.8.154:5000/api/pickupgarbage/addpickupgarbage', {
        userid:userid,
        location: location,
        garbagetypes: selectedTypes,
        message: message,
        datetime: date.toISOString(),
      });

     
        Alert.alert("Success", "Book pickup successfully!", [
          { text: "OK", onPress: () => navigation.navigate('home') }
        ]);
      }

    } catch (error) {
      console.error('Error details:', error.response?.data);
      Alert.alert(
        "Error",
        "Failed to Book pickup. Please try again later.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={tw`flex-grow`}>
        <View style={tw`bg-[#0C6C41] p-4 mt-6`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`ml-4 text-2xl font-bold text-white`}>Book a pickup</Text>
          </View>
        </View>

        <View style={tw`p-5 mx-4 mt-5 mb-5 bg-green-100 rounded-lg`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-start mt-4`}>
              <Image
                source={Garbagebag}
                style={{ width: 140, height: 140 }}
              />
            </View>
            <View style={tw`flex-col items-end mt-12`}>
              <Text style={tw`text-xl font-bold text-gray-900`}>
                Purchase price
              </Text>
              <Text style={tw`text-xl font-bold text-red-500`}>
               1Kg = LKR 250.00
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`p-4`}>
          <Text style={tw`mb-2 text-gray-600`}>Address</Text>
          <GoogleTextInput
                icon={null}
                initialLocation={location ? location.address : null}
                handlePress={handlePickup}
                textInputBackgroundColor="white"
                containerStyle="flex-1"
              />
        </View>

        <View style={tw`p-4 mb-4`}>
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
                  <Text style={tw`font-bold text-white`}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View> 
        </View>

        <Text style={tw`p-4 text-gray-600`}>Message</Text>
        <TextInput
          style={tw`h-24 p-4 ml-4 mr-4 border border-gray-300 rounded-md`}
          multiline
          placeholder="Write your comments here..."
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity 
          style={tw`p-4 px-5 py-3 mt-10 ml-4 mr-4 bg-black rounded-md`} 
          onPress={handleSchedulePickUp} 
          disabled={isLoading}
        >
          <Text style={tw`font-semibold text-center text-white`}>Submit</Text>
        </TouchableOpacity>

        <View style={tw`mb-10`} />
      </ScrollView>
    </View>
  );
};

export default Book_a_pickup;
