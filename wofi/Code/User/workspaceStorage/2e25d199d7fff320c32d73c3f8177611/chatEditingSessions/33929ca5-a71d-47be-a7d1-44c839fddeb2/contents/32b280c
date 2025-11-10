import { ArrowLeft, Check, CreditCard, ShoppingCart, Smartphone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Simulação de serviços - seguindo Clean Architecture
const PaymentService = {
  async processPixPayment(amount) {
    // Simula processamento PIX
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        success: true, 
        qrCode: 'PIX_QR_CODE_DATA',
        transactionId: `PIX_${Date.now()}`
      }), 1000);
    });
  },

  async processCardPayment(amount, type) {
    // Simula processamento cartão
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
    // Simula comunicação com hardware do carrinho
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 1500);
    });
  }
};

// Componentes seguindo princípios SOLID
const ProductCard = ({ product, onSelect }) => (
  <TouchableOpacity 
    style={styles.productCard} 
    onPress={() => onSelect(product)}
    activeOpacity={0.8}
  >
    <View style={styles.productImageContainer}>
      <View style={[styles.productIcon, { backgroundColor: product.color }]}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
    </View>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
  </TouchableOpacity>
);

const PaymentButton = ({ type, icon: Icon, onPress, disabled }) => (
  <TouchableOpacity 
    style={[styles.paymentButton, disabled && styles.disabledButton]} 
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <Icon size={32} color="#fff" />
    <Text style={styles.paymentButtonText}>{type}</Text>
  </TouchableOpacity>
);

const LoadingOverlay = ({ visible, message }) => {
  if (!visible) return null;
  
  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

// Componente principal da aplicação
const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Dados dos produtos baseados na imagem
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>mario's</Text>
        <Text style={styles.brandSubtitle}>BRIGADEIRO GOURMET</Text>
      </View>
      
      <View style={styles.welcomeContainer}>
        <ShoppingCart size={80} color="#FF6B9D" />
        <Text style={styles.welcomeText}>Bem-vindo!</Text>
        <Text style={styles.welcomeSubtext}>Escolha seus doces favoritos</Text>
      </View>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={() => setCurrentScreen('products')}
        activeOpacity={0.8}
      >
        <Text style={styles.startButtonText}>FAZER MEU PEDIDO</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Nosso Instagram:</Text>
        <Text style={styles.instagramHandle}>@mariosbrigadeiros</Text>
      </View>
    </View>
  );

  // Tela de produtos
  const ProductsScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <ArrowLeft size={24} color="#FF6B9D" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Escolha seu doce</Text>
      </View>

      <ScrollView contentContainerStyle={styles.productsGrid}>
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
      </ScrollView>
    </View>
  );

  // Tela de método de pagamento
  const PaymentMethodScreen = () => (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('products')}
        >
          <ArrowLeft size={24} color="#FF6B9D" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Forma de Pagamento</Text>
      </View>

      {selectedProduct && (
        <View style={styles.selectedProductContainer}>
          <Text style={styles.selectedProductText}>
            {selectedProduct.name}
          </Text>
          <Text style={styles.selectedProductPrice}>
            R$ {selectedProduct.price.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.paymentMethods}>
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
      </View>
    </View>
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
          // Simula tempo para escaneamento do QR Code
          setTimeout(() => {
            setCurrentScreen('processing');
          }, 3000);
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Erro', 'Falha ao processar pagamento PIX');
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.screenHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentScreen('payment-method')}
          >
            <ArrowLeft size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Pagamento PIX</Text>
        </View>

        <View style={styles.qrCodeContainer}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>QR CODE PIX</Text>
            <Text style={styles.qrCodeAmount}>
              R$ {selectedProduct?.price.toFixed(2)}
            </Text>
          </View>
          
          <Text style={styles.pixInstructions}>
            Escaneie o código QR com seu banco para pagar
          </Text>
        </View>
      </View>
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
        Alert.alert('Erro', 'Falha ao processar pagamento');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.screenHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setCurrentScreen('payment-method')}
          >
            <ArrowLeft size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Pagamento Cartão</Text>
        </View>

        <View style={styles.cardPaymentContainer}>
          <Text style={styles.cardInstructions}>
            Insira ou aproxime seu cartão na máquina
          </Text>
          
          <View style={styles.cardOptions}>
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
          </View>
        </View>
      </View>
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
        Alert.alert('Erro', 'Falha ao dispensar produto');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FF6B9D" />
          <Text style={styles.processingText}>
            Processando pagamento...
          </Text>
        </View>
      </View>
    );
  };

  // Tela de sucesso
  const SuccessScreen = () => (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <Check size={80} color="#4CAF50" />
        <Text style={styles.successTitle}>
          PAGAMENTO REALIZADO COM SUCESSO
        </Text>
        <Text style={styles.successMessage}>
          Que seu doce!
        </Text>
        <Text style={styles.successInstructions}>
          Retire seu {selectedProduct?.name} no compartimento
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.newOrderButton}
        onPress={() => {
          setSelectedProduct(null);
          setCurrentScreen('home');
        }}
      >
        <Text style={styles.newOrderButtonText}>NOVO PEDIDO</Text>
      </TouchableOpacity>
    </View>
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
    <SafeAreaView style={styles.safeArea}>
      {renderScreen()}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
};

// Estilos baseados no design do carrinho
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #FF6B9D 0%, #87CEEB 100%)',
    background: 'linear-gradient(135deg, #FF6B9D 0%, #87CEEB 100%)',
  },
  
  // Header styles
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  brandTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  brandSubtitle: {
    fontSize: 16,
    color: '#fff',
    letterSpacing: 2,
    marginTop: 5,
  },
  
  // Welcome screen styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  welcomeSubtext: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginTop: 10,
  },
  
  // Button styles
  startButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginHorizontal: 40,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Footer styles
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  instagramHandle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  
  // Screen navigation styles
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  
  // Products grid styles
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    width: '42%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImageContainer: {
    marginBottom: 10,
  },
  productIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 24,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 18,
    color: '#FF1493',
    fontWeight: 'bold',
    marginTop: 5,
  },
  
  // Selected product styles
  selectedProductContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  selectedProductText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedProductPrice: {
    fontSize: 24,
    color: '#FF1493',
    fontWeight: 'bold',
    marginTop: 5,
  },
  
  // Payment methods styles
  paymentMethods: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  paymentButton: {
    backgroundColor: '#FF1493',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  
  // PIX payment styles
  qrCodeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
  },
  qrCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  qrCodeAmount: {
    fontSize: 24,
    color: '#FF1493',
    fontWeight: 'bold',
    marginTop: 10,
  },
  pixInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Card payment styles
  cardPaymentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  cardInstructions: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  cardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Processing styles
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  
  // Success styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 28,
    color: '#FF1493',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  successInstructions: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 15,
    borderRadius: 10,
  },
  newOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginHorizontal: 40,
    marginBottom: 30,
    elevation: 5,
  },
  newOrderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Loading overlay styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default Index;