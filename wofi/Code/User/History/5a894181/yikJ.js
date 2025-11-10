// Script de teste para verificar variáveis de ambiente
console.log('=== Teste de Variáveis de Ambiente ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Todas as variáveis NEXT_PUBLIC_FIREBASE:');

Object.keys(process.env)
  .filter(key => key.startsWith('NEXT_PUBLIC_FIREBASE'))
  .forEach(key => {
    console.log(`${key}:`, process.env[key] ? 'DEFINIDA' : 'UNDEFINED');
  });

console.log('=== Valores das Variáveis ===');
console.log('API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);