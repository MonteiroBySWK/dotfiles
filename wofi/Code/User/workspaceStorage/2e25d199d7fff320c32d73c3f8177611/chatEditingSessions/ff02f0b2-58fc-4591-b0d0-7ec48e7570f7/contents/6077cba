import { ProductType } from "./enums";

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
  readonly status: "online" | "offline" | "maintenance";
  readonly temperature: number;
  readonly stockLevels: Record<ProductType, number>;
};

export type DispenseResult = {
  readonly success: boolean;
  readonly errorMessage?: string;
};
