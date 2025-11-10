import React from "react";
import { View } from "react-native";

const LinearGradient = ({ colors, style, start, end, children }: any) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>{children}</View>
  );
};

export default LinearGradient;
