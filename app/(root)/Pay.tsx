import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'twrnc'; // Tailwind CSS for React Native
import { router } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import paypal from "../../assets/images/paypal.png"
import master from "../../assets/images/master.png" 
import discover from "../../assets/images/discover.png" 
import amex from "../../assets/images/amex.png" 

const PaymentForm = () => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('2024');
  const [cvc, setCvc] = useState('');

  const cardIcons = [
    paypal,
   master,
   discover,
   amex,
   {/*  
    require('./assets/discover.png'),
    require('./assets/amex.png'),*/}
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white `}>
      <View style={{ backgroundColor: '#0C6C41', padding: 16 ,marginTop:24, }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>Pay</Text>
        </View>
      </View>
      {/* Step Indicator */}
     {/* Step Indicator */}
     <View style={tw`flex-row justify-between items-center mt-4 p-4`}>
  {[1, 2, 3].map((step) => (
    <View key={step} style={tw`flex-row items-center`}>
      <View
        style={tw`w-8 h-8 rounded-full border-2 ${
          step === 3 ? 'bg-green-500 border-green-500' : ' border-green-300'
        } flex items-center justify-center`}
      >
        <Text style={tw`${step === 3 ? 'text-white' : 'text-black'} font-bold`}>
          {String(step).padStart(2, '0')}
        </Text>
      </View>
      {step < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
    </View>
  ))}
</View>



      {/* Card Icons */}
      <View style={tw`flex-row justify-between mb-6 mt-4 ml-2`}>
        {cardIcons.map((icon, index) => (
          <Image key={index} source={icon} style={tw`w-17 ml-5 h-12`} />
        ))}
      </View> 

      {/* Cardholder Name */}
      <View style={tw` p-4`}>
        <Text style={tw`text-gray-600 mb-1`}>Cardholder name</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3`}
          placeholder="Enter card name"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
      </View>

      {/* Card Number */}
      <View style={tw` p-4`}>
        <Text style={tw`text-gray-600 mb-1`}>Card Number</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3`}
          placeholder="Enter number"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
        />
      </View>

      {/* Expiry Date and CVC */}
      <View style={tw`flex-row justify-between  p-4`}>
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`text-gray-600 mb-1`}>Exp Month</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3`}
            placeholder="12"
            value={expMonth}
            onChangeText={setExpMonth}
            keyboardType="numeric"
          />
        </View>
        <View style={tw`flex-1 ml-2 `}>
          <Text style={tw`text-gray-600 mb-1`}>Exp Year</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-3`}
            placeholder="2024"
            value={expYear}
            onChangeText={setExpYear}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`mb-3 p-4`}>
        <Text style={tw`text-gray-600 mb-1`}>CVC</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3`}
          placeholder="123"
          value={cvc}
          onChangeText={setCvc}
          keyboardType="numeric"
        />
        <Text style={tw`text-gray-400  text-sm p-1`}>
          3 or 4 digits usually found on the signature strip
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={tw`bg-black rounded-md py-3 ml-4 mr-4`}>
        <Text style={tw`text-white text-center font-semibold`}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentForm;
