# Projeto: Carrinho Mário's — Aplicação React Native (scaffold + arquitetura)

Este documento contém um scaffold em TypeScript para uma aplicação React Native que implementa a **interface de tablet** para o carrinho de vendas automático, seguindo o fluxo do diagrama enviado.

Inclui:
- visão geral de arquitetura baseada em Clean Architecture e princípios SOLID
- árvore de arquivos sugerida
- arquivos principais (App.tsx, navegação, telas, serviços de hardware e pagamento, hooks e componentes)

> Observação: é um *frontend-first* scaffold que contém pontos de extensão para comunicação com hardware (Bluetooth/Wi‑Fi) e integração de pagamento externo. As integrações reais com SDKs (ex: react-native-ble-plx, WebSocket, SDKs de adquirentes) são deixadas como placeholders fáceis de substituir.

---

## Como usar
1. Criar projeto Expo com TypeScript (recomendado para testes rápidos):

```bash
npx create-expo-app MariosCart --template expo-template-blank-typescript
cd MariosCart
# instalar dependências sugeridas
npm install @react-navigation/native @react-navigation/native-stack react-native-gesture-handler react-native-reanimated
# opcional: instalar libs BLE / WiFi quando decidir o método
# yarn add react-native-ble-plx
```

2. Colocar os arquivos do scaffold dentro de `src/` conforme a árvore de arquivos abaixo.
3. Rodar `expo start`.

---

## Arquitetura (visão geral)

Aplicação organizada em camadas:

