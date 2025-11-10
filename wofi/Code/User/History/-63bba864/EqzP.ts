interface ServiceAreaProps {
  radius: number; // precisa definir em relação ao que
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