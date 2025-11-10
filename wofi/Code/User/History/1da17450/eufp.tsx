import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/styles";

interface LoadingOverlayProps {
  visible: boolean;
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message }) => {
  if (!visible) return null;
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <View style={styles.spinner} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

export default LoadingOverlay;