- **domain/** — entidades, tipos e casos de uso (solo business logic leve no frontend)
- **data/** — repositórios e adaptadores (ex.: PaymentRepository que chama API externa)
- **infra/** — serviços concretos (HardwareServiceBluetooth, HardwareServiceWifi, PaymentApi)
- **presentation/** — telas, componentes, hooks e estados (React + context)

Essa separação facilita substituição de implementações (por exemplo, trocar Bluetooth por Wi‑Fi) e segue SRP/ISP/Dependency Inversion do SOLID.

---

## Árvore de arquivos sugerida

```
src/
├─ App.tsx
├─ index.tsx
├─ navigation/
│  └─ AppNavigator.tsx
├─ presentation/
│  ├─ screens/
│  │  ├─ HomeScreen.tsx
│  │  ├─ ProductSelectionScreen.tsx
│  │  ├─ PaymentMethodScreen.tsx
│  │  ├─ PaymentProcessingScreen.tsx
│  │  └─ SuccessScreen.tsx
│  ├─ components/
│  │  ├─ ProductCard.tsx
│  │  ├─ HeaderHardwareStatus.tsx
│  │  └─ PayButton.tsx
│  └─ hooks/
│     ├─ useOrder.ts
│     └─ useHardware.ts
├─ domain/
│  ├─ models.ts
│  └─ usecases/
│     └─ ProcessPaymentUseCase.ts
├─ data/
│  └─ repositories/
│     ├─ PaymentRepository.ts
│     └─ HardwareRepository.ts
└─ infra/
   ├─ payment/
   │  └─ PaymentApi.ts
   └─ hardware/
      ├─ BluetoothService.ts
      └─ WifiService.ts
```

---

## Código principal

Abaixo estão os arquivos com implementação exemplar (TypeScript / React Native). Eles foram escritos para serem claros, pequenos e fáceis de adaptar.

---

### src/App.tsx
```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { OrderProvider } from './presentation/hooks/useOrder';

export default function App() {
  return (
    <NavigationContainer>
      <OrderProvider>
        <AppNavigator />
      </OrderProvider>
    </NavigationContainer>
  );
}
```

---

### src/navigation/AppNavigator.tsx
```tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../presentation/screens/HomeScreen';
import ProductSelectionScreen from '../presentation/screens/ProductSelectionScreen';
import PaymentMethodScreen from '../presentation/screens/PaymentMethodScreen';
import PaymentProcessingScreen from '../presentation/screens/PaymentProcessingScreen';
import SuccessScreen from '../presentation/screens/SuccessScreen';

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  PaymentMethod: { productId: string } | undefined;
  Processing: { productId: string; method: 'pix' | 'credito' | 'debito' };
  Success: { productName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Products" component={ProductSelectionScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="Processing" component={PaymentProcessingScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
```

---

### src/domain/models.ts
```ts
export type Product = {
  id: string;
  name: string;
  price: number; // cents
  image?: string; // optional asset path
};

export type PaymentMethod = 'pix' | 'credito' | 'debito';
```

---

### src/presentation/hooks/useOrder.tsx
```tsx
import React, { createContext, useContext, useState } from 'react';
import { Product } from '../../domain/models';

type OrderState = {
  selected?: Product;
  setSelected: (p?: Product) => void;
};

const OrderContext = createContext<OrderState | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selected, setSelectedState] = useState<Product | undefined>(undefined);
  const setSelected = (p?: Product) => setSelectedState(p);
  return <OrderContext.Provider value={{ selected, setSelected }}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
};
```

---

### src/presentation/hooks/useHardware.ts
```ts
// hook que orquestra a conexão com hardware (está ligado à infra/ services)
import { useEffect, useState } from 'react';
import BluetoothService from '../../infra/hardware/BluetoothService';
import WifiService from '../../infra/hardware/WifiService';

export type HardwareStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useHardware(preferred: 'bluetooth' | 'wifi' = 'bluetooth') {
  const [status, setStatus] = useState<HardwareStatus>('disconnected');

  useEffect(() => {
    let active = true;
    async function connect() {
      setStatus('connecting');
      try {
        if (preferred === 'bluetooth') await BluetoothService.connect();
        else await WifiService.connect();
        if (!active) return;
        setStatus('connected');
      } catch (e) {
        setStatus('error');
      }
    }
    connect();
    return () => {
      active = false;
      BluetoothService.disconnect().catch(() => undefined);
      WifiService.disconnect().catch(() => undefined);
    };
  }, [preferred]);

  return { status };
}
```

---

### src/infra/hardware/BluetoothService.ts
```ts
// Placeholder: adapter para biblioteca real, p.ex. react-native-ble-plx

const BluetoothService = {
  async connect(): Promise<void> {
    console.log('[BluetoothService] connecting (placeholder)');
    // Simular delay
    await new Promise((r) => setTimeout(r, 600));
    // Em implementação real: inicializar BLE, scan, conectar ao device do carrinho
  },
  async disconnect(): Promise<void> {
    console.log('[BluetoothService] disconnect (placeholder)');
  },
  async sendCommand(payload: string) {
    console.log('[BluetoothService] send', payload);
  },
};

export default BluetoothService;
```

---

### src/infra/hardware/WifiService.ts
```ts
// Placeholder para comunicação via Wi-Fi (p.ex. WebSocket / HTTP interno do carrinho)

const WifiService = {
  async connect(): Promise<void> {
    console.log('[WifiService] connecting (placeholder)');
    await new Promise((r) => setTimeout(r, 400));
  },
  async disconnect(): Promise<void> {
    console.log('[WifiService] disconnect (placeholder)');
  },
  async sendCommand(payload: string) {
    console.log('[WifiService] send', payload);
  },
};

export default WifiService;
```

---

### src/infra/payment/PaymentApi.ts
```ts
// Adapter para API de pagamento. Em produção, implemente endpoints reais

export default class PaymentApi {
  static async process(amountCents: number, method: string): Promise<{ success: boolean; payload?: any }> {
    console.log('[PaymentApi] Processing', amountCents, method);
    // Simular chamada HTTP
    await new Promise((r) => setTimeout(r, 1200));
    // Retornar mock de sucesso
    return { success: true, payload: { txId: 'MOCK123' } };
  }
}
```

---

### src/data/repositories/PaymentRepository.ts
```ts
import PaymentApi from '../../infra/payment/PaymentApi';

export default class PaymentRepository {
  static async pay(amountCents: number, method: string) {
    return PaymentApi.process(amountCents, method);
  }
}
```

---

### src/presentation/screens/HomeScreen.tsx
```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import HeaderHardwareStatus from '../components/HeaderHardwareStatus';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <HeaderHardwareStatus />
      <View style={styles.content}>
        <Text style={styles.title}>PÁGINA INICIAL</Text>
        <Text style={styles.subtitle}>"APERTE PARA COMEÇAR"</Text>

        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.ctaText}>Fazer meu pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7f6' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#0d0126' },
  subtitle: { marginTop: 8, color: '#6b6b6b' },
  cta: {
    marginTop: 24,
    backgroundColor: '#f9a8d4',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 14,
    minWidth: width * 0.6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#0d0126' },
});
```

---

### src/presentation/screens/ProductSelectionScreen.tsx
```tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Product } from '../../domain/models';
import ProductCard from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';

const PRODUCTS: Product[] = [
  { id: 'cookie', name: 'Cookie', price: 500 },
  { id: 'brigadeiro', name: 'Brigadeiro', price: 450 },
  { id: 'brownie', name: 'Brownie', price: 700 },
  { id: 'pudim', name: 'Pudim', price: 900 },
  { id: 'potcake', name: 'Potcake', price: 600 },
];

export default function ProductSelectionScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Escolha seu doce</Text>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('PaymentMethod', { productId: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff7f6' },
  header: { fontSize: 20, fontWeight: '700', margin: 16, color: '#0d0126' },
});
```

---

### src/presentation/components/ProductCard.tsx
```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../../domain/models';

export default function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>R$ {(product.price / 100).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#f1e6ea',
  },
  name: { fontSize: 18, fontWeight: '700', color: '#0d0126' },
  price: { marginTop: 8, color: '#6b6b6b' },
});
```

---

### src/presentation/screens/PaymentMethodScreen.tsx
```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethod'>;

export default function PaymentMethodScreen({ navigation, route }: Props) {
  const id = route.params?.productId || 'unknown';
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha forma de pagamento</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Processing', { productId: id, method: 'pix' })}
      >
        <Text style={styles.btnText}>Pix</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Processing', { productId: id, method: 'credito' })}
      >
        <Text style={styles.btnText}>Crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Processing', { productId: id, method: 'debito' })}
      >
        <Text style={styles.btnText}>Débito</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff7f6' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, color: '#0d0126' },
  btn: { backgroundColor: '#f9a8d4', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginVertical: 8 },
  btnText: { fontWeight: '700', color: '#0d0126' },
});
```

---

### src/presentation/screens/PaymentProcessingScreen.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PaymentRepository from '../../data/repositories/PaymentRepository';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Processing'>;

export default function PaymentProcessingScreen({ navigation, route }: Props) {
  const { productId, method } = route.params!;
  const [status, setStatus] = useState<'processing' | 'done' | 'error'>('processing');

  useEffect(() => {
    let mounted = true;
    async function process() {
      // Determinar preço com base no ID (em app real buscar via repositório)
      const price = 500;
      const res = await PaymentRepository.pay(price, method);
      if (!mounted) return;
      if (res.success) {
        setStatus('done');
        navigation.replace('Success', { productName: productId });
      } else setStatus('error');
    }
    process();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Processando pagamento...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff7f6' },
  title: { fontSize: 16, marginBottom: 16, color: '#0d0126' },
});
```

---

### src/presentation/screens/SuccessScreen.tsx
```tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

export default function SuccessScreen({ navigation, route }: Props) {
  const { productName } = route.params!;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento realizado com sucesso</Text>
      <Text style={styles.subtitle}>"Que seja adoce"</Text>
      <Text style={styles.insta}>nosso instagram: @mariosbrigadeiros</Text>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.btnText}>Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff7f6' },
  title: { fontSize: 20, fontWeight: '700', color: '#0d0126' },
  subtitle: { marginTop: 6, color: '#6b6b6b' },
  insta: { marginTop: 24, fontStyle: 'italic', color: '#0d0126' },
  btn: { marginTop: 24, backgroundColor: '#f9a8d4', padding: 12, borderRadius: 10 },
  btnText: { color: '#0d0126', fontWeight: '700' },
});
```

---

### src/presentation/components/HeaderHardwareStatus.tsx
```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHardware } from '../hooks/useHardware';

export default function HeaderHardwareStatus() {
  const { status } = useHardware('bluetooth');
  return (
    <View style={styles.header}>
      <Text style={styles.brand}>Mario's</Text>
      <View style={styles.statusBox}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 80, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff7f6' },
  brand: { fontSize: 18, fontWeight: '900', color: '#0d0126' },
  statusBox: { backgroundColor: '#fff', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#f1e6ea' },
  statusText: { fontSize: 12, color: '#6b6b6b' },
});
```

---

## Considerações finais / próximos passos

- **SDKs reais:** Ao escolher o método de conexão hardware, instale e adapte `BluetoothService` para usar `react-native-ble-plx` ou outro SDK. Para Wi‑Fi, implemente WebSocket/HTTP.
- **Pagamento real:** Substitua `PaymentApi` por integrações reais com adquirentes (Gerencianet, Pagar.me, MercadoPago etc.) ou com o POS do próprio carrinho.
- **Segurança:** Manter segredos (chaves, tokens) no backend; front-end deve receber apenas tokens temporários do back-end.
- **Testes:** Criar testes unitários para usecases e contratos de repositório.

---

Se quiser, eu posso:
- gerar um repositório GitHub com esse scaffold (arquivo por arquivo);
- gerar a versão Expo completa pronta para rodar (`App.tsx`, `package.json`) e testar aqui;
- adicionar exemplo de integração BLE com `react-native-ble-plx` ou de integração com um gateway de pagamento específico.

Diga qual próximo passo prefere e eu preparo.
