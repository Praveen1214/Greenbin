import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "@/components/FormField";
import { submitRequestItem } from "../../services/RequestItemService";

const RequestItem = () => {
  const [quantity, setQuantity] = useState(5);
  const [step, setStep] = useState(1);
  const [factoryName, setFactoryName] = useState("");
  const [factoryAddress, setFactoryAddress] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [contact, setContact] = useState("");
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const pricePerKg = 250;
  const totalSellPrice = quantity * pricePerKg;

  useEffect(() => {
    const getPassengerDetails = async () => {
      try {
        const passengerDetailsString =
          await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setFactoryName(
            `${passengerDetails.firstname} ${passengerDetails.lastname}`
          );
          setContact(passengerDetails.contact);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getPassengerDetails();
  }, []);

  const getAntDesignIcon = (category) => {
    switch (category) {
      case "Paper":
        return <FontAwesome5 name="newspaper" size={32} color="#4CAF50" />;
      case "Plastic":
        return (<MaterialCommunityIcons name="bottle-soda" size={32} color="#2196F3" />);
      case "Metal":
        return <FontAwesome5 name="tools" size={32} color="#FF9800" />;
      case "Clothes":
        return <FontAwesome5 name="tshirt" size={32} color="#E91E63" />;
      case "E-waste":
        return <FontAwesome5 name="laptop" size={32} color="#9C27B0" />;
      case "Glass":
        return <FontAwesome5 name="wine-bottle" size={32} color="#009688" />;
      default:
        return <AntDesign name="question" size={50} color="black" />;
    }
  };

  const handleNext = async () => {
    if (step === 1 && !factoryAddress) {
      Alert.alert("Error", "Please enter factory address");
      return;
    }
    if (step === 2 && (!beneficiaryName || !bank || !accountNo)) {
      Alert.alert("Error", "Please fill all payment details");
      return;
    }

    if (step === 2) {
      try {
        const requestData = {
          category,
          quantity,
          factoryName,
          factoryAddress,
          beneficiaryName,
          bank,
          accountNo,
          totalSellPrice,
          contact
        };
        await submitRequestItem(requestData);
        setStep(3); // Success
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-[#4CAF50] p-4 mt-6`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`ml-4 text-2xl font-bold text-white`}>
            Request Items
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Card */}
        <View style={tw`p-5 mx-4 mt-4 mb-5 bg-green-100 rounded-lg`}>
          <View style={tw`flex-row justify-between p-5`}>
            <View style={tw`items-start mt-12`}>
              {getAntDesignIcon(category)}
              <Text style={tw`mt-2 text-lg`}>{category}</Text>
            </View>
            <View style={tw`flex-col items-end`}>
              <Text style={tw`mb-4 ml-4 mr-2 text-lg`}>Quantity (kg)</Text>
              <View style={tw`flex-row items-center`}>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(quantity - 1, 1))}
                  style={tw`w-6 p-1 bg-green-500 rounded`}
                >
                  <Text style={tw`text-lg`}>-</Text>
                </TouchableOpacity>
                <Text style={tw`mx-5 text-lg`}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={tw`w-6 p-1 bg-green-500 rounded`}
                >
                  <Text style={tw`text-lg`}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={tw`mt-4 text-lg font-bold text-red-500`}>
                Total: LKR {totalSellPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stepper */}
        <View style={tw`flex-row items-center justify-between p-4`}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={tw`flex-row items-center`}>
              <View
                style={tw`w-8 h-8 rounded-full border-2 ${s <= step ? "bg-green-500 border-green-500" : "border-green-300"} flex items-center justify-center`}
              >
                <Text
                  style={tw`${s <= step ? "text-white" : "text-black"} font-bold`}
                >
                  {String(s).padStart(2, "0")}
                </Text>
              </View>
              {s < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
            </View>
          ))}
        </View>

        {/* Form Content */}
        {step === 1 && (
          <View style={tw`p-4`}>
            <FormField
              label="Factory Name"
              value={factoryName}
              onChangeText={setFactoryName}
              placeholder="Enter factory name"
            />
            <FormField
              label="Factory Address"
              value={factoryAddress}
              onChangeText={setFactoryAddress}
              placeholder="Enter factory address"
            />
            <FormField
              label="Garbage Category"
              value={category}
              editable={false}
            />
          </View>
        )}

        {step === 2 && (
          <View style={tw`p-4`}>
            <FormField
              label="Beneficiary Name"
              value={beneficiaryName}
              onChangeText={setBeneficiaryName}
              placeholder="Enter name"
            />
            <View style={tw`p-2 mb-4 border border-gray-300 rounded-lg`}>
              <Picker
                selectedValue={bank}
                onValueChange={(value) => setBank(value)}
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
            <FormField
              label="Account No."
              value={accountNo}
              onChangeText={setAccountNo}
              placeholder="Enter account number"
              keyboardType="numeric"
            />
          </View>
        )}

        {step === 3 && (
          <View style={tw`p-4`}>
            <Text style={tw`text-lg text-center text-green-500`}>
              Your request is successful!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
          onPress={handleNext}
        >
          <Text style={tw`text-lg text-center text-white`}>
            {step < 3 ? "Next" : "Finish"}
          </Text>
        </TouchableOpacity>

        {step === 3 && (
          <TouchableOpacity
            style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
            onPress={() => router.push("/(tabs)/activity")}
          >
            <Text style={tw`text-lg text-center text-white`}>
              View All Requests
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default RequestItem;
