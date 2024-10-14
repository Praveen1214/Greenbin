// components/MapHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MapHeader = ({ onLogout }) => {
  const navigation = useNavigation();

  return (
    <View style={{ backgroundColor: "#0C6C41", padding: 16, marginTop: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "white",
              marginLeft: 16,
            }}
          >
            Garbage Map
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={onLogout} style={{ padding: 8 }}>
          <Feather name="log-out" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MapHeader;
