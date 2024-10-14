import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


const HomeScreen = () => {
  const navigation = useNavigation();

  const platformSpecificStyle = Platform.select({
    ios: "mb-1",
    android: "mt-2 mb-2"
  });

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
  }, [userName]);

  return (
    <SafeAreaView
      className={`flex-1 bg-gray-100 ${platformSpecificStyle} text-black`}
    >
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16
          }}
        >
          <View>
            <Text style={{ color: "#4CAF50", fontSize: 14 }}>Welcome</Text>
            <Text style={{ color: "black", fontSize: 24, fontWeight: "bold" }}>
              {" "}
              {userName}{" "}
            </Text>
          </View>
          <TouchableOpacity style={{ padding: 8 }}>
            <Feather name="bell" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "white",
            borderRadius: 30,
            margin: 16,
            padding: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Don't throw away,
            </Text>
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              recycle for another day
            </Text>
            <Text
              style={{
                color: "#4CAF50",
                fontSize: 18,
                fontWeight: "semibold",
                marginTop: 8
              }}
            >
              Recycle with us
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                borderRadius: 9999,
                paddingVertical: 8,
                paddingHorizontal: 24,
                alignSelf: "flex-start",
                marginTop: 16
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Let's start
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: "https://example.com/recycling-illustration.png" }}
            style={{ width: 128, height: 128 }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 16
          }}
        >
          {[
            {
              icon: "truck",
              text: "Book a Pickup",
              navigateTo: "Book_a_pickup"
            }, // Added navigateTo property
            { icon: "refresh-cw", text: "Recycle", navigateTo: "Recycle" },
            { icon: "book-open", text: "Learn" },
            { icon: "file-text", text: "News" }

          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 16,
                width: "48%",
                alignItems: "center",
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
              }}
              onPress={() =>
                item.navigateTo ? navigation.navigate(item.navigateTo) : null
              } // Navigate to the page if navigateTo exists
            >
              <View
                style={{
                  backgroundColor: "#E8F5E9",
                  padding: 12,
                  borderRadius: 9999,
                  marginBottom: 8
                }}
              >
                <Feather name={item.icon} size={24} color="#4CAF50" />
              </View>
              <Text style={{ color: "#4CAF50", fontWeight: "semibold" }}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={{
            color: "black",
            fontSize: 20,
            fontWeight: "bold",
            marginHorizontal: 16,
            marginBottom: 8
          }}
        >
          Contact Us
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 16,
            marginBottom: 24
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 9999,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flex: 1,
              marginRight: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
          >
            <Feather name="mail" size={20} color="#4CAF50" />
            <Text
              style={{
                color: "#4CAF50",
                fontWeight: "semibold",
                marginLeft: 8
              }}
            >
              Send Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#E8F5E9",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 9999,
              paddingVertical: 12,
              paddingHorizontal: 24,
              flex: 1,
              marginLeft: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}
          >
            <Feather name="phone" size={20} color="#4CAF50" />
            <Text
              style={{
                color: "#4CAF50",
                fontWeight: "semibold",
                marginLeft: 8
              }}
            >
              Call Now
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("GarbageMap")}>
          <View className="ml-10">
            <Text>Driver</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;