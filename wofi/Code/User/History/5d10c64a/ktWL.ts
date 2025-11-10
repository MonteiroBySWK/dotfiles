import { DataProps, IDataType } from "./IDataType";

interface ProgramaProps extends DataProps {
  id: number;
  nome: string;
}

export class Programa implements IDataType {
  private props: ProgramaProps;

  constructor(props: ProgramaProps) {
    this.props = props;
  }

  public toObject(): ProgramaProps {
    return { ...this.props };
  }

  get id(): number {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }
}
