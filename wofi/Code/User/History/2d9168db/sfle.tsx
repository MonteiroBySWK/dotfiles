import { Button } from "@react-navigation/elements";
import { Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  return (
    <SafeAreaView className="flex h-full justify-center mx-6">
      <Text className="text-3xl font-bold text-center py-4">Login</Text>
      <View className="flex gap-y-4">
        <View className="flex gap-y-2">
          <Text className="font-semibold">User ID</Text>
          <TextInput className="px-2 bg-gray-200" />
        </View>

        <View className="flex gap-y-2">
          <Text className="font-semibold">Password</Text>
          <TextInput className="px-2 bg-gray-200" />
        </View>
      </View>
      <Button className="rounded-none my-4">Entrar</Button>
    </SafeAreaView>
  );
}
