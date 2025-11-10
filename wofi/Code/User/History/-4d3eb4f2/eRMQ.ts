import type User from "./User.js";

export interface PaymentProps {
  user: User;
  operation: string;
}

export default class Payment {
  constructor(private id: number, private props: PaymentProps) {
  
  }

  private validate(): boolean {
     return true;
  }

}