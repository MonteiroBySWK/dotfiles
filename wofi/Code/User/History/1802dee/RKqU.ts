import { User } from "../user/User";

interface RateProps {
  reviewer: User;
  customer: User;

  rate: number; // 0 a 5
  comment: string;
}

export class Rate {
  constructor(private props: RateProps) {
    this.validate();

    this.props = props;
  }


  private validate(props: RateProps) {
    if (props.rate < 0 || props.rate > 5) {
      throw new Error("Rating out of range");
    }

    if (!props.comment || !props.comment.trim()) {
      throw new Error("Comment nulls");
    }

    if (!props.reviewer || !props.customer) {
      throw new Error("Linking ids erros");
    }
  }
}
