import { DispenseResult, HardwareStatus, PaymentResult, PaymentType, Product, ProductType, Screen } from "./types";

export interface IPaymentService {
  processPixPayment(amount: number): Promise<PaymentResult>;
  processCardPayment(amount: number, type: PaymentType): Promise<PaymentResult>;
}

export interface IVendingMachineService {
  dispenseProduct(productType: ProductType): Promise<DispenseResult>;
  checkHardwareStatus(): Promise<HardwareStatus>;
}

export interface IProductRepository {
  getAllProducts(): Product[];
  getProductById(id: ProductType): Product | undefined;
}

export interface INotificationService {
  showError(message: string): void;
  showSuccess(message: string): void;
}

export interface AppState {
  currentScreen: Screen;
  selectedProduct: Product | null;
  isLoading: boolean;
  loadingMessage: string;
  currentTime: Date;
}