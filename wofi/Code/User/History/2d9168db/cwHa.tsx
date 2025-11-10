import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView>
      <View>
        <Text>ID Funcionario</Text>
        <TextInput />
      </View>
    </SafeAreaView>
  )
}