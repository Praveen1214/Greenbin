import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_PLACES_API_KEY;

const GoogleTextInput = ({
  initialLocation,
  containerStyle,
  handlePress,
}: GoogleInputProps) => {
  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 ${containerStyle}`}
      style={{ margin: 0, padding: 0 }}
    >
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          container: {
            flex: 1,
            width: "100%",
          },
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 0,
            marginHorizontal: 0,
            padding: 0,
            position: "relative",
            shadowColor: "transparent",
          },
          textInput: {
            backgroundColor: "transparent",
            fontSize: 15,
            fontWeight: "700",
            margin: 0,
            padding: 0,
            height: 30, // Adjust this value as needed for your layout
            width: "100%",
          },
          listView: {
            backgroundColor: "white",
            top: 30, // Adjust this value to match the height of your textInput
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
