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

  // Converte as keys da props em array
  public static getKeys(): (keyof ProgramaProps)[] {
    const tmp: ProgramaProps = {id: 0, nome: ""};
    return Object.keys(tmp) as (keyof ProgramaProps)[];
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }
}
