interface ServiceAreaProps {
  radius: number;
  cities: string;
  bairros: string[];
}

export class ServiceArea {
  constructor(private props: ServiceAreaProps) {
    this.props = props;
  }

  public setRadius() {

  }
}