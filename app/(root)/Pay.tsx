import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import tw from 'twrnc'; // Tailwind CSS for React Native

const PaymentForm = () => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('2024');
  const [cvc, setCvc] = useState('');

  {/*const cardIcons = [
    require('./assets/paypal.png'),
    require('./assets/visa.png'),
    require('./assets/mastercard.png'),
    require('./assets/discover.png'),
    require('./assets/amex.png'),
  ];*/}

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {/* Step Indicator */}
      <View style={tw`flex-row justify-between items-center mb-8`}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={tw`items-center`}>
            <View
              style={tw`w-8 h-8 rounded-full ${
                step === 3 ? 'bg-green-500' : 'bg-gray-200'
              } flex items-center justify-center`}
            >
              <Text style={tw`${step === 3 ? 'text-white' : 'text-black'} font-bold`}>
                {String(step).padStart(2, '0')}
              </Text>
            </View>
            {step < 3 && <View style={tw`h-0.5 w-16 bg-gray-200 mt-4`} />}
          </View>
        ))}
      </View>

      {/* Card Icons */}
     {/* <View style={tw`flex-row justify-between mb-6`}>
        {cardIcons.map((icon, index) => (
          <Image key={index} source={icon} style={tw`w-12 h-12`} />
        ))}
      </View> /*}

      {/* Cardholder Name */}
      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-1`}>Cardholder name</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3`}
          placeholder="Enter card name"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
      </View>

      {/* Card Number */}
      <View style={tw`mb-4`}>
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
      <View style={tw`flex-row justify-between mb-4`}>
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
        <View style={tw`flex-1 ml-2`}>
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

      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-600 mb-1`}>CVC</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg p-3`}
          placeholder="123"
          value={cvc}
          onChangeText={setCvc}
          keyboardType="numeric"
        />
        <Text style={tw`text-gray-400 mt-1 text-sm`}>
          3 or 4 digits usually found on the signature strip
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={tw`bg-black rounded-md py-3`}>
        <Text style={tw`text-white text-center font-semibold`}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentForm;
