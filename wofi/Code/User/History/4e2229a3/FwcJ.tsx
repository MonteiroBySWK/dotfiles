import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <View
        style={{
          width: screen.width,
          height: screen.height,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text>Hello</Text>
      </View>
    </SafeAreaView>
  );
}
