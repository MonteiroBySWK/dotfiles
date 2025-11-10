import { PaymentType } from "../../src/domain/enums";
import { IPaymentService } from "../../src/domain/interfaces";
import { PaymentResult } from "../../src/domain/types";

export class PaymentService implements IPaymentService {
  async processPixPayment(amount: number): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        resolve({
          success,
          transactionId: success ? `PIX_${Date.now()}` : "",
          qrCode: success ? "PIX_QR_CODE_DATA" : undefined,
          errorMessage: success ? undefined : "Erro ao processar PIX",
        });
      }, 1000);
    });
  }

  async processCardPayment(amount: number, type: PaymentType): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05;
        resolve({
          success,
          transactionId: success ? `CARD_${Date.now()}` : "",
          errorMessage: success ? undefined : "Erro ao processar cartão",
        });
      }, 2000);
    });
  }
}
