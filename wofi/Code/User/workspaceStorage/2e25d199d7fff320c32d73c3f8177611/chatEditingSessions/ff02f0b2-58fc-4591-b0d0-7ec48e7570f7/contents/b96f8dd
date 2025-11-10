import React from "react";
import { View, Text } from "react-native";
import LinearGradient from "../components/LinearGradient";
import ScreenHeader from "../components/ScreenHeader";
import PaymentButton from "../components/PaymentButton";
import styles from "../styles/styles";
import { PaymentType } from "../domain/enums";
import { Product } from "../domain/types";
import { Smartphone, CreditCard } from "lucide-react-native";

interface PaymentMethodScreenProps {
  selectedProduct: Product | null;
  onBack: () => void;
  onSelect: (paymentType: PaymentType) => void;
  onCard: () => void;
}

const PaymentMethodScreen: React.FC<PaymentMethodScreenProps> = ({ selectedProduct, onBack, onSelect, onCard }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <ScreenHeader title="Forma de Pagamento" onBack={onBack} />
    {selectedProduct && (
      <View style={styles.selectedProduct}>
        <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
        <Text style={styles.selectedPrice}>R$ {selectedProduct.price.toFixed(2)}</Text>
      </View>
    )}
    <View style={styles.paymentMethods}>
      <PaymentButton
        type="PIX"
        icon={Smartphone}
        onPress={() => onSelect(PaymentType.PIX)}
      />
      <PaymentButton
        type="CARTÃO"
        icon={CreditCard}
        onPress={onCard}
      />
    </View>
  </LinearGradient>
);

export default PaymentMethodScreen;
