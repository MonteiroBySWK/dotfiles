import { PaymentType, ProductType } from "./enums";
import { DispenseResult, HardwareStatus, PaymentResult, Product } from "./types";

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
