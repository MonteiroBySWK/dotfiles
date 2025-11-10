import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  ShoppingCart,
  Smartphone,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Enums para constantes
enum Screen {
  HOME = "home",
  PRODUCTS = "products",
  PAYMENT_METHOD = "payment-method",
  PIX_PAYMENT = "pix-payment",
  CARD_PAYMENT = "card-payment",
  PROCESSING = "processing",
  SUCCESS = "success",
}

enum PaymentType {
  PIX = "PIX",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
}

enum ProductType {
  BRIGADEIRO = "brigadeiro",
  COOKIE = "cookie",
  BROWNIE = "brownie",
  PUDIM = "pudim",
  POTCAKE = "potcake",
}

// Types para dados
type Product = {
  readonly id: ProductType;
  readonly name: string;
  readonly price: number;
  readonly emoji: string;
  readonly color: string;
};

type PaymentResult = {
  readonly success: boolean;
  readonly transactionId: string;
  readonly qrCode?: string;
  readonly errorMessage?: string;
};

type HardwareStatus = {
  readonly status: "online" | "offline" | "maintenance";
  readonly temperature: number;
  readonly stockLevels: Record<ProductType, number>;
};

type DispenseResult = {
  readonly success: boolean;
  readonly errorMessage?: string;
};

// ========================= INTERFACES (ISP - Interface Segregation) =========================

interface IPaymentService {
  processPixPayment(amount: number): Promise<PaymentResult>;
  processCardPayment(amount: number, type: PaymentType): Promise<PaymentResult>;
}

interface IVendingMachineService {
  dispenseProduct(productType: ProductType): Promise<DispenseResult>;
  checkHardwareStatus(): Promise<HardwareStatus>;
}

interface IProductRepository {
  getAllProducts(): Product[];
  getProductById(id: ProductType): Product | undefined;
}

interface INotificationService {
  showError(message: string): void;
  showSuccess(message: string): void;
}

// ========================= IMPLEMENTATIONS (SRP - Single Responsibility) =========================

// Implementação do serviço de pagamento
class PaymentService implements IPaymentService {
  async processPixPayment(amount: number): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        resolve({
          success,
          transactionId: success ? `PIX_${Date.now()}` : "",
          qrCode: success ? "PIX_QR_CODE_DATA" : undefined,
          errorMessage: success ? undefined : "Erro ao processar PIX",
        });
      }, 1000);
    });
  }

  async processCardPayment(
    amount: number,
    type: PaymentType
  ): Promise<PaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% success rate
        resolve({
          success,
          transactionId: success ? `CARD_${Date.now()}` : "",
          errorMessage: success ? undefined : "Erro ao processar cartão",
        });
      }, 2000);
    });
  }
}

// Implementação do serviço de máquina de vendas
class VendingMachineService implements IVendingMachineService {
  async dispenseProduct(productType: ProductType): Promise<DispenseResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.02; // 98% success rate
        resolve({
          success,
          errorMessage: success ? undefined : "Erro ao dispensar produto",
        });
      }, 1500);
    });
  }

  async checkHardwareStatus(): Promise<HardwareStatus> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "online",
          temperature: 4,
          stockLevels: {
            [ProductType.BRIGADEIRO]: 15,
            [ProductType.COOKIE]: 8,
            [ProductType.BROWNIE]: 12,
            [ProductType.PUDIM]: 6,
            [ProductType.POTCAKE]: 10,
          },
        });
      }, 500);
    });
  }
}

// Repositório de produtos
class ProductRepository implements IProductRepository {
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

// Serviço de notificações
class NotificationService implements INotificationService {
  showError(message: string): void {
    alert(`Erro: ${message}`);
  }

  showSuccess(message: string): void {
    alert(`Sucesso: ${message}`);
  }
}

// ========================= USE CASES (SRP - Single Responsibility) =========================

// Caso de uso para processar pedido
class ProcessOrderUseCase {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly vendingMachineService: IVendingMachineService,
    private readonly notificationService: INotificationService
  ) {}

  async execute(
    product: Product,
    paymentType: PaymentType
  ): Promise<{ success: boolean; transactionId?: string }> {
    try {
      let paymentResult: PaymentResult;

      if (paymentType === PaymentType.PIX) {
        paymentResult = await this.paymentService.processPixPayment(
          product.price
        );
      } else {
        paymentResult = await this.paymentService.processCardPayment(
          product.price,
          paymentType
        );
      }

      if (!paymentResult.success) {
        this.notificationService.showError(
          paymentResult.errorMessage || "Erro no pagamento"
        );
        return { success: false };
      }

      const dispenseResult = await this.vendingMachineService.dispenseProduct(
        product.id
      );

      if (!dispenseResult.success) {
        this.notificationService.showError(
          dispenseResult.errorMessage || "Erro ao dispensar produto"
        );
        return { success: false };
      }

      return { success: true, transactionId: paymentResult.transactionId };
    } catch (error) {
      this.notificationService.showError("Erro inesperado no processamento");
      return { success: false };
    }
  }
}

// ========================= COMPONENTS =========================
interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

interface PaymentButtonProps {
  type: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  disabled?: boolean;
}

interface LoadingOverlayProps {
  visible: boolean;
  message: string;
}

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <Pressable
    style={[styles.productCard, { borderColor: product.color }]}
    onPress={() => onSelect(product)}
  >
    <View style={styles.productImageContainer}>
      <View style={[styles.productIcon, { backgroundColor: product.color }]}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
    </View>
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productPrice}>R$ {product.price.toFixed(2)}</Text>
  </Pressable>
);

const PaymentButton: React.FC<PaymentButtonProps> = ({
  type,
  icon: Icon,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    style={[styles.paymentButton, disabled && styles.disabledButton]}
    onPress={onPress}
    disabled={disabled}
  >
    <Icon size={32} color="white" />
    <Text style={styles.paymentButtonText}>{type}</Text>
  </TouchableOpacity>
);

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <View style={styles.spinner} />
        <Text style={styles.loadingText}>{message}</Text>
      </View>
    </View>
  );
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack }) => (
  <View style={styles.screenHeader}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <ArrowLeft size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.screenTitle}>{title}</Text>
    <View style={styles.headerSpacer} />
  </View>
);

// ========================= MAIN APPLICATION =========================
const MariosBrigadeiroApp: React.FC = () => {
  // Injeção de dependências
  const paymentService: IPaymentService = new PaymentService();
  const vendingMachineService: IVendingMachineService =
    new VendingMachineService();
  const productRepository: IProductRepository = new ProductRepository();
  const notificationService: INotificationService = new NotificationService();

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

    const result = await processOrderUseCase.execute(
      selectedProduct,
      paymentType
    );

    setIsLoading(false);

    if (result.success) {
      setCurrentScreen(Screen.SUCCESS);
      // Inicia animação de queda
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

  // ========================= SCREEN COMPONENTS =========================
  const HomeScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.statusBar}>
        <Clock size={16} color="white" />
        <Text style={styles.timeText}>
          {currentTime.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.brandHeader}>
        <Text style={styles.brandTitle}>mario's</Text>
        <Text style={styles.brandSubtitle}>BRIGADEIRO GOURMET</Text>
      </View>

      <View style={styles.welcomeContainer}>
        <ShoppingCart size={80} color="white" />
        <Text style={styles.welcomeText}>Bem-vindo!</Text>
        <Text style={styles.welcomeSubtext}>Escolha seus doces favoritos</Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleNavigateToScreen(Screen.PRODUCTS)}
      >
        <Text style={styles.startButtonText}>FAZER MEU PEDIDO</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Nosso Instagram:</Text>
        <Text style={styles.instagramHandle}>@mariosbrigadeiros</Text>
      </View>
    </LinearGradient>
  );

  const ProductsScreen: React.FC = () => {
    const products = productRepository.getAllProducts();

    return (
      <LinearGradient
        colors={["#FF6B9D", "#87CEEB"]}
        style={styles.screen}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScreenHeader
          title="Escolha seu doce"
          onBack={() => handleNavigateToScreen(Screen.HOME)}
        />

        <ScrollView contentContainerStyle={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleProductSelect}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    );
  };

  const PaymentMethodScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScreenHeader
        title="Forma de Pagamento"
        onBack={() => handleNavigateToScreen(Screen.PRODUCTS)}
      />

      {selectedProduct && (
        <View style={styles.selectedProduct}>
          <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
          <Text style={styles.selectedPrice}>
            R$ {selectedProduct.price.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.paymentMethods}>
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
      </View>
    </LinearGradient>
  );

  const PixPaymentScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScreenHeader
        title="Pagamento PIX"
        onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
      />

      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCodePlaceholder}>
          <View style={styles.qrPattern} />
          <Text style={styles.qrCodeText}>QR CODE PIX</Text>
          <Text style={styles.qrCodeAmount}>
            R$ {selectedProduct?.price.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.pixInstructions}>
          Escaneie o código QR com seu banco para pagar
        </Text>
      </View>
    </LinearGradient>
  );

  const CardPaymentScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScreenHeader
        title="Pagamento Cartão"
        onBack={() => handleNavigateToScreen(Screen.PAYMENT_METHOD)}
      />

      <View style={styles.cardPaymentContainer}>
        <Text style={styles.cardInstructions}>
          Insira ou aproxime seu cartão na máquina
        </Text>

        <View style={styles.cardTerminalIllustration}>
          <View style={styles.terminalScreen}>
            <Text style={styles.terminalText}>
              R$ {selectedProduct?.price.toFixed(2)}
            </Text>
            <Text style={styles.terminalText}>Insira o cartão</Text>
          </View>
        </View>

        <View style={styles.cardOptions}>
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
        </View>
      </View>
    </LinearGradient>
  );

  const ProcessingScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.processingContainer}>
        <View style={styles.processingSpinner} />
        <Text style={styles.processingText}>Processando pagamento...</Text>
        <Text style={styles.processingSubtext}>Aguarde um momento</Text>
      </View>
    </LinearGradient>
  );

  const SuccessScreen: React.FC = () => (
    <LinearGradient
      colors={["#FF6B9D", "#87CEEB"]}
      style={styles.screen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Check size={80} color="white" />
        </View>
        <Text style={styles.successTitle}>PAGAMENTO REALIZADO COM SUCESSO</Text>
        <Text style={styles.successMessage}>Que seu doce! 🍫</Text>
        <View style={styles.successInstructions}>
          <Text style={styles.successInstructionsText}>
            Retire seu{" "}
            <Text style={styles.boldText}>{selectedProduct?.name}</Text> no
            compartimento abaixo
          </Text>
        </View>

        <View style={styles.dispensingAnimation}>
          <Animated.View style={{ transform: [{ translateY }] }}>
            <Text style={{ fontSize: 40 }}>{selectedProduct?.emoji}</Text>
          </Animated.View>
        </View>
      </View>

      <TouchableOpacity style={styles.newOrderButton} onPress={handleNewOrder}>
        <Text style={styles.newOrderButtonText}>NOVO PEDIDO</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  // Renderização condicional das telas
  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen />;
      case Screen.PRODUCTS:
        return <ProductsScreen />;
      case Screen.PAYMENT_METHOD:
        return <PaymentMethodScreen />;
      case Screen.PIX_PAYMENT:
        return <PixPaymentScreen />;
      case Screen.CARD_PAYMENT:
        return <CardPaymentScreen />;
      case Screen.PROCESSING:
        return <ProcessingScreen />;
      case Screen.SUCCESS:
        return <SuccessScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.app}>
      {renderScreen()}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </View>
  );
};

