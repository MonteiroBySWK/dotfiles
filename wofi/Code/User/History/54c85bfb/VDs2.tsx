import { Stack } from "expo-router";

import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const password = "A3p@ssw0rd!";

export const URL_API = "https://sentinelajava-api-production.up.railway.app";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
