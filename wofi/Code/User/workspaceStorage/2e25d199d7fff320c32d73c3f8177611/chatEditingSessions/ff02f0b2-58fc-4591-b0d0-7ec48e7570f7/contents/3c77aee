import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";

interface LinearGradientProps {
  colors: string[];
  style?: StyleProp<ViewStyle>;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  children: React.ReactNode;
}

const LinearGradient: React.FC<LinearGradientProps> = ({ colors, style, start, end, children }) => {
  return (
    <ExpoLinearGradient
      colors={colors}
      style={style}
      start={start}
      end={end}
    >
      {children}
    </ExpoLinearGradient>
  );
};

export default LinearGradient;