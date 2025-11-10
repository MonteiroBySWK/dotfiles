import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles/styles";

interface PaymentButtonProps {
  type: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ type, icon: Icon, onPress, disabled = false }) => (
  <TouchableOpacity
    style={[styles.paymentButton, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
  >
    <Icon size={32} color="white" />
    <Text style={styles.paymentButtonText}>{type}</Text>
  </TouchableOpacity>
);

export default PaymentButton;
