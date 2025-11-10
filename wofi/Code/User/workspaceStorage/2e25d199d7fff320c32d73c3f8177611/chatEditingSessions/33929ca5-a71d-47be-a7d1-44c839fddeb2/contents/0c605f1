import { PaymentButtonProps } from "@/types/props";

export const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  type, 
  onPress, 
  disabled = false 
}) => (
  <button 
    className={`payment-button ${disabled ? 'disabled' : ''}`}
    onClick={onPress}
    disabled={disabled}
  >
    <span>{type}</span>
  </button>
);