import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <Text>Hello</Text>
        <Pressable><Text>Yes</Text></Pressable>
      </View>
  );
}
