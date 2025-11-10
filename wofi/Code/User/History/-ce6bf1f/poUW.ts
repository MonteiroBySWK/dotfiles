import { PaymentType } from "../../src/domain/enums";
import { INotificationService, IPaymentService, IVendingMachineService } from "../../src/domain/interfaces";
import { PaymentResult, Product } from "../../src/domain/types";

export class ProcessOrderUseCase {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly vendingMachineService: IVendingMachineService,
    private readonly notificationService: INotificationService
  ) {}

  async execute(
    product: Product,
    paymentType: PaymentType
  ): Promise<{ success: boolean; transactionId?: string }> {
    try {
      let paymentResult: PaymentResult;

      if (paymentType === PaymentType.PIX) {
        paymentResult = await this.paymentService.processPixPayment(product.price);
      } else {
        paymentResult = await this.paymentService.processCardPayment(product.price, paymentType);
      }

      if (!paymentResult.success) {
        this.notificationService.showError(paymentResult.errorMessage || "Erro no pagamento");
        return { success: false };
      }

      const dispenseResult = await this.vendingMachineService.dispenseProduct(product.id);

      if (!dispenseResult.success) {
        this.notificationService.showError(dispenseResult.errorMessage || "Erro ao dispensar produto");
        return { success: false };
      }

      return { success: true, transactionId: paymentResult.transactionId };
    } catch (error) {
      this.notificationService.showError("Erro inesperado no processamento");
      return { success: false };
    }
  }
}
