import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handlerSubmit = () => {
    // Mandar os dados para logar
  };

  return (
    <SafeAreaView className="flex items-center justify-center h-full px-4 gap-y-3">
      <Text className="text-5xl font-bold">Login</Text>
      <View className="w-full gap-y-1">
        <Text className="font-semibold text-lg">ID Funcionario</Text>
        <TextInput className="bg-gray-400/30 rounded-md px-2" />
      </View>
      <View className="w-full gap-y-1">
        <Text className="font-semibold text-lg">Senha</Text>
        <TextInput className="bg-gray-400/30 rounded-md px-2" />
      </View>
      <Button title="Enviar"></Button>
    </SafeAreaView>
  );
}
