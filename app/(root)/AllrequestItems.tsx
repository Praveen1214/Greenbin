import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import tw from 'twrnc'; // Tailwind CSS for React Native
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Function to map material categories to icons
const getIconForMaterial = (material) => {
  switch (material) {
    case 'Paper':
      return 'newspaper'; // Icon for paper
    case 'Plastic':
      return 'bottle-soda'; // Icon for plastic
    case 'Metal':
      return 'tools'; // Icon for metal
    case 'Clothes':
      return 'tshirt'; // Icon for clothes
    case 'E waste':
      return 'laptop'; // Icon for e-waste
    case 'Glass':
      return 'wine-bottle'; // Icon for glass
    default:
      return 'file-document-outline'; // Default icon
  }
};

const RequestItem = ({ material, quantity, price, status }) => {
  return (
    <View style={tw`bg-gray-300 p-6 ml-4 mr-4 rounded-lg shadow-md mb-2 mt-5`}>
      <View style={tw`flex-row items-center`}>
        <View>
          <FontAwesome5 name={getIconForMaterial(material)} size={70} />
          <Text style={tw`ml-4 text-lg font-bold`}>{material}</Text>
        </View>

        <View style={tw`ml-auto items-end`}>
          <Text style={tw`text-gray-600`}>Quantity (kg): {quantity}</Text>
          <Text style={tw`text-red-500 my-1`}>Total Sell Price: LKR {price.toFixed(2)}</Text>
          <Text style={status === 'Approved' ? tw`text-green-600 font-bold` : tw`text-yellow-600 font-bold`}>
            {status}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row justify-end`}>
        <TouchableOpacity>
          <Text style={tw`mt-2 text-blue-500`}>View Request Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AllrequestItems = () => {
  const navigation = useNavigation();
  const [allrequest, setallrequest] = useState([]);

  // Fetch the data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.8.154:5000/api/requestitem/getallrequestitems"
      );
      setallrequest(response.data); // Assuming response.data contains the list of request items
    } catch (error) {
      console.error("Error fetching request items data:", error);
      Alert.alert("Error", "Failed to fetch request items data. Please try again.");
    }
  };

  return (
    <ScrollView>
      {/* Header Section */}
      <View style={{ backgroundColor: '#0C6C41', padding: 16, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: '700', color: 'white', marginLeft: 16 }}>
            All Request Items
          </Text>
        </View>
      </View>

      {/* Dynamically Render Request Items */}
      {allrequest.length > 0 ? (
        allrequest.map((item, index) => (
          <RequestItem
            key={index}
            material={item.category} // Use the category from the API to fetch the correct icon
            quantity={item.quantity}
            price={item.totalSellPrice}
            status={item.status}
          />
        ))
      ) : (
        <Text style={tw`text-center mt-4`}>No request items available.</Text>
      )}
    </ScrollView>
  );
};

export default AllrequestItems;
