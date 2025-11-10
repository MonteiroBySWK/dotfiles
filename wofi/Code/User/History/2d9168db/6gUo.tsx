import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {login, loading} = useAuth();
  const router = useRouter();

  const handlerSubmit = () => {
    console.log(userId, password);
    router.push("/");
  };

  return (
    <SafeAreaView className="flex items-center justify-center h-full px-4 gap-y-3">
      <Text className="text-5xl font-bold">Login</Text>
      <View className="w-full gap-y-1">
        <Text className="font-semibold text-lg">ID Funcionario</Text>
        <TextInput
          className="bg-gray-400/30 rounded-md px-2"
          value={userId}
          onChangeText={setUserId}
          placeholder="Digite seu ID"
          autoCapitalize="none"
        />
      </View>
      <View className="w-full gap-y-1">
        <Text className="font-semibold text-lg">Senha</Text>
        <View className="flex-row items-center bg-gray-400/30 rounded-md px-2">
          <TextInput
            style={{ flex: 1 }}
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            <Text style={{ fontSize: 18, marginLeft: 8 }}>
              {showPassword ? "👁️" : "🙈"}
            </Text>
          </Pressable>
        </View>
      </View>
      <Pressable
        onPress={handlerSubmit}
        className="bg-[#2563eb] w-full text-center hover:bg-[#3b82f6] py-3 rounded-lg elevation"
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#2563eb" : "#3b82f6", // azul escuro/claro
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 12,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          },
        ]}
        accessibilityRole="button"
      >
        <Text className="text-white text-center font-bold text-md">
          Enviar
        </Text>
      </Pressable>{" "}
    </SafeAreaView>
  );
}
