import { IToGetKeys } from "./IToKeys";

interface ProgramaProps {
  id: number;
  nome: string;
}

export class Programa {
  private props: ProgramaProps;

  constructor(props: ProgramaProps) {
    this.props = props;
  }
  
  // Converte as keys da props em array
  static getKeys(): string[] {
    const tmp: ProgramaProps = { id: 0, nome: "" };
    return Object.keys(tmp) as string[];
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }
}
