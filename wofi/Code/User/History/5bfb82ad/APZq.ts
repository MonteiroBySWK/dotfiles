import { Product } from "@/types/types";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export interface PaymentButtonProps {
  type: string;
  icon: React.ComponentType<{ size: number }>;
  onPress: () => void;
  disabled?: boolean;
}

export interface LoadingOverlayProps {
  visible: boolean;
  message: string;
}

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}
