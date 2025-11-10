import { User } from "../user/User";

interface RateProps {
  reviewer: User;
  customer: User;

  rate: number; // 0 a 5
  comment: string;
}

export class Rate {
  constructor(private props: RateProps) {
    this.props = props;
  }
}
