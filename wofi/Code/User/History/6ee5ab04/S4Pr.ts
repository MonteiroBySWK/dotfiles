export enum Screen {
  HOME = 'home',
  PRODUCTS = 'products',
  PAYMENT_METHOD = 'payment-method',
  PIX_PAYMENT = 'pix-payment',
  CARD_PAYMENT = 'card-payment',
  PROCESSING = 'processing',
  SUCCESS = 'success'
}

export enum PaymentType {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD'
}

export enum ProductType {
  BRIGADEIRO = 'brigadeiro',
  COOKIE = 'cookie',
  BROWNIE = 'brownie',
  PUDIM = 'pudim',
  POTCAKE = 'potcake'
}

// Types para dados
export type Product = {
  readonly id: ProductType;
  readonly name: string;
  readonly price: number;
  readonly emoji: string;
  readonly color: string;
};

export type PaymentResult = {
  readonly success: boolean;
  readonly transactionId: string;
  readonly qrCode?: string;
  readonly errorMessage?: string;
};

export type HardwareStatus = {
  readonly status: 'online' | 'offline' | 'maintenance';
  readonly temperature: number;
  readonly stockLevels: Record<ProductType, number>;
};

export type DispenseResult = {
  readonly success: boolean;
  readonly errorMessage?: string;
};
