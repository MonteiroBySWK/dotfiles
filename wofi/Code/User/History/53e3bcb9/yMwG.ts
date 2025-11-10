class VendingMachineService implements IVendingMachineService {
  async dispenseProduct(productType: ProductType): Promise<DispenseResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.02; // 98% success rate
        resolve({
          success,
          errorMessage: success ? undefined : 'Erro ao dispensar produto'
        });
      }, 1500);
    });
  }

  async checkHardwareStatus(): Promise<HardwareStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'online',
          temperature: 4,
          stockLevels: {
            [ProductType.BRIGADEIRO]: 15,
            [ProductType.COOKIE]: 8,
            [ProductType.BROWNIE]: 12,
            [ProductType.PUDIM]: 6,
            [ProductType.POTCAKE]: 10
          }
        });
      }, 500);
    });
  }
}