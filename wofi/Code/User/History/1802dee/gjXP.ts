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
    
    this.validate();
  }


  private validate() {
    if (this.props.rate < 0 || this.props.rate > 5) {
      throw new Error("Rating out of range");
    }

    if (!this.props.comment || !this.props.comment.trim()) {
      throw new Error("Comment nulls");
    }

    if (!this.props.reviewer || !this.props.customer) {
      throw new Error("Linking ids erros");
    }
  }


  public updateRate(newProps: RateProps): void {
    this.validate();

    this.props = {...newProps}
  }
  
}
