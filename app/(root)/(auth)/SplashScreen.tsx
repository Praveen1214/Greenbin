import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image } from "react-native";
import InitialRoute from "./InitialRoute";

const SplashScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for the splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View className= "items-center justify-center flex-1 bg-green-700" >
      {/* Logo Image */ }
      < Image
    source = { require("@/assets/images/logo-original.png") } // Replace with your logo path
    className = "mb-5 w-80 h-80" // Tailwind width, height, and margin-bottom
    resizeMode = "contain"
      />
      {/* Loading Indicator */ }
      < ActivityIndicator size = "large" color = "#fff" />
        </View>
    );
  }

return <InitialRoute />;
};

export default SplashScreen;