import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        
          width: "100%",
          height: "100%"
        }}
      >
        <Text>Hello</Text>
      </View>
    </SafeAreaView>
  );
}
