import { CreditCard } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import LinearGradient from "../components/LinearGradient";
import PaymentButton from "../components/PaymentButton";
import ScreenHeader from "../components/ScreenHeader";
import { PaymentType } from "../domain/enums";
import { Product } from "../domain/types";
import styles from "../styles/styles";

interface CardPaymentScreenProps {
  selectedProduct: Product | null;
  onBack: () => void;
  onSelect: (paymentType: PaymentType) => void;
}

const CardPaymentScreen: React.FC<CardPaymentScreenProps> = ({ selectedProduct, onBack, onSelect }) => (
  <LinearGradient
    colors={["#FF6B9D", "#87CEEB"]}
    style={styles.screen}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <ScreenHeader title="Pagamento Cartão" onBack={onBack} />
    <View style={styles.cardPaymentContainer}>
      <Text style={styles.cardInstructions}>
        Insira ou aproxime seu cartão na máquina
      </Text>
      <View style={styles.cardTerminalIllustration}>
        <View style={styles.terminalScreen}>
          <Text style={styles.terminalText}>
            R$ {selectedProduct?.price.toFixed(2)}
          </Text>
          <Text style={styles.terminalText}>Insira o cartão</Text>
        </View>
      </View>
      <View style={styles.cardOptions}>
        <PaymentButton
          type="CRÉDITO"
          icon={CreditCard}
          onPress={() => onSelect(PaymentType.CREDIT_CARD)}
        />
        <PaymentButton
          type="DÉBITO"
          icon={CreditCard}
          onPress={() => onSelect(PaymentType.DEBIT_CARD)}
        />
      </View>
    </View>
  </LinearGradient>
);

export default CardPaymentScreen;
