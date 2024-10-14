// components/GarbageMapView.tsx
import React from "react";
import { View, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Garbagetruck from "@/assets/images/garbagetruck.png";
import Garbagebag from "@/assets/images/garbageba.png";

const GarbageMapView = ({ mapRegion, currentLocation, pickupGarbage, onMarkerPress }) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      region={mapRegion}
      showsUserLocation={false}
      showsMyLocationButton={true}
    >
      {currentLocation && (
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Your Location"
        >
          <Image source={Garbagetruck} style={{ width: 40, height: 40 }} />
        </Marker>
      )}

      {pickupGarbage.map((pickup, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: pickup.location.latitude,
            longitude: pickup.location.longitude,
          }}
          title={pickup.location.address}
          description={`Garbage types: ${pickup.garbagetypes}`}
          onPress={() => onMarkerPress(pickup)}
        >
          <View style={{ padding: 5, borderRadius: 5 }}>
            <Image source={Garbagebag} style={{ width: 40, height: 40 }} />
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

export default GarbageMapView;
