import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="factroyRequests" options={{ headerShown: false }} />
      <Stack.Screen name="residenceRequests" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
