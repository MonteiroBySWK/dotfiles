import { ProductType } from "../../src/domain/enums";
import { IProductRepository } from "../../src/domain/interfaces";
import { Product } from "../../src/domain/types";

export class ProductRepository implements IProductRepository {
  private readonly products: Product[] = [
    {
      id: ProductType.BRIGADEIRO,
      name: "Brigadeiros",
      price: 12.0,
      emoji: "🍫",
      color: "#8B4513",
    },
    {
      id: ProductType.COOKIE,
      name: "Cookies",
      price: 8.0,
      emoji: "🍪",
      color: "#D2691E",
    },
    {
      id: ProductType.BROWNIE,
      name: "Brownies",
      price: 15.0,
      emoji: "🧁",
      color: "#654321",
    },
    {
      id: ProductType.PUDIM,
      name: "Pudim",
      price: 10.0,
      emoji: "🍮",
      color: "#FFD700",
    },
    {
      id: ProductType.POTCAKE,
      name: "Bolo de Pote",
      price: 9.0,
      emoji: "🫙",
      color: "#FF69B4",
    },
  ];

  getAllProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: ProductType): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
