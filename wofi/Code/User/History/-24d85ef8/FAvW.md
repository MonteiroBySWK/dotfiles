# Projeto: Carrinho Mário's — Aplicação React Native (scaffold + arquitetura)

> **Atualização:** você informou que o template Expo que gerou já possui a estrutura com a pasta `app/` criada pelo App Router (arquivos `app/index.tsx` e `app/_layout.tsx`). Atualizei o scaffold para **integrar o código anterior com essa estrutura do Expo**, mantendo a arquitetura em camadas (Clean Architecture) e facilitando o uso do App Router ou da integração direta com o `src/` tradicional.

---

## Abordagem adotada
Para minimizar mudanças e aproveitar o scaffold já criado, proponho manter o código organizado em `src/` conforme o scaffold anterior (camadas `domain`, `data`, `infra`, `presentation`) e **usar os arquivos em `app/` apenas como ponte/entrada** do Expo App Router. Assim você continua com a separação limpa de responsabilidades e aproveita o template do Expo.

Alternativa: se preferir usar o App Router por rotas baseadas em arquivos, posso converter as telas em páginas dentro de `app/` (ex.: `app/products/page.tsx`). Diga se prefere essa versão.

---

## O que muda na estrutura (integração com seu projeto Expo atual)
Exemplo de estrutura final recomendada, preservando o template Expo:

```
.
├── app
│   ├── index.tsx         # ponte para src/App.tsx (entry)
│   └── _layout.tsx       # wrapper para providers / status bar (opcional)
├── assets
│   ├── fonts/
│   └── images/
├── src/
│   ├─ App.tsx            # aplicação principal (NavigationContainer + providers)
│   ├─ index.tsx          # (opcional) re-export
│   ├─ navigation/
│   │  └─ AppNavigator.tsx
│   ├─ presentation/
│   │  ├─ screens/
│   │  └─ components/
│   ├─ domain/
│   ├─ data/
│   └─ infra/
├── app.json
├── package.json
└── tsconfig.json
```

> Observação: manter `src/` facilita testes, import paths e organização quando o app crescer. Os arquivos `app/index.tsx` e `app/_layout.tsx` só chamam o `src/App.tsx` e adicionam wrappers específicos do Expo (StatusBar, SafeAreaProvider, fontes carregadas etc.).

---

## Arquivos de integração (coloque dentro da pasta `app/` do seu template Expo)

### app/index.tsx
```tsx
// Entrada do Expo App Router: apenas reexporta a App principal
import React from 'react';
import App from '../src/App';
export default function Index() {
  return <App />;
}
```

### app/_layout.tsx (opcional — útil se quiser usar SafeArea e carregamento de fontes)
```tsx
import React from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Slot />
    </SafeAreaProvider>
  );
}
```

> Se preferir não usar `expo-router`/`Slot`, mantenha `app/index.tsx` que importa e retorna o `src/App` — é a forma mais direta e compatível.

---

## Ajustes no `src/App.tsx` (pequena mudança para compatibilidade com Expo)
No scaffold anterior `src/App.tsx` usava `NavigationContainer` e um provider para orders. Ele pode permanecer igual; apenas garanta que o `App` exportado seja o default e que `app/index.tsx` importe esse `App`.

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

## Dependências específicas (Expo)
Instale as dependências de navegação e outras recomendadas:

```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-gesture-handler react-native-reanimated react-native-safe-area-context
# se usar expo-router, instale: npm install expo-router
```

Se decidir implementar BLE adicione (quando for escolher o caminho):
```bash
# para BLE (native): react-native-ble-plx — exige configuração nativa
npm install react-native-ble-plx
# Para WebSocket/HTTP over Wi‑Fi não precisa de lib extra (fetch/ws builtin)
```

---

## Mapeamento de rotas e integração com o fluxo (resumo)
Fluxo da aplicação (conforme diagrama que você enviou):

1. Home (app/index.tsx — chama `src/App` que mostra HomeScreen)
2. Products (escolha do doce)
3. PaymentMethod (pix / crédito / débito)
4. PaymentProcessing (envia requisição para o gateway)
5. Success (mensagem + instagram)

No scaffold implementamos essas telas em `src/presentation/screens`. O `AppNavigator` em `src/navigation/AppNavigator.tsx` mapeia essas rotas.

---

## Notas sobre assets (imagens e fontes)
- A paleta visual foi pensada com cores pastéis (rosa/azul) semelhantes ao carrinho. Você pode ajustar os valores em cada arquivo de estilo.
- Coloque imagens dos produtos em `assets/images/` e carregue-as com `require('../assets/images/xxx.png')` ou com `expo-asset`.
- Fontes: já há `assets/fonts/SpaceMono-Regular.ttf` no seu template — registre-a no `src/App.tsx` ou num `FontLoader` antes de renderizar a UI.

Exemplo de carregamento de fonte com `expo-font`:

```tsx
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function AppWrapper() {
  const [loaded] = useFonts({ 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf') });
  if (!loaded) return null; // opcional: mostrar splash
  return <App />; // seu App real
}
```

---

## Boas práticas e SOLID aplicadas (resumo)
- **SRP (Single Responsibility)**: telas apenas exibem UI; casos de uso e repositórios lidam com lógica e chamadas a APIs.
- **DI (Dependency Inversion)**: `presentation` depende de interfaces (repositórios) e não de implementações concretas — facilita testes e troca de `BluetoothService` por `WifiService`.
- **Separação de infra**: `infra/hardware` e `infra/payment` isolam detalhes de implementação.

---

## Próximos passos — opções
Escolha uma das opções para eu continuar:

1. **Gerar repositório GitHub** com todos os arquivos (`app/` + `src/`) e `package.json` pronto para rodar com Expo.
2. **Converter as telas para o Expo App Router** (transformar cada tela em `app/products/page.tsx`, `app/payment-method/[productId]/page.tsx` etc.).
3. **Implementar BLE** com `react-native-ble-plx` (exemplo prático, Android/iOS têm passos nativos extras — eu mostro como configurar).
4. **Integrar um gateway de pagamento real** (diga qual: MercadoPago / Pagar.me / Gerencianet / outro) e eu adiciono um exemplo de backend mínimo + front-end para consumir o token.
5. **Gerar o repositório Expo pronto para rodar localmente** (arquivo por arquivo). 

---

Se quiser que eu já atualize os arquivos no canvas (posso criar os arquivos principais — `app/index.tsx`, `src/App.tsx`, `src/navigation/AppNavigator.tsx`, e as telas — e colocá-los prontos para copiar/colar ou para gerar um repositório). Diga qual opção prefere.
