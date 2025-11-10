import { LoadingOverlay } from '@/components/application/LoadingOverlay';
import { PaymentButton } from '@/components/application/PaymentButton';
import { ProductCard } from '@/components/application/ProductCard';
import { ScreenHeader } from '@/components/application/ScreenHeader';
import { useAppState } from '@/hooks/useAppState';
import { NotificationService } from '@/services/NotificationService';
import { PaymentService } from '@/services/PaymentService';
import { VendingMachineService } from '@/services/VendingMachineService';
import { INotificationService, IPaymentService, IProductRepository, IVendingMachineService } from '@/types/interfaces';
import { PaymentType, Product, ProductType, Screen } from '@/types/types';
import { ProcessOrderUseCase } from '@/usecases/ProcessOrderUseCase';
import {
  Check,
  Clock,
  CreditCard,
  ShoppingCart,
  Smartphone
} from 'lucide-react';
import React, { JSX, useEffect } from 'react';

// Repositório de produtos
class ProductRepository implements IProductRepository {
  private readonly products: Product[] = [
    {
      id: ProductType.BRIGADEIRO,
      name: 'Brigadeiros',
      price: 12.00,
      emoji: '🍫',
      color: '#8B4513'
    },
    {
      id: ProductType.COOKIE,
      name: 'Cookies',
      price: 8.00,
      emoji: '🍪',
      color: '#D2691E'
    },
    {
      id: ProductType.BROWNIE,
      name: 'Brownies',
      price: 15.00,
      emoji: '🧁',
      color: '#654321'
    },
    {
      id: ProductType.PUDIM,
      name: 'Pudim',
      price: 10.00,
      emoji: '🍮',
      color: '#FFD700'
    },
    {
      id: ProductType.POTCAKE,
      name: 'Bolo de Pote',
      price: 9.00,
      emoji: '🫙',
      color: '#FF69B4'
    }
  ];

  getAllProducts(): Product[] {
    return [...this.products];
  }

  getProductById(id: ProductType): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}

// Componente principal da aplicação
const Index: React.FC = () => {
  // Injeção de dependências (DIP)
  const paymentService: IPaymentService = new PaymentService();
  const vendingMachineService: IVendingMachineService = new VendingMachineService();
  const productRepository: IProductRepository = new ProductRepository();
  const notificationService: INotificationService = new NotificationService();
  
  const processOrderUseCase = new ProcessOrderUseCase(
    paymentService,
    vendingMachineService,
    notificationService
  );

  // Estado da aplicação
  const { state, updateState } = useAppState({
    currentScreen: Screen.HOME,
    selectedProduct: null,
    isLoading: false,
    loadingMessage: '',
    currentTime: new Date()
  } as AppState);

  // Atualização do relógio
  useEffect(() => {
    const timer = setInterval(() => {
      updateState({ currentTime: new Date() });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleNavigateToScreen = (screen: Screen) => {
    updateState({ currentScreen: screen });
  };

  const handleProductSelect = (product: Product) => {
    updateState({ selectedProduct: product, currentScreen: Screen.PAYMENT_METHOD });
  };

  const handlePaymentSelect = async (paymentType: PaymentType) => {
    if (!state.selectedProduct) return;

    updateState({ isLoading: true, loadingMessage: 'Processando pagamento...' });

    if (paymentType === PaymentType.PIX) {
      updateState({ currentScreen: Screen.PIX_PAYMENT });
      setTimeout(async () => {
        await processPayment(paymentType);
      }, 3000);
    } else {
      updateState({ currentScreen: Screen.CARD_PAYMENT });
      await processPayment(paymentType);
    }
  };

  const processPayment = async (paymentType: PaymentType) => {
    if (!state.selectedProduct) return;

    const result = await processOrderUseCase.execute(state.selectedProduct, paymentType);
    
    updateState({ isLoading: false });
    
    if (result.success) {
      updateState({ currentScreen: Screen.SUCCESS });
    } else {
      updateState({ currentScreen: Screen.PAYMENT_METHOD });
    }
  };

  const handleNewOrder = () => {
    updateState({
      selectedProduct: null,
      currentScreen: Screen.HOME,
      isLoading: false,
      loadingMessage: ''
    });
  };

  // ========================= SCREEN COMPONENTS =========================

  const HomeScreen: React.FC = () => (
    <div className="screen home-screen">
      <div className="status-bar">
        <div className="time">
          <Clock size={16} />
          {state.currentTime.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      <div className="brand-header">
        <h1 className="brand-title">mario's</h1>
        <p className="brand-subtitle">BRIGADEIRO GOURMET</p>
      </div>
      
      <div className="welcome-container">
        <ShoppingCart size={80} color="#fff" />
        <h2 className="welcome-text">Bem-vindo!</h2>
        <p className="welcome-subtext">Escolha seus doces favoritos</p>
      </div>

      <button 
        className="start-button"
        onClick={() => handleNavigateToScreen(Screen.PRODUCTS)}
      >
        FAZER MEU PEDIDO
      </button>

      <div className="footer">
        <p className="footer-text">Nosso Instagram:</p>
        <p className="instagram-handle">@mariosbrigadeiros</p>
      </div>
    </div>
  );

  const ProductsScreen: React.FC = () => {
    const products = productRepository.getAllProducts();
    
    return (
      <div className="screen products-screen">
        <ScreenHeader 
          title="Escolha seu doce"
          onBack={() => handleNavigateToScreen(Screen.HOME)}
        />

        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onSelect={handleProductSelect}
            />
          ))}
        </div>
      </div>
    );
  };

  const PaymentMethodScreen: React.FC = () => (
    <div className="screen payment-method-screen">
      <ScreenHeader 
        title="Forma de Pagamento"
        onBack={() => handleNavigateToScreen(Screen.PRODUCTS)}
      />

      {state.selectedProduct && (
        <div className="selected-product">
          <h3>{state.selectedProduct.name}</h3>
          <p className="selected-price">R$ {state.selectedProduct.price.toFixed(2)}</p>
        </div>
      )}

      <div className="payment-methods">
        <PaymentButton 
          type="PIX"
          icon={Smartphone}
          onPress={() => handlePaymentSelect(PaymentType.PIX)}
        />
        
        <PaymentButton 
          type="CARTÃO"
          icon={CreditCard}
          onPress={() => handleNavigateToScreen(Screen.CARD_PAYMENT)}
        />
      </div>
    </div>
  );

  const PixPaymentScreen: React.FC = () => (
    <div className="screen pix-payment-screen">
      <ScreenHeader 
        title="Pagamento PIX"
        onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
      />

      <div className="qr-code-container">
        <div className="qr-code-placeholder">
          <div className="qr-pattern"></div>
          <p className="qr-code-text">QR CODE PIX</p>
          <p className="qr-code-amount">
            R$ {state.selectedProduct?.price.toFixed(2)}
          </p>
        </div>
        
        <p className="pix-instructions">
          Escaneie o código QR com seu banco para pagar
        </p>
      </div>
    </div>
  );

  const CardPaymentScreen: React.FC = () => (
    <div className="screen card-payment-screen">
      <ScreenHeader 
        title="Pagamento Cartão"
        onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
      />

      <div className="card-payment-container">
        <p className="card-instructions">
          Insira ou aproxime seu cartão na máquina
        </p>
        
        <div className="card-terminal-illustration">
          <div className="terminal-screen">
            <p>R$ {state.selectedProduct?.price.toFixed(2)}</p>
            <p>Insira o cartão</p>
          </div>
        </div>
        
        <div className="card-options">
          <PaymentButton 
            type="CRÉDITO"
            icon={CreditCard}
            onPress={() => handlePaymentSelect(PaymentType.CREDIT_CARD)}
          />
          
          <PaymentButton 
            type="DÉBITO"
            icon={CreditCard}
            onPress={() => handlePaymentSelect(PaymentType.DEBIT_CARD)}
          />
        </div>
      </div>
    </div>
  );

  const ProcessingScreen: React.FC = () => (
    <div className="screen processing-screen">
      <div className="processing-container">
        <div className="processing-spinner"></div>
        <h3 className="processing-text">Processando pagamento...</h3>
        <p className="processing-subtext">Aguarde um momento</p>
      </div>
    </div>
  );

  const SuccessScreen: React.FC = () => (
    <div className="screen success-screen">
      <div className="success-container">
        <div className="success-icon">
          <Check size={80} />
        </div>
        <h2 className="success-title">
          PAGAMENTO REALIZADO COM SUCESSO
        </h2>
        <h3 className="success-message">Que seu doce! 🍫</h3>
        <p className="success-instructions">
          Retire seu <strong>{state.selectedProduct?.name}</strong> no compartimento abaixo
        </p>
        
        <div className="dispensing-animation">
          <div className="product-falling">
            <span style={{ fontSize: '40px' }}>
              {state.selectedProduct?.emoji}
            </span>
          </div>
        </div>
      </div>

      <button className="new-order-button" onClick={handleNewOrder}>
        NOVO PEDIDO
      </button>
    </div>
  );

  // Renderização condicional das telas
  const renderScreen = (): JSX.Element => {
    switch (state.currentScreen) {
      case Screen.HOME: return <HomeScreen />;
      case Screen.PRODUCTS: return <ProductsScreen />;
      case Screen.PAYMENT_METHOD: return <PaymentMethodScreen />;
      case Screen.PIX_PAYMENT: return <PixPaymentScreen />;
      case Screen.CARD_PAYMENT: return <CardPaymentScreen />;
      case Screen.PROCESSING: return <ProcessingScreen />;
      case Screen.SUCCESS: return <SuccessScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
      <LoadingOverlay 
        visible={state.isLoading} 
        message={state.loadingMessage} 
      />
      
      <style jsx>{`
        .app {
          width: 100vw;
          height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow: hidden;
        }

        .screen {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #FF6B9D 0%, #87CEEB 100%);
          display: flex;
          flex-direction: column;
          color: white;
          position: relative;
        }

        /* Status bar */
        .status-bar {
          display: flex;
          justify-content: flex-end;
          padding: 10px 20px;
          background: rgba(0,0,0,0.2);
        }

        .time {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 500;
        }

        /* Home screen */
        .brand-header {
          text-align: center;
          padding: 40px 20px 20px;
        }

        .brand-title {
          font-size: 72px;
          font-weight: 900;
          margin: 0;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
          letter-spacing: -2px;
        }

        .brand-subtitle {
          font-size: 18px;
          letter-spacing: 3px;
          margin: 10px 0 0 0;
          opacity: 0.95;
          font-weight: 600;
        }

        .welcome-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 40px;
          gap: 20px;
        }

        .welcome-text {
          font-size: 48px;
          font-weight: 700;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .welcome-subtext {
          font-size: 24px;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .start-button {
          background: linear-gradient(45deg, #FF1493, #FF69B4);
          border: none;
          color: white;
          font-size: 24px;
          font-weight: 700;
          padding: 25px 50px;
          border-radius: 50px;
          margin: 20px 40px 30px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(255, 20, 147, 0.4);
          transition: all 0.3s ease;
          letter-spacing: 1px;
        }

        .start-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 20, 147, 0.6);
        }

        .footer {
          text-align: center;
          padding: 20px;
          background: rgba(0,0,0,0.1);
        }

        .footer-text {
          margin: 0;
          font-size: 16px;
          opacity: 0.8;
        }

        .instagram-handle {
          margin: 5px 0 0 0;
          font-size: 20px;
          font-weight: 700;
        }

        /* Screen header */
        .screen-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background: rgba(0,0,0,0.1);
        }

        .back-button {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-button:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .screen-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 20px;
          flex: 1;
        }

        .header-spacer {
          width: 48px;
        }

        /* Products grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 25px;
          padding: 30px;
          flex: 1;
          align-content: start;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border: 3px solid transparent;
        }

        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
          border-color: #FF69B4;
        }

        .product-image-container {
          margin-bottom: 15px;
        }

        .product-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .product-emoji {
          font-size: 36px;
        }

        .product-name {
          color: #333;
          font-size: 22px;
          font-weight: 700;
          margin: 15px 0 10px 0;
        }

        .product-price {
          color: #FF1493;
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }

        /* Selected product */
        .selected-product {
          background: rgba(255,255,255,0.95);
          margin: 20px;
          padding: 25px;
          border-radius: 20px;
          text-align: center;
          color: #333;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .selected-product h3 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 10px 0;
        }

        .selected-price {
          font-size: 32px;
          color: #FF1493;
          font-weight: 800;
          margin: 0;
        }

        /* Payment methods */
        .payment-methods {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 25px;
          padding: 40px;
        }

        .payment-button {
          background: linear-gradient(45deg, #FF1493, #FF69B4);
          border: none;
          color: white;
          padding: 25px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-size: 24px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 20, 147, 0.4);
        }

        .payment-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 20, 147, 0.6);
        }

        .payment-button.disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* PIX payment */
        .qr-code-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          gap: 30px;
        }

        .qr-code-placeholder {
          width: 300px;
          height: 300px;
          background: white;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .qr-pattern {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 80px;
          background-image: 
            linear-gradient(90deg, #333 1px, transparent 1px),
            linear-gradient(#333 1px, transparent 1px);
          background-size: 12px 12px;
          opacity: 0.8;
        }

        .qr-code-text {
          color: #333;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          z-index: 1;
          position: relative;
          background: white;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .qr-code-amount {
          color: #FF1493;
          font-size: 28px;
          font-weight: 800;
          margin: 10px 0 0 0;
          z-index: 1;
          position: relative;
          background: white;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .pix-instructions {
          font-size: 20px;
          text-align: center;
          line-height: 1.5;
          max-width: 400px;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
        }

        /* Card payment */
        .card-payment-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px;
          gap: 40px;
        }

        .card-instructions {
          font-size: 22px;
          text-align: center;
          line-height: 1.5;
        }

        .card-terminal-illustration {
          display: flex;
          justify-content: center;
        }

        .terminal-screen {
          width: 200px;
          height: 120px;
          background: #2c3e50;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 18px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .card-options {
          display: flex;
          gap: 20px;
        }

        /* Processing screen */
        .processing-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
        }

        .processing-spinner {
          width: 80px;
          height: 80px;
          border: 8px solid rgba(255,255,255,0.3);
          border-top: 8px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .processing-text {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .processing-subtext {
          font-size: 18px;
          opacity: 0.8;
          margin: 0;
        }

        /* Success screen */
        .success-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
          gap: 25px;
          text-align: center;
        }

        .success-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #4CAF50, #45a049);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
          animation: successPulse 2s infinite;
        }

        .success-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .success-message {
          font-size: 40px;
          font-weight: 800;
          margin: 0;
          color: #FFD700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .success-instructions {
          font-size: 20px;
          line-height: 1.5;
          background: rgba(255,255,255,0.95);
          color: #333;
          padding: 20px;
          border-radius: 15px;
          max-width: 500px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .dispensing-animation {
          margin: 20px 0;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-falling {
          animation: fall 2s ease-in infinite;
        }

        .new-order-button {
          background: linear-gradient(45deg, #4CAF50, #45a049);
          border: none;
          color: white;
          font-size: 24px;
          font-weight: 700;
          padding: 25px 50px;
          border-radius: 50px;
          margin: 0 40px 30px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          transition: all 0.3s ease;
        }

        .new-order-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(76, 175, 80, 0.6);
        }

        /* Loading overlay */
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .loading-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          min-width: 300px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FF69B4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .loading-text {
          color: #333;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes successPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .brand-title {
            font-size: 48px;
          }
          
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            padding: 20px;
          }
          
          .card-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;