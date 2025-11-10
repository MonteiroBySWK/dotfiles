interface ProgramaProps {
  id: number,
  nome: string,
}

export class Programa {
  private props: ProgramaProps;

  constructor(id: number, nome: string) {
    this.props.id = id;
    this.props.nome = nome;
  }

  get id(): number {
    return this.id;
  }

}