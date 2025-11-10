interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

interface PaymentButtonProps {
  type: string;
  icon: React.ComponentType<{ size: number }>;
  onPress: () => void;
  disabled?: boolean;
}

interface LoadingOverlayProps {
  visible: boolean;
  message: string;
}

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}
