import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "../components/LinearGradient";
import ScreenHeader from "../components/ScreenHeader";
import styles from "../styles/styles";
import { Product } from "../domain/types";

interface PixPaymentScreenProps {
  selectedProduct: Product | null;
  onBack: () => void;
}

const PixPaymentScreen: React.FC<PixPaymentScreenProps> = ({ selectedProduct, onBack }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <ScreenHeader title="Pagamento PIX" onBack={onBack} />
    <View style={styles.qrCodeContainer}>
      <View style={styles.qrCodePlaceholder}>
        <View style={styles.qrPattern} />
        <Text style={styles.qrCodeText}>QR CODE PIX</Text>
        <Text style={styles.qrCodeAmount}>
          R$ {selectedProduct?.price.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.pixInstructions}>
        Escaneie o código QR com seu banco para pagar
      </Text>
    </View>
  </LinearGradient>
);

export default PixPaymentScreen;
