import { Stack } from "expo-router";

import "./globals.css";

export const URL_API = "https://sentinelajava-api-production.up.railway.app";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{headerShown: false}} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
