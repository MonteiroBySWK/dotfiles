export class Programa {
  private id: number;
  private nome: string;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }

  public get id() {
    return this.id;
  }

}