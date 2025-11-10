import { IToKeys } from "./IToKeys";

interface ProgramaProps {
  id: number;
  nome: string;
}

export class Programa implements IToKeys<Programa> {
  private props: ProgramaProps;

  constructor(props: ProgramaProps) {
    this.props = props;
  }

  public toKeys(): ProgramaProps {
    return { ...this.props };
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }
}