// Componente LinearGradient para substituir gradientes CSS
const LinearGradient = ({ colors, style, start, end, children }: any) => {
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>{children}</View>
  );
};

// Estilos
const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
  },
  timeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  brandHeader: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  brandTitle: {
    fontSize: 72,
    fontWeight: "900",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  brandSubtitle: {
    fontSize: 18,
    letterSpacing: 3,
    marginTop: 10,
    opacity: 0.95,
    fontWeight: "600",
    color: "white",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 20,
  },
  welcomeText: {
    fontSize: 48,
    fontWeight: "700",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtext: {
    fontSize: 24,
    opacity: 0.9,
    fontWeight: "400",
    color: "white",
  },
  startButton: {
    backgroundColor: "#FF1493",
    borderRadius: 50,
    margin: 20,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 1,
  },
  footer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  footerText: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  instagramHandle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
  },
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  backButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 24,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginHorizontal: 20,
    flex: 1,
    color: "white",
  },
  headerSpacer: {
    width: 48,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 30,
    gap: 25,
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: Dimensions.get("window").width / 2 - 40,
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
  productImageContainer: {
    marginBottom: 15,
  },
  productIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  productEmoji: {
    fontSize: 36,
  },
  productName: {
    color: "#333",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 10,
  },
  productPrice: {
    color: "#FF1493",
    fontSize: 24,
    fontWeight: "800",
  },
  selectedProduct: {
    backgroundColor: "rgba(255,255,255,0.95)",
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 5,
  },
  selectedProductName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  selectedPrice: {
    fontSize: 32,
    color: "#FF1493",
    fontWeight: "800",
  },
  paymentMethods: {
    flex: 1,
    justifyContent: "center",
    gap: 25,
    padding: 40,
  },
  paymentButton: {
    backgroundColor: "#FF1493",
    borderRadius: 20,
    padding: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 5,
  },
  paymentButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  qrCodeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 30,
  },
  qrCodePlaceholder: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    overflow: "hidden",
  },
  qrPattern: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 80,
    backgroundColor: "#333",
    opacity: 0.1,
  },
  qrCodeText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "700",
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  qrCodeAmount: {
    color: "#FF1493",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
  },
  pixInstructions: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 400,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 15,
    color: "white",
  },
  cardPaymentContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
    gap: 40,
  },
  cardInstructions: {
    fontSize: 22,
    textAlign: "center",
    lineHeight: 30,
    color: "white",
  },
  cardTerminalIllustration: {
    alignItems: "center",
  },
  terminalScreen: {
    width: 200,
    height: 120,
    backgroundColor: "#2c3e50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  terminalText: {
    color: "#00ff00",
    fontSize: 18,
    fontFamily: "Courier",
  },
  cardOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  processingSpinner: {
    width: 80,
    height: 80,
    borderWidth: 8,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: 40,
  },
  processingText: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
  },
  processingSubtext: {
    fontSize: 18,
    opacity: 0.8,
    color: "white",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 25,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 5,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  successMessage: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFD700",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  successInstructions: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderRadius: 15,
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  successInstructionsText: {
    fontSize: 20,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  dispensingAnimation: {
    height: 100,
    width: "100%",
    alignItems: "center",
  },
  newOrderButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    padding: 25,
    margin: 20,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 5,
  },
  newOrderButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 20,
    minWidth: 300,
    alignItems: "center",
  },
  spinner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: "#f3f3f3",
    borderTopColor: "#FF69B4",
    borderRadius: 20,
    marginBottom: 20,
  },
  loadingText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MariosBrigadeiroApp;
