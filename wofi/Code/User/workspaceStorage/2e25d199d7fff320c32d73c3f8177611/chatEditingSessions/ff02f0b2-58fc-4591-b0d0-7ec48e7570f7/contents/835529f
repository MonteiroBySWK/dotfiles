import { Check } from "lucide-react-native";
import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "../components/LinearGradient";
import { Product } from "../domain/types";
import styles from "../styles/styles";

interface SuccessScreenProps {
  selectedProduct: Product | null;
  translateY: Animated.AnimatedInterpolation<string | number>;
  onNewOrder: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ selectedProduct, translateY, onNewOrder }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.successContainer}>
      <View style={styles.successIcon}>
        <Check size={80} color="white" />
      </View>
      <Text style={styles.successTitle}>PAGAMENTO REALIZADO COM SUCESSO</Text>
      <Text style={styles.successMessage}>Que seu doce! 🍫</Text>
      <View style={styles.successInstructions}>
        <Text style={styles.successInstructionsText}>
          Retire seu <Text style={styles.boldText}>{selectedProduct?.name}</Text> no compartimento abaixo
        </Text>
      </View>
      <View style={styles.dispensingAnimation}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Text style={{ fontSize: 40 }}>{selectedProduct?.emoji}</Text>
        </Animated.View>
      </View>
    </View>
    <TouchableOpacity style={styles.newOrderButton} onPress={onNewOrder}>
      <Text style={styles.newOrderButtonText}>NOVO PEDIDO</Text>
    </TouchableOpacity>
  </LinearGradient>
);

export default SuccessScreen;
