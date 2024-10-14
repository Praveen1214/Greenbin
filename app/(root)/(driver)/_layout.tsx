import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="GarbageMap" options={{ headerShown: false }} />
      <Stack.Screen name="Track" options={{ headerShown: false }} />
      <Stack.Screen name="ViewPickup" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
