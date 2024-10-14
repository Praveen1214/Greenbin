// components/PickupList.tsx
import React from "react";
import { FlatList, TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const PickupList = ({ pickups, selectedPickup, onPickupPress }) => {
  return (
    <FlatList
      data={pickups}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPickupPress(item)}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Feather name="map-pin" size={20} color="black" />
            <Text style={{ marginLeft: 8, fontSize: 16, color: "black" }}>
              {item.location.address}
            </Text>
            <View style={{ marginLeft: "auto", padding: 8 }}>
              <Feather
                name={selectedPickup === item ? "check-square" : "square"}
                size={20}
                color={selectedPickup === item ? "green" : "gray"}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default PickupList;
