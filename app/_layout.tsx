import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";

import SplashScreen from "./(root)/(auth)/SplashScreen";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const [isAppReady, setIsAppReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if fonts are loaded and set app as ready
  useEffect(() => {
    if (fontsLoaded) {
      setIsAppReady(true);
    }
  }, [fontsLoaded]);

  // Simulate app loading time (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, []);

  // Show splash screen while fonts are loading or the app is still loading
  if (!isAppReady || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(root)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
