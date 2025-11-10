
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Easing } from "react-native";
import { Screen, PaymentType } from "./domain/enums";
import { Product } from "./domain/types";
import { PaymentService } from "./services/PaymentService";
import { VendingMachineService } from "./services/VendingMachineService";
import { ProductRepository } from "./services/ProductRepository";
import { NotificationService } from "./services/NotificationService";
import { ProcessOrderUseCase } from "./services/ProcessOrderUseCase";
import HomeScreen from "./screens/HomeScreen";
import ProductsScreen from "./screens/ProductsScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import PixPaymentScreen from "./screens/PixPaymentScreen";
import CardPaymentScreen from "./screens/CardPaymentScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import SuccessScreen from "./screens/SuccessScreen";
import LoadingOverlay from "./components/LoadingOverlay";
import styles from "./styles/styles";

const MariosBrigadeiroApp: React.FC = () => {
  // Injeção de dependências
  const paymentService = new PaymentService();
  const vendingMachineService = new VendingMachineService();
  const productRepository = new ProductRepository();
  const notificationService = new NotificationService();
  const processOrderUseCase = new ProcessOrderUseCase(
    paymentService,
    vendingMachineService,
    notificationService
  );

  // Estado da aplicação
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const fallAnim = useRef(new Animated.Value(0)).current;

  // Atualização do relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleNavigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen(Screen.PAYMENT_METHOD);
  };

  const handlePaymentSelect = async (paymentType: PaymentType) => {
    if (!selectedProduct) return;
    setIsLoading(true);
    setLoadingMessage("Processando pagamento...");
    if (paymentType === PaymentType.PIX) {
      setCurrentScreen(Screen.PIX_PAYMENT);
      setTimeout(async () => {
        await processPayment(paymentType);
      }, 3000);
    } else {
      setCurrentScreen(Screen.CARD_PAYMENT);
      await processPayment(paymentType);
    }
  };

  const processPayment = async (paymentType: PaymentType) => {
    if (!selectedProduct) return;
    const result = await processOrderUseCase.execute(selectedProduct, paymentType);
    setIsLoading(false);
    if (result.success) {
      setCurrentScreen(Screen.SUCCESS);
      Animated.loop(
        Animated.sequence([
          Animated.timing(fallAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(fallAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      setCurrentScreen(Screen.PAYMENT_METHOD);
    }
  };

  const handleNewOrder = () => {
    setSelectedProduct(null);
    setCurrentScreen(Screen.HOME);
    setIsLoading(false);
    setLoadingMessage("");
    fallAnim.setValue(0);
  };

  // Interpolação para animação de queda
  const translateY = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, Dimensions.get("window").height * 0.3],
  });

  // Renderização condicional das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen currentTime={currentTime} onNavigate={handleNavigateToScreen} />;
      case Screen.PRODUCTS:
        return (
          <ProductsScreen
            products={productRepository.getAllProducts()}
            onBack={() => handleNavigateToScreen(Screen.HOME)}
            onSelect={handleProductSelect}
          />
        );
      case Screen.PAYMENT_METHOD:
        return (
          <PaymentMethodScreen
            selectedProduct={selectedProduct}
            onBack={() => handleNavigateToScreen(Screen.PRODUCTS)}
            onSelect={handlePaymentSelect}
            onCard={() => handleNavigateToScreen(Screen.CARD_PAYMENT)}
          />
        );
      case Screen.PIX_PAYMENT:
        return (
          <PixPaymentScreen
            selectedProduct={selectedProduct}
            onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
          />
        );
      case Screen.CARD_PAYMENT:
        return (
          <CardPaymentScreen
            selectedProduct={selectedProduct}
            onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
            onSelect={handlePaymentSelect}
          />
        );
      case Screen.PROCESSING:
        return <ProcessingScreen />;
      case Screen.SUCCESS:
        return (
          <SuccessScreen
            selectedProduct={selectedProduct}
            translateY={translateY}
            onNewOrder={handleNewOrder}
          />
        );
      default:
        return <HomeScreen currentTime={currentTime} onNavigate={handleNavigateToScreen} />;
    }
  };

  return (
    <>
      <div style={{ display: "flex", flex: 1 }}>
        {renderScreen()}
        <LoadingOverlay visible={isLoading} message={loadingMessage} />
      </div>
    </>
  );
};

export default MariosBrigadeiroApp;
