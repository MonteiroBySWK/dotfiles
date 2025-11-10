enum Screen {
  HOME = 'home',
  PRODUCTS = 'products',
  PAYMENT_METHOD = 'payment-method',
  PIX_PAYMENT = 'pix-payment',
  CARD_PAYMENT = 'card-payment',
  PROCESSING = 'processing',
  SUCCESS = 'success'
}

enum PaymentType {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD'
}

enum ProductType {
  BRIGADEIRO = 'brigadeiro',
  COOKIE = 'cookie',
  BROWNIE = 'brownie',
  PUDIM = 'pudim',
  POTCAKE = 'potcake'
}

// Types para dados
type Product = {
  readonly id: ProductType;
  readonly name: string;
  readonly price: number;
  readonly emoji: string;
  readonly color: string;
};

type PaymentResult = {
  readonly success: boolean;
  readonly transactionId: string;
  readonly qrCode?: string;
  readonly errorMessage?: string;
};

type HardwareStatus = {
  readonly status: 'online' | 'offline' | 'maintenance';
  readonly temperature: number;
  readonly stockLevels: Record<ProductType, number>;
};

export type DispenseResult = {
  readonly success: boolean;
  readonly errorMessage?: string;
};
