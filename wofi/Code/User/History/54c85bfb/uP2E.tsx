import { Stack } from "expo-router";

import "./globals.css";

const URL_API = "";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
