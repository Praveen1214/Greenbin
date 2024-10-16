// components/EditRequestForm.tsx
import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

const EditRequestForm = ({ item, onSave, onCancel }) => {
  const [editedItem, setEditedItem] = useState(item);

  const handleChange = (field, value) => {
    setEditedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedItem);
  };

  return (
    <ScrollView style={tw`flex-1 p-6 bg-white`}>
      <Text style={tw`mb-4 text-2xl font-bold`}> Edit Request </Text>
      <Text style={tw`mb-2`}> Factory Name </Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.factoryName}
        onChangeText={(value) => handleChange("factoryName", value)}
        placeholder="Factory Name"
      />
      <Text style={tw`mb-2`}> Factory Address </Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.factoryAddress}
        onChangeText={(value) => handleChange("factoryAddress", value)}
        placeholder="Factory Address"
      />
      <Text style={tw`mb-2`}>Beneficiary Name </Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.beneficiaryName}
        onChangeText={(value) => handleChange("beneficiaryName", value)}
        placeholder="Beneficiary Name"
      />
      <Text style={tw`mb-2`}> Bank </Text>
      <View style={tw`p-2 mb-4 border border-gray-300 rounded-lg`}>
        <Picker
          selectedValue={editedItem.bank}
          onValueChange={(itemValue) => handleChange("bank", itemValue)}
        >
          <Picker.Item label="Select Bank" value="" />
          <Picker.Item label="BOC" value="BOC" />
          <Picker.Item label="Commercial Bank" value="Commercial Bank" />
          <Picker.Item label="DFCC Bank" value="DFCC Bank" />
          <Picker.Item label="HNB" value="HNB" />
          <Picker.Item label="NSB" value="NSB" />
          <Picker.Item label="Peoples Bank" value="Peoples Bank" />
          <Picker.Item label="RDB" value="RDB" />
          <Picker.Item label="SDB" value="SDB" />
          <Picker.Item label="Sampath Bank" value="Sampath Bank" />
          <Picker.Item label="Seylan Bank" value="Seylan Bank" />
          <Picker.Item label="Union Bank" value="Union Bank" />
        </Picker>
      </View>
      <Text style={tw`mb-2`}> Account No. </Text>
      <TextInput
        style={tw`p-2 mb-4 border border-gray-300 rounded`}
        value={editedItem.accountNo}
        onChangeText={(value) => handleChange("accountNo", value)}
        placeholder="Account No"
        keyboardType="numeric"
      />
      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-blue-500 rounded`}
          onPress={handleSave}
        >
          <Text style={tw`font-bold text-white`}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`px-4 py-2 bg-gray-500 rounded`}
          onPress={onCancel}
        >
          <Text style={tw`font-bold text-white`}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditRequestForm;
