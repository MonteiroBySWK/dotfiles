const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  type, 
  icon: Icon, 
  onPress, 
  disabled = false 
}) => (
  <button 
    className={`payment-button ${disabled ? 'disabled' : ''}`}
    onClick={onPress}
    disabled={disabled}
  >
    <Icon size={32} />
    <span>{type}</span>
  </button>
);