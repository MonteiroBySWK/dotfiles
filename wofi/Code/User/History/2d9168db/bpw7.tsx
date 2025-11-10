import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const handlerSubmit = () => {
    // Mandar os dados para logar
  }


  return (
    <SafeAreaView className="flex items-center justify-center h-full">
      <Text>Login</Text>
      <View>
        <Text>ID Funcionario</Text>
        <TextInput />
      </View>
      <View>
        <Text>Senha</Text>
        <TextInput />
      </View>
      <Button title="Enviar">Enviar</Button>
    </SafeAreaView>
  )
}