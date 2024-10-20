import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Book_a_pickup" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
