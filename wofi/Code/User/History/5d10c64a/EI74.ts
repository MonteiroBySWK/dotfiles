import { IToKeys } from "./IToKeys";

interface ProgramaProps {
  id: number;
  nome: string;
}

export class Programa implements IToKeys<ProgramaProps> {
  private props: ProgramaProps;

  constructor(props: ProgramaProps) {
    this.props = props;
  }

  // Converte as keys da props em array
  public static getKeys(): (keyof ProgramaProps)[] {
    
    return Object.keys(this.props) as (keyof ProgramaProps)[];
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }
}
