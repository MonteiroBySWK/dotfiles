export class Programa {
  private id: number;
  private nome: string;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }

  get id(): number {
    return this.id;
  }

}