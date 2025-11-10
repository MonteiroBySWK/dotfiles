interface ProgramaProps {
  id: number,
  nome: string,
}

export class Programa {
  private props: ProgramaProps;

  constructor(props: ProgramaProps) {
    this.props = props;
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome
  }

}