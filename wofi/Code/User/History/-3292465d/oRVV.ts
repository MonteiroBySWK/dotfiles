 {
  getAllProducts(): Product[];
  getProductById(id: ProductType): Product | undefined;
}

interface INotificationService {
  showError(message: string): void;
  showSuccess(message: string): void;
}