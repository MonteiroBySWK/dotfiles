import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "../components/LinearGradient";
import styles from "../styles/styles";

const ProcessingScreen: React.FC = () => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.processingContainer}>
      <View style={styles.processingSpinner} />
      <Text style={styles.processingText}>Processando pagamento...</Text>
      <Text style={styles.processingSubtext}>Aguarde um momento</Text>
    </View>
  </LinearGradient>
);

export default ProcessingScreen;
