import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const handlerSubmit = () => {
    // Mandar os dados para logar
  }

  

  return (
    <SafeAreaView>
      <View>
        <Text>ID Funcionario</Text>
        <TextInput />
      </View>
      <View>
        <Text>Senha</Text>
        <TextInput />
      </View>
    </SafeAreaView>
  )
}