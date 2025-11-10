import { Stack } from "expo-router";

import "./globals.css";

const URL_API = "https://sentinelajava-api-production.up.railway.app/";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
