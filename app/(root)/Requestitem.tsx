import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import tw from "twrnc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const RequestItem = () => {
  const [quantity, setQuantity] = useState(5);
  const [step, setStep] = useState(1);
  const [factoryName, setFactoryName] = useState("");
  const [factoryAddress, setFactoryAddress] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [bank, setBank] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");

  const router = useRouter();

  useEffect(() => {
    const getPassengerDetails = async () => {
      try {
        const passengerDetailsString =
          await AsyncStorage.getItem("passengerDetails");
        if (passengerDetailsString) {
          const passengerDetails = JSON.parse(passengerDetailsString);
          setUserName(
            passengerDetails.firstname + " " + passengerDetails.lastname
          );
          setEmail(passengerDetails.email);
          setContact(passengerDetails.contact);
          setGender(passengerDetails.gender);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getPassengerDetails();
  }, [contact]);

  const pricePerKg = 250;
  const totalSellPrice = quantity * pricePerKg;

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getGarbageTypeIcon = () => {
    switch (category) {
      case "Paper":
        return <FontAwesome5 name="newspaper" size={50} color="black" />;
      case "Plastic":
        return (
          <MaterialCommunityIcons name="bottle-soda" size={50} color="black" />
        );
      case "Metol":
        return <FontAwesome5 name="tools" size={50} color="black" />;
      case "Clothes":
        return <FontAwesome5 name="tshirt" size={50} color="black" />;
      case "E waste":
        return <FontAwesome5 name="laptop" size={50} color="black" />;
      case "Glass":
        return <FontAwesome5 name="wine-bottle" size={50} color="black" />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!factoryAddress) {
        Alert.alert("Error", "Please enter factory address");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!beneficiaryName || !bank || !accountNo) {
        Alert.alert("Error", "Please fill all payment details");
        return;
      }

      try {
        const response = await axios.post(
          `http://192.168.8.154:5000/api/requestitem/request-item`,
          {
            category,
            quantity,
            factoryName,
            factoryAddress,
            beneficiaryName,
            bank,
            accountNo,
            totalSellPrice,
            contact
          }
        );

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 201) {
          setStep(3);
        } else {
          throw new Error(response.data.message || "Failed to submit request");
        }
      } catch (error) {
        console.error("Error submitting request:", error);
        Alert.alert("Error", `Failed to submit request. ${error.message}`);
      }
    }
  };

  return (
    <TailwindProvider>
      <View style={tw`flex-1 bg-gray-100`}>
        <View style={tw`bg-[#4CAF50] p-4 mt-6`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => console.log("Back pressed")}>
              <AntDesign name="arrowleft" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`ml-4 text-2xl font-bold text-white`}>
              Request Items
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Card */}
          <View
            style={[
              tw`p-5 mx-4 mt-4 mb-5 bg-green-100 rounded-lg`,
              {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5 // Android shadow
              }
            ]}
          >
            <View style={tw`flex-row justify-between`}>
              {/* Left Section: Product Info */}
              <View style={tw`items-start mt-4`}>
                {getGarbageTypeIcon()}
                <Text style={tw`mt-2 text-lg font-semibold text-gray-900`}>
                  Plastic
                </Text>
              </View>

              {/* Right Section: Price and Quantity */}
              <View style={tw`flex-col items-end`}>
                {/* Price Info */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-sm font-semibold text-gray-700`}>
                    Sell Price
                  </Text>
                  <Text style={tw`text-sm text-[#CE6E00]`}>
                    1 kg - LKR 250.00
                  </Text>
                </View>

                {/* Quantity Info */}
                <View style={tw`flex-row items-center`}>
                  <TouchableOpacity
                    onPress={handleDecrement}
                    style={tw`items-center justify-center w-10 h-10 bg-green-500 rounded-full`}
                  >
                    <Text style={tw`text-lg font-bold text-white`}> -</Text>
                  </TouchableOpacity>
                  <Text style={tw`mx-5 text-lg font-semibold text-gray-900`}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={handleIncrement}
                    style={tw`items-center justify-center w-10 h-10 bg-green-500 rounded-full`}
                  >
                    <Text style={tw`text-lg font-bold text-white`}> +</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Total Price Section */}
            <View style={tw`mt-8`}>
              <Text style={tw`text-lg font-bold text-gray-900`}>
                Total Sell Price
              </Text>
              <Text style={tw`text-2xl font-bold text-red-500`}>
                LKR {totalSellPrice.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Stepper */}
          <View style={tw`flex-row items-center justify-between p-4 mt-4`}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={tw`flex-row items-center`}>
                <View
                  style={tw`w-8 h-8 rounded-full border-2 ${
                    s <= step
                      ? "bg-green-500 border-green-500"
                      : "border-green-300"
                  } flex items-center justify-center`}
                >
                  <Text
                    style={tw`${
                      s <= step ? "text-white" : "text-black"
                    } font-bold`}
                  >
                    {String(s).padStart(2, "0")}
                  </Text>
                </View>
                {s < 3 && <View style={tw`h-0.5 w-28 bg-green-300 ml-2`} />}
              </View>
            ))}
          </View>

          {step === 1 && (
            /* Request Details Form */
            <View style={tw`p-4 mb-5`}>
              <Text style={tw`mb-2 text-lg font-semibold`}> Factory Name </Text>
              <TextInput
                placeholder="Enter factory name"
                value={factoryName}
                onChangeText={setFactoryName}
                style={tw`p-3 mb-3 bg-gray-100 border border-gray-300 rounded-md`}
              />
              <Text style={tw`mb-2 text-lg font-semibold`}>
                Factory Address
              </Text>
              <TextInput
                placeholder="Enter factory address"
                value={factoryAddress}
                onChangeText={setFactoryAddress}
                style={tw`p-3 mb-3 border border-gray-300 rounded-md`}
              />
              <Text style={tw`mb-2 text-lg font-semibold`}>
                Garbage Special type
              </Text>
              <TextInput
                value={category}
                editable={false}
                style={tw`p-3 bg-gray-100 border border-gray-300 rounded-md`}
              />
            </View>
          )}

          {step === 2 && (
            /* Payment Details Form */
            <View style={tw`p-4 mb-5`}>
              <Text style={tw`mb-2 text-lg text-gray-700`}>
                {" "}
                Beneficiary Name{" "}
              </Text>
              <TextInput
                value={beneficiaryName}
                onChangeText={setBeneficiaryName}
                placeholder="Enter name"
                style={tw`p-3 mb-3 border border-gray-300 rounded-md`}
              />

              <Text style={tw`mb-2 text-lg text-gray-700`}> Bank </Text>
              <View style={tw`p-2 mb-4 border border-gray-300 rounded-lg`}>
                <Picker
                  selectedValue={bank}
                  onValueChange={(itemValue) => setBank(itemValue)}
                >
                  <Picker.Item label="Select Bank" value="" />
                  <Picker.Item label="BOC" value="BOC" />
                  <Picker.Item
                    label="Commercial Bank"
                    value="Commercial Bank"
                  />
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

              <Text style={tw`mb-2 text-lg text-gray-700`}> Account No.</Text>
              <TextInput
                value={accountNo}
                onChangeText={setAccountNo}
                placeholder="Enter account number"
                style={tw`p-3 border border-gray-300 rounded-md`}
                keyboardType="numeric"
              />
            </View>
          )}

          {step === 3 && (
            <View style={tw`p-4 mb-5`}>
              <Text style={tw`text-lg text-center text-green-500`}>
                Your request is successful!
              </Text>
            </View>
          )}

          {step < 3 && (
            <TouchableOpacity
              style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
              onPress={handleNext}
            >
              <Text style={tw`text-lg text-center text-white`}> SUBMIT </Text>
            </TouchableOpacity>
          )}

          {step === 3 && (
            <TouchableOpacity
              style={tw`p-4 mx-4 mb-4 bg-black rounded-lg`}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/activity"
                })
              }
            >
              <Text style={tw`text-lg text-center text-white`}>
                {" "}
                View All Requests{" "}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </TailwindProvider>
  );
};

export default RequestItem;
