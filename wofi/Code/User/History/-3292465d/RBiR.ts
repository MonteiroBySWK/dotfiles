import { DispenseResult, HardwareStatus, PaymentResult, PaymentType, Product, ProductType } from "./types";

interface IPaymentService {
  processPixPayment(amount: number): Promise<PaymentResult>;
  processCardPayment(amount: number, type: PaymentType): Promise<PaymentResult>;
}

interface IVendingMachineService {
  dispenseProduct(productType: ProductType): Promise<DispenseResult>;
  checkHardwareStatus(): Promise<HardwareStatus>;
}

interface IProductRepository {
  getAllProducts(): Product[];
  getProductById(id: ProductType): Product | undefined;
}

interface INotificationService {
  showError(message: string): void;
  showSuccess(message: string): void;
}