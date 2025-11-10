import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  ShoppingCart,
  Smartphone
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Serviços seguindo Clean Architecture
const PaymentService = {
  async processPixPayment(amount) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        success: true, 
        qrCode: 'PIX_QR_CODE_DATA',
        transactionId: `PIX_${Date.now()}`
      }), 1000);
    });
  },

  async processCardPayment(amount, type) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        success: true, 
        transactionId: `CARD_${Date.now()}`
      }), 2000);
    });
  }
};

const VendingMachineService = {
  async dispenseProduct(productType) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1500);
    });
  },

  async checkHardwareStatus() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        status: 'online',
        temperature: 4,
        stockLevels: { brigadeiro: 15, cookie: 8, brownie: 12 }
      }), 500);
    });
  }
};

// Componentes reutilizáveis
const ProductCard = ({ product, onSelect }) => (
  <div 
    className="product-card"
    onClick={() => onSelect(product)}
  >
    <div className="product-image-container">
      <div 
        className="product-icon"
        style={{ backgroundColor: product.color }}
      >
        <span className="product-emoji">{product.emoji}</span>
      </div>
    </div>
    <h3 className="product-name">{product.name}</h3>
    <p className="product-price">R$ {product.price.toFixed(2)}</p>
  </div>
);

const PaymentButton = ({ type, icon: Icon, onPress, disabled = false }) => (
  <button 
    className={`payment-button ${disabled ? 'disabled' : ''}`}
    onClick={onPress}
    disabled={disabled}
  >
    <Icon size={32} />
    <span>{type}</span>
  </button>
);

const LoadingOverlay = ({ visible, message }) => {
  if (!visible) return null;
  
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

// Componente principal
const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualização do relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dados dos produtos
  const products = [
    { 
      id: 'brigadeiro', 
      name: 'Brigadeiros', 
      price: 12.00, 
      emoji: '🍫',
      color: '#8B4513'
    },
    { 
      id: 'cookie', 
      name: 'Cookies', 
      price: 8.00, 
      emoji: '🍪',
      color: '#D2691E'
    },
    { 
      id: 'brownie', 
      name: 'Brownies', 
      price: 15.00, 
      emoji: '🧁',
      color: '#654321'
    },
    { 
      id: 'pudim', 
      name: 'Pudim', 
      price: 10.00, 
      emoji: '🍮',
      color: '#FFD700'
    },
    { 
      id: 'potcake', 
      name: 'Bolo de Pote', 
      price: 9.00, 
      emoji: '🫙',
      color: '#FF69B4'
    }
  ];

  // Tela inicial
  const HomeScreen = () => (
    <div className="screen home-screen">
      <div className="status-bar">
        <div className="time">
          <Clock size={16} />
          {currentTime.toLocaleTimeString('pt-BR', { 
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
        onClick={() => setCurrentScreen('products')}
      >
        FAZER MEU PEDIDO
      </button>

      <div className="footer">
        <p className="footer-text">Nosso Instagram:</p>
        <p className="instagram-handle">@mariosbrigadeiros</p>
      </div>
    </div>
  );

  // Tela de produtos
  const ProductsScreen = () => (
    <div className="screen products-screen">
      <div className="screen-header">
        <button 
          className="back-button"
          onClick={() => setCurrentScreen('home')}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="screen-title">Escolha seu doce</h2>
        <div className="header-spacer"></div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onSelect={(product) => {
              setSelectedProduct(product);
              setCurrentScreen('payment-method');
            }}
          />
        ))}
      </div>
    </div>
  );

  // Tela de método de pagamento
  const PaymentMethodScreen = () => (
    <div className="screen payment-method-screen">
      <div className="screen-header">
        <button 
          className="back-button"
          onClick={() => setCurrentScreen('products')}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="screen-title">Forma de Pagamento</h2>
        <div className="header-spacer"></div>
      </div>

      {selectedProduct && (
        <div className="selected-product">
          <h3>{selectedProduct.name}</h3>
          <p className="selected-price">R$ {selectedProduct.price.toFixed(2)}</p>
        </div>
      )}

      <div className="payment-methods">
        <PaymentButton 
          type="PIX"
          icon={Smartphone}
          onPress={() => setCurrentScreen('pix-payment')}
        />
        
        <PaymentButton 
          type="CARTÃO"
          icon={CreditCard}
          onPress={() => setCurrentScreen('card-payment')}
        />
      </div>
    </div>
  );

  // Tela de pagamento PIX
  const PixPaymentScreen = () => {
    useEffect(() => {
      handlePixPayment();
    }, []);

    const handlePixPayment = async () => {
      setIsLoading(true);
      setLoadingMessage('Gerando código PIX...');
      
      try {
        const result = await PaymentService.processPixPayment(selectedProduct.price);
        setIsLoading(false);
        
        if (result.success) {
          setTimeout(() => {
            setCurrentScreen('processing');
          }, 4000);
        }
      } catch (error) {
        setIsLoading(false);
        alert('Erro ao processar pagamento PIX');
      }
    };

    return (
      <div className="screen pix-payment-screen">
        <div className="screen-header">
          <button 
            className="back-button"
            onClick={() => setCurrentScreen('payment-method')}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="screen-title">Pagamento PIX</h2>
          <div className="header-spacer"></div>
        </div>

        <div className="qr-code-container">
          <div className="qr-code-placeholder">
            <div className="qr-pattern"></div>
            <p className="qr-code-text">QR CODE PIX</p>
            <p className="qr-code-amount">
              R$ {selectedProduct?.price.toFixed(2)}
            </p>
          </div>
          
          <p className="pix-instructions">
            Escaneie o código QR com seu banco para pagar
          </p>
        </div>
      </div>
    );
  };

  // Tela de pagamento cartão
  const CardPaymentScreen = () => {
    const handleCardPayment = async (type) => {
      setIsLoading(true);
      setLoadingMessage(`Processando ${type}...`);
      
      try {
        const result = await PaymentService.processCardPayment(
          selectedProduct.price, 
          type
        );
        
        if (result.success) {
          setCurrentScreen('processing');
        }
      } catch (error) {
        alert('Erro ao processar pagamento');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="screen card-payment-screen">
        <div className="screen-header">
          <button 
            className="back-button"
            onClick={() => setCurrentScreen('payment-method')}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="screen-title">Pagamento Cartão</h2>
          <div className="header-spacer"></div>
        </div>

        <div className="card-payment-container">
          <p className="card-instructions">
            Insira ou aproxime seu cartão na máquina
          </p>
          
          <div className="card-terminal-illustration">
            <div className="terminal-screen">
              <p>R$ {selectedProduct?.price.toFixed(2)}</p>
              <p>Insira o cartão</p>
            </div>
          </div>
          
          <div className="card-options">
            <PaymentButton 
              type="CRÉDITO"
              icon={CreditCard}
              onPress={() => handleCardPayment('credito')}
            />
            
            <PaymentButton 
              type="DÉBITO"
              icon={CreditCard}
              onPress={() => handleCardPayment('debito')}
            />
          </div>
        </div>
      </div>
    );
  };

  // Tela de processamento
  const ProcessingScreen = () => {
    useEffect(() => {
      handleDispenseProduct();
    }, []);

    const handleDispenseProduct = async () => {
      setIsLoading(true);
      setLoadingMessage('Preparando seu pedido...');
      
      try {
        await VendingMachineService.dispenseProduct(selectedProduct.id);
        setCurrentScreen('success');
      } catch (error) {
        alert('Erro ao dispensar produto');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="screen processing-screen">
        <div className="processing-container">
          <div className="processing-spinner"></div>
          <h3 className="processing-text">
            Processando pagamento...
          </h3>
          <p className="processing-subtext">
            Aguarde um momento
          </p>
        </div>
      </div>
    );
  };

  // Tela de sucesso
  const SuccessScreen = () => (
    <div className="screen success-screen">
      <div className="success-container">
        <div className="success-icon">
          <Check size={80} />
        </div>
        <h2 className="success-title">
          PAGAMENTO REALIZADO COM SUCESSO
        </h2>
        <h3 className="success-message">
          Que seu doce! 🍫
        </h3>
        <p className="success-instructions">
          Retire seu <strong>{selectedProduct?.name}</strong> no compartimento abaixo
        </p>
        
        <div className="dispensing-animation">
          <div className="product-falling">
            <span style={{ fontSize: '40px' }}>
              {selectedProduct?.emoji}
            </span>
          </div>
        </div>
      </div>

      <button 
        className="new-order-button"
        onClick={() => {
          setSelectedProduct(null);
          setCurrentScreen('home');
        }}
      >
        NOVO PEDIDO
      </button>
    </div>
  );

  // Renderização condicional das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home': return <HomeScreen />;
      case 'products': return <ProductsScreen />;
      case 'payment-method': return <PaymentMethodScreen />;
      case 'pix-payment': return <PixPaymentScreen />;
      case 'card-payment': return <CardPaymentScreen />;
      case 'processing': return <ProcessingScreen />;
      case 'success': return <SuccessScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
      
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