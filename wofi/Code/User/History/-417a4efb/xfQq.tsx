import { PaymentButtonProps } from "@/types/props";
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  type,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.button, disabled && styles.disabled]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text style={styles.text}>{type}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF69B4',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
});