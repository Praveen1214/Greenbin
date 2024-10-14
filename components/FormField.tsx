// components/FormField.tsx
import React from 'react';
import { TextInput, Text, View } from 'react-native';
import tw from 'twrnc';

const FormField = ({ label, value, onChangeText, placeholder, editable = true, keyboardType = 'default' }) => {
  return (
    <View style={tw`mb-4`}>
      <Text style={tw`mb-2 text-lg font-semibold`}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={tw`p-3 border border-gray-300 rounded-md bg-gray-100`}
        editable={editable}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default FormField;
