interface ServiceAreaProps {
  radius: number;
  cities: string[];
}

export class ServiceArea {
  constructor(private props: ServiceAreaProps) {
    this.props = props;
  }
}