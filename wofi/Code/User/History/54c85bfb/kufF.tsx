import { Stack } from "expo-router";

import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

const _ = {
  id: "5b8017e8-3d54-467b-a37a-0065c3256680",
  name: "monteiro",
  email: "test@test.com.br",
};

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
