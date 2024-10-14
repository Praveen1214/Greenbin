import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Pay" options={{ headerShown: false }} />
      <Stack.Screen name="Recycle" options={{ headerShown: false }} />
      <Stack.Screen name="RequestedItemPayment" options={{ headerShown: false }} />
      <Stack.Screen name="Requestitem" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
