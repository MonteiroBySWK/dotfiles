import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlerSubmit = () => {
    console.log(userId, password);
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
            className=""
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            <Text style={{ fontSize: 18, marginLeft: 8 }}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </Pressable>
        </View>
      </View>
      <Button title="Enviar" onPress={handlerSubmit} />
    </SafeAreaView>
  );
}
