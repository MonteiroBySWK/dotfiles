# Correções de Conectividade Firebase

## Problema Identificado
O sistema ficava em **loading infinito** com o erro:
```
Runtime FirebaseError
Failed to get document because the client is offline.
```

## Soluções Implementadas

### 1. **Configuração do Firestore com Persistência Offline**
**Arquivo**: `src/lib/firebase/config.ts`

- Habilitada persistência IndexedDB para cache local
- Tratamento de erros quando múltiplas abas estão abertas
- Suporte para navegadores que não suportam persistência

```typescript
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firebase: Persistência não habilitada - múltiplas abas abertas');
  } else if (err.code === 'unimplemented') {
    console.warn('Firebase: Persistência não suportada neste navegador');
  }
});
```

### 2. **Tratamento de Erros no useFirestore**
**Arquivo**: `src/hooks/useFirestore.ts`

- Detecta quando o Firebase está offline
- Mantém dados em cache quando disponível
- Mostra mensagem apropriada ao usuário

```typescript
catch (err: any) {
  if (err.code === 'unavailable' || err.message?.includes('offline')) {
    console.warn(`Firebase offline - usando cache para ${collectionName}`);
    setError(new Error('Modo offline - dados podem estar desatualizados'));
  }
}
```

### 3. **Melhoria no AuthContext**
**Arquivo**: `src/contexts/AuthContext.tsx`

- Try/catch ao buscar dados do usuário
- Cria dados básicos do usuário em modo offline
- Previne travamento quando Firestore está indisponível

```typescript
catch (error: any) {
  if (error.code === 'unavailable' || error.message?.includes('offline')) {
    // Criar dados mínimos para permitir navegação
    setUserData({
      id: user.uid,
      nome: user.email?.split('@')[0] || 'Usuário',
      email: user.email || '',
      nivel: NivelUsuario.VISUALIZADOR,
      // ...
    });
  }
}
```

### 4. **Timeout no ProtectedRoute**
**Arquivo**: `src/components/auth/ProtectedRoute.tsx`

- Timeout de 10 segundos para prevenir loading infinito
- Tela de erro com botão "Tentar Novamente"
- Mensagem clara sobre problema de conexão

```typescript
useEffect(() => {
  const timeout = setTimeout(() => {
    if (loading) {
      setTimeoutError(true);
    }
  }, 10000);
  return () => clearTimeout(timeout);
}, [loading]);
```

### 5. **Arquivo .env.example**
Criado arquivo de exemplo com instruções claras de configuração.

## Como Testar

### Teste 1: Conexão Normal
1. Certifique-se que `.env.local` está configurado
2. Execute `npm run dev`
3. Acesse `http://localhost:3000`
4. O sistema deve carregar normalmente

### Teste 2: Modo Offline
1. Abra DevTools (F12)
2. Vá em Network > Throttling > Offline
3. Recarregue a página
4. Sistema deve:
   - Mostrar loading por no máximo 10s
   - Exibir tela de erro com opção de retry
   - OU usar dados em cache se disponível

### Teste 3: Firebase Desconfigurado
1. Altere uma variável do `.env.local` para valor inválido
2. Recarregue a página
3. Sistema deve mostrar erro de conexão após 10s

## Próximos Passos Recomendados

1. **Configurar Firestore Rules** - Garantir permissões corretas
2. **Criar Collection de Teste** - Adicionar dados iniciais
3. **Testar Autenticação** - Criar primeiro usuário admin
4. **Adicionar Indicadores Visuais** - Badge de "offline" quando sem conexão

## Checklist de Verificação

- [x] Persistência offline habilitada
- [x] Tratamento de erro em hooks
- [x] Timeout em ProtectedRoute
- [x] Mensagens de erro claras
- [x] Dados em cache quando offline
- [x] .env.example documentado
- [ ] Regras do Firestore configuradas
- [ ] Primeiro usuário admin criado
- [ ] Collections inicializadas

## Variáveis de Ambiente Necessárias

Certifique-se de que todas as variáveis estão configuradas em `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Logs Úteis para Debug

O sistema agora gera logs no console para facilitar debug:
- `Firebase offline - usando cache`
- `Firebase: Persistência não habilitada`
- `Timeout ao carregar autenticação`
- `Usuário autenticado mas sem dados no Firestore`
