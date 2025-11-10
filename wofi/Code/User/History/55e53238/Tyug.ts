/**
 * Script de Seed para Popular o Firebase
 * Sistema REVIS
 * 
 * Popula o banco com dados de exemplo para testes:
 * - Ingredientes (vodka, limão, açúcar, etc.)
 * - Produtos (Caipirinha, Mojito, Tropicana)
 * - Pedidos com datas realistas
 * - Lotes de produção com consumo calculado
 * - Eventos com datas e participantes
 * - Usuários de teste
 * 
 * Executar: npx tsx scripts/seed-database.ts
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Configuração Firebase (substitua com suas credenciais)
import app from '@/lib/firebase/config';
import { auth } from '@/lib/firebase/config';
import { storage } from '@/lib/firebase/config';
import { functions } from '@/lib/firebase/config';


// ===== FUNÇÕES AUXILIARES =====

function getRandomDate(daysFromNow: number): Timestamp {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return Timestamp.fromDate(date);
}

function getRandomPastDate(daysAgo: number): Timestamp {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return Timestamp.fromDate(date);
}

// ===== DADOS DE SEED =====

async function seedIngredientes() {
  console.log('📦 Criando ingredientes...');

  const ingredientes = [
    {
      nome: 'Vodka Absolut',
      categoria: 'Bebida',
      unidade: 'ml',
      estoqueAtual: 5000,
      estoqueMinimo: 1000,
      fornecedor: 'Distribuidora Bebidas XYZ',
      historico: [
        {
          data: getRandomPastDate(10),
          tipo: 'entrada',
          quantidade: 5000,
          origem: 'PED-001',
          observacao: 'Compra inicial',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Rum Havana Club',
      categoria: 'Bebida',
      unidade: 'ml',
      estoqueAtual: 3500,
      estoqueMinimo: 800,
      fornecedor: 'Distribuidora Bebidas XYZ',
      historico: [
        {
          data: getRandomPastDate(10),
          tipo: 'entrada',
          quantidade: 4000,
          origem: 'PED-001',
        },
        {
          data: getRandomPastDate(5),
          tipo: 'saida',
          quantidade: 500,
          origem: 'LOTE-001',
          observacao: 'Produção evento teste',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Xarope de Morango',
      categoria: 'Xarope',
      unidade: 'ml',
      estoqueAtual: 2000,
      estoqueMinimo: 500,
      fornecedor: 'Insumos Gourmet Ltda',
      historico: [
        {
          data: getRandomPastDate(15),
          tipo: 'entrada',
          quantidade: 2000,
          origem: 'PED-002',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Xarope de Limão',
      categoria: 'Xarope',
      unidade: 'ml',
      estoqueAtual: 1800,
      estoqueMinimo: 500,
      fornecedor: 'Insumos Gourmet Ltda',
      historico: [
        {
          data: getRandomPastDate(15),
          tipo: 'entrada',
          quantidade: 2000,
          origem: 'PED-002',
        },
        {
          data: getRandomPastDate(3),
          tipo: 'perda',
          quantidade: 200,
          observacao: 'Frasco quebrado',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Limão Tahiti',
      categoria: 'Fruta',
      unidade: 'unidade',
      estoqueAtual: 150,
      estoqueMinimo: 50,
      fornecedor: 'Hortifruti Central',
      historico: [
        {
          data: getRandomPastDate(2),
          tipo: 'entrada',
          quantidade: 200,
          origem: 'PED-003',
        },
        {
          data: getRandomPastDate(1),
          tipo: 'saida',
          quantidade: 50,
          origem: 'LOTE-002',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Hortelã Fresca',
      categoria: 'Fruta',
      unidade: 'g',
      estoqueAtual: 500,
      estoqueMinimo: 200,
      fornecedor: 'Hortifruti Central',
      historico: [
        {
          data: getRandomPastDate(3),
          tipo: 'entrada',
          quantidade: 500,
          origem: 'PED-003',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Açúcar Refinado',
      categoria: 'Outro',
      unidade: 'kg',
      estoqueAtual: 10,
      estoqueMinimo: 5,
      fornecedor: 'Atacado Alimentos',
      historico: [
        {
          data: getRandomPastDate(20),
          tipo: 'entrada',
          quantidade: 15,
          origem: 'PED-004',
        },
        {
          data: getRandomPastDate(8),
          tipo: 'saida',
          quantidade: 5,
          origem: 'LOTE-001',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Gelo em Cubo',
      categoria: 'Gelo',
      unidade: 'kg',
      estoqueAtual: 50,
      estoqueMinimo: 20,
      fornecedor: 'Fábrica de Gelo Polar',
      historico: [
        {
          data: getRandomPastDate(1),
          tipo: 'entrada',
          quantidade: 50,
          origem: 'PED-005',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Copo 270ml Descartável',
      categoria: 'Descartável',
      unidade: 'unidade',
      estoqueAtual: 1000,
      estoqueMinimo: 500,
      fornecedor: 'Embalagens Express',
      historico: [
        {
          data: getRandomPastDate(7),
          tipo: 'entrada',
          quantidade: 2000,
          origem: 'PED-006',
        },
        {
          data: getRandomPastDate(4),
          tipo: 'saida',
          quantidade: 1000,
          origem: 'LOTE-001',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Canudo Biodegradável',
      categoria: 'Descartável',
      unidade: 'unidade',
      estoqueAtual: 800,
      estoqueMinimo: 300,
      fornecedor: 'Embalagens Express',
      historico: [
        {
          data: getRandomPastDate(7),
          tipo: 'entrada',
          quantidade: 1000,
          origem: 'PED-006',
        },
        {
          data: getRandomPastDate(4),
          tipo: 'saida',
          quantidade: 200,
          origem: 'LOTE-001',
        },
      ],
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
  ];

  const ingredienteIds: Record<string, string> = {};

  for (const ingrediente of ingredientes) {
    const docRef = await addDoc(collection(db, 'ingredientes'), ingrediente);
    ingredienteIds[ingrediente.nome] = docRef.id;
    console.log(`  ✓ ${ingrediente.nome}`);
  }

  return ingredienteIds;
}

async function seedProdutos(ingredienteIds: Record<string, string>) {
  console.log('\n🍹 Criando produtos...');

  const produtos = [
    {
      nome: 'TROPICANA (270ml)',
      descricao: 'Drink tropical com vodka e xarope de morango',
      validade: 21,
      receita: [
        { ingredienteId: ingredienteIds['Vodka Absolut'], quantidade: 50, unidade: 'ml' },
        { ingredienteId: ingredienteIds['Xarope de Morango'], quantidade: 30, unidade: 'ml' },
        { ingredienteId: ingredienteIds['Gelo em Cubo'], quantidade: 100, unidade: 'g' },
        { ingredienteId: ingredienteIds['Copo 270ml Descartável'], quantidade: 1, unidade: 'unidade' },
        { ingredienteId: ingredienteIds['Canudo Biodegradável'], quantidade: 1, unidade: 'unidade' },
      ],
      ativo: true,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'MOJITO (270ml)',
      descricao: 'Drink refrescante com rum, limão e hortelã',
      validade: 21,
      receita: [
        { ingredienteId: ingredienteIds['Rum Havana Club'], quantidade: 50, unidade: 'ml' },
        { ingredienteId: ingredienteIds['Xarope de Limão'], quantidade: 30, unidade: 'ml' },
        { ingredienteId: ingredienteIds['Limão Tahiti'], quantidade: 0.5, unidade: 'unidade' },
        { ingredienteId: ingredienteIds['Hortelã Fresca'], quantidade: 10, unidade: 'g' },
        { ingredienteId: ingredienteIds['Gelo em Cubo'], quantidade: 100, unidade: 'g' },
        { ingredienteId: ingredienteIds['Copo 270ml Descartável'], quantidade: 1, unidade: 'unidade' },
        { ingredienteId: ingredienteIds['Canudo Biodegradável'], quantidade: 1, unidade: 'unidade' },
      ],
      ativo: true,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'CAIPIRINHA (270ml)',
      descricao: 'Clássico brasileiro com vodka',
      validade: 21,
      receita: [
        { ingredienteId: ingredienteIds['Vodka Absolut'], quantidade: 60, unidade: 'ml' },
        { ingredienteId: ingredienteIds['Limão Tahiti'], quantidade: 1, unidade: 'unidade' },
        { ingredienteId: ingredienteIds['Açúcar Refinado'], quantidade: 30, unidade: 'g' },
        { ingredienteId: ingredienteIds['Gelo em Cubo'], quantidade: 100, unidade: 'g' },
        { ingredienteId: ingredienteIds['Copo 270ml Descartável'], quantidade: 1, unidade: 'unidade' },
        { ingredienteId: ingredienteIds['Canudo Biodegradável'], quantidade: 1, unidade: 'unidade' },
      ],
      ativo: true,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
  ];

  const produtoIds: Record<string, string> = {};

  for (const produto of produtos) {
    const docRef = await addDoc(collection(db, 'produtos'), produto);
    produtoIds[produto.nome] = docRef.id;
    console.log(`  ✓ ${produto.nome}`);
  }

  return produtoIds;
}

async function seedPedidos(ingredienteIds: Record<string, string>) {
  console.log('\n📋 Criando pedidos...');

  const pedidos = [
    {
      numero: 'PED-001',
      fornecedor: 'Distribuidora Bebidas XYZ',
      status: 'recebido',
      itens: [
        {
          ingredienteId: ingredienteIds['Vodka Absolut'],
          ingredienteNome: 'Vodka Absolut',
          quantidade: 5000,
          unidade: 'ml',
          preco: 85.0,
        },
        {
          ingredienteId: ingredienteIds['Rum Havana Club'],
          ingredienteNome: 'Rum Havana Club',
          quantidade: 4000,
          unidade: 'ml',
          preco: 120.0,
        },
      ],
      valorTotal: 205.0,
      documentos: [],
      dataSolicitacao: getRandomPastDate(15),
      dataEntregaPrevista: getRandomPastDate(12),
      dataRecebimento: getRandomPastDate(10),
      solicitadoPor: 'admin',
      observacoes: 'Pedido inicial de bebidas',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      numero: 'PED-002',
      fornecedor: 'Insumos Gourmet Ltda',
      status: 'recebido',
      itens: [
        {
          ingredienteId: ingredienteIds['Xarope de Morango'],
          ingredienteNome: 'Xarope de Morango',
          quantidade: 2000,
          unidade: 'ml',
          preco: 35.0,
        },
        {
          ingredienteId: ingredienteIds['Xarope de Limão'],
          ingredienteNome: 'Xarope de Limão',
          quantidade: 2000,
          unidade: 'ml',
          preco: 32.0,
        },
      ],
      valorTotal: 67.0,
      documentos: [],
      dataSolicitacao: getRandomPastDate(20),
      dataEntregaPrevista: getRandomPastDate(17),
      dataRecebimento: getRandomPastDate(15),
      solicitadoPor: 'admin',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      numero: 'PED-003',
      fornecedor: 'Hortifruti Central',
      status: 'entrega',
      itens: [
        {
          ingredienteId: ingredienteIds['Limão Tahiti'],
          ingredienteNome: 'Limão Tahiti',
          quantidade: 200,
          unidade: 'unidade',
          preco: 40.0,
        },
        {
          ingredienteId: ingredienteIds['Hortelã Fresca'],
          ingredienteNome: 'Hortelã Fresca',
          quantidade: 500,
          unidade: 'g',
          preco: 15.0,
        },
      ],
      valorTotal: 55.0,
      documentos: [],
      dataSolicitacao: getRandomPastDate(5),
      dataEntregaPrevista: getRandomPastDate(2),
      solicitadoPor: 'admin',
      observacoes: 'Frutas frescas para próximo evento',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
  ];

  for (const pedido of pedidos) {
    await addDoc(collection(db, 'pedidos'), pedido);
    console.log(`  ✓ ${pedido.numero} - ${pedido.fornecedor}`);
  }
}

async function seedEventos() {
  console.log('\n🎉 Criando eventos...');

  const eventos = [
    {
      nome: 'Festa de Verão 2024',
      descricao: 'Grande festa de verão com shows e piscina',
      local: 'Clube Recreativo Central',
      dataInicio: getRandomDate(15),
      dataFim: getRandomDate(15),
      vendasPrevistas: 200,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Show Banda Local',
      descricao: 'Apresentação de banda local com drinks especiais',
      local: 'Bar do Zé',
      dataInicio: getRandomDate(30),
      dataFim: getRandomDate(30),
      vendasPrevistas: 150,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Festival de Inverno',
      descricao: 'Festival com comidas típicas e drinks quentes',
      local: 'Praça da Cidade',
      dataInicio: getRandomDate(60),
      dataFim: getRandomDate(62),
      vendasPrevistas: 300,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Evento Corporativo XYZ',
      local: 'Hotel Convention Center',
      dataInicio: getRandomPastDate(10),
      dataFim: getRandomPastDate(10),
      vendasPrevistas: 120,
      vendasReais: 135,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      nome: 'Casamento Silva',
      descricao: 'Celebração de casamento com open bar',
      local: 'Espaço Jardim das Flores',
      dataInicio: getRandomPastDate(25),
      dataFim: getRandomPastDate(25),
      vendasPrevistas: 180,
      vendasReais: 165,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
  ];

  const eventoIds: string[] = [];

  for (const evento of eventos) {
    const docRef = await addDoc(collection(db, 'eventos'), evento);
    eventoIds.push(docRef.id);
    console.log(`  ✓ ${evento.nome} - ${evento.local}`);
  }

  return eventoIds;
}

async function seedLotesProducao(
  eventoIds: string[],
  produtoIds: Record<string, string>,
  ingredienteIds: Record<string, string>
) {
  console.log('\n🏭 Criando lotes de produção...');

  const lotes = [
    {
      eventoId: eventoIds[3], // Evento passado
      dataProducao: getRandomPastDate(11),
      status: 'executado',
      configDistribuicao: {
        totalDrinks: 120,
        percentuais: {
          [produtoIds['TROPICANA (270ml)']]: 40,
          [produtoIds['MOJITO (270ml)']]: 35,
          [produtoIds['CAIPIRINHA (270ml)']]: 25,
        },
      },
      itensPlanejados: [
        {
          produtoId: produtoIds['TROPICANA (270ml)'],
          produtoNome: 'TROPICANA (270ml)',
          quantidadeSugerida: 48,
          quantidadeFinal: 48,
        },
        {
          produtoId: produtoIds['MOJITO (270ml)'],
          produtoNome: 'MOJITO (270ml)',
          quantidadeSugerida: 42,
          quantidadeFinal: 42,
        },
        {
          produtoId: produtoIds['CAIPIRINHA (270ml)'],
          produtoNome: 'CAIPIRINHA (270ml)',
          quantidadeSugerida: 30,
          quantidadeFinal: 30,
        },
      ],
      consumoCalculado: {
        [ingredienteIds['Vodka Absolut']]: 4200, // (48*50 + 30*60)
        [ingredienteIds['Rum Havana Club']]: 2100, // (42*50)
        [ingredienteIds['Xarope de Morango']]: 1440, // (48*30)
        [ingredienteIds['Xarope de Limão']]: 1260, // (42*30)
        [ingredienteIds['Limão Tahiti']]: 51, // (42*0.5 + 30*1)
        [ingredienteIds['Hortelã Fresca']]: 420, // (42*10)
        [ingredienteIds['Açúcar Refinado']]: 900, // (30*30)
        [ingredienteIds['Gelo em Cubo']]: 12000, // (120*100)
        [ingredienteIds['Copo 270ml Descartável']]: 120,
        [ingredienteIds['Canudo Biodegradável']]: 120,
      },
      criadoPor: 'admin',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
    {
      eventoId: eventoIds[0], // Próximo evento
      dataProducao: getRandomDate(14),
      status: 'planejado',
      configDistribuicao: {
        totalDrinks: 200,
        percentuais: {
          [produtoIds['TROPICANA (270ml)']]: 35,
          [produtoIds['MOJITO (270ml)']]: 40,
          [produtoIds['CAIPIRINHA (270ml)']]: 25,
        },
      },
      itensPlanejados: [
        {
          produtoId: produtoIds['TROPICANA (270ml)'],
          produtoNome: 'TROPICANA (270ml)',
          quantidadeSugerida: 70,
          quantidadeFinal: 70,
        },
        {
          produtoId: produtoIds['MOJITO (270ml)'],
          produtoNome: 'MOJITO (270ml)',
          quantidadeSugerida: 80,
          quantidadeFinal: 80,
        },
        {
          produtoId: produtoIds['CAIPIRINHA (270ml)'],
          produtoNome: 'CAIPIRINHA (270ml)',
          quantidadeSugerida: 50,
          quantidadeFinal: 50,
        },
      ],
      consumoCalculado: {
        [ingredienteIds['Vodka Absolut']]: 6500, // (70*50 + 50*60)
        [ingredienteIds['Rum Havana Club']]: 4000, // (80*50)
        [ingredienteIds['Xarope de Morango']]: 2100, // (70*30)
        [ingredienteIds['Xarope de Limão']]: 2400, // (80*30)
        [ingredienteIds['Limão Tahiti']]: 90, // (80*0.5 + 50*1)
        [ingredienteIds['Hortelã Fresca']]: 800, // (80*10)
        [ingredienteIds['Açúcar Refinado']]: 1500, // (50*30)
        [ingredienteIds['Gelo em Cubo']]: 20000, // (200*100)
        [ingredienteIds['Copo 270ml Descartável']]: 200,
        [ingredienteIds['Canudo Biodegradável']]: 200,
      },
      criadoPor: 'admin',
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now(),
    },
  ];

  for (const lote of lotes) {
    await addDoc(collection(db, 'lotesProducao'), lote);
    console.log(`  ✓ Lote para evento ${lote.status}`);
  }
}

// ===== 6. PONTOS DE VENDA =====

async function seedPontosVenda() {
  console.log('\n📍 Criando pontos de venda...');

  const pontosVenda = [
    {
      nome: 'Ilha Principal',
      descricao: 'Ponto de venda principal na entrada do evento',
      ativo: true,
    },
    {
      nome: 'Ilha VIP',
      descricao: 'Área exclusiva para convidados VIP',
      ativo: true,
    },
    {
      nome: 'Ilha Lounge',
      descricao: 'Área de descanso com bar',
      ativo: true,
    },
  ];

  const pontoIds: string[] = [];

  for (const ponto of pontosVenda) {
    const docRef = await addDoc(collection(db, 'pontosVenda'), ponto);
    pontoIds.push(docRef.id);
    console.log(`  ✓ ${ponto.nome}`);
  }

  return pontoIds;
}

// ===== 7. VENDAS =====

async function seedVendas(
  eventoIds: string[],
  pontoVendaIds: string[],
  produtoIds: Record<string, string>
) {
  console.log('\n💰 Criando vendas...');

  // Vendas para eventos passados
  const vendasData = [
    // Evento 1 - Feira de São João (já realizado)
    {
      eventoId: eventoIds[0],
      pontoVendaId: pontoVendaIds[0], // Ilha Principal
      produtoId: produtoIds.tropicana,
      quantidade: 35,
      valor: 15,
      dataVenda: getRandomPastDate(25),
    },
    {
      eventoId: eventoIds[0],
      pontoVendaId: pontoVendaIds[0],
      produtoId: produtoIds.mojito,
      quantidade: 28,
      valor: 18,
      dataVenda: getRandomPastDate(25),
    },
    {
      eventoId: eventoIds[0],
      pontoVendaId: pontoVendaIds[1], // Ilha VIP
      produtoId: produtoIds.caipirinha,
      quantidade: 20,
      valor: 20,
      dataVenda: getRandomPastDate(25),
    },
    {
      eventoId: eventoIds[0],
      pontoVendaId: pontoVendaIds[2], // Ilha Lounge
      produtoId: produtoIds.tropicana,
      quantidade: 15,
      valor: 15,
      dataVenda: getRandomPastDate(25),
    },
    // Evento 2 - Show de Rock (já realizado)
    {
      eventoId: eventoIds[1],
      pontoVendaId: pontoVendaIds[0],
      produtoId: produtoIds.caipirinha,
      quantidade: 42,
      valor: 20,
      dataVenda: getRandomPastDate(10),
    },
    {
      eventoId: eventoIds[1],
      pontoVendaId: pontoVendaIds[0],
      produtoId: produtoIds.mojito,
      quantidade: 38,
      valor: 18,
      dataVenda: getRandomPastDate(10),
    },
    {
      eventoId: eventoIds[1],
      pontoVendaId: pontoVendaIds[1],
      produtoId: produtoIds.tropicana,
      quantidade: 30,
      valor: 15,
      dataVenda: getRandomPastDate(10),
    },
  ];

  let count = 0;
  for (const venda of vendasData) {
    await addDoc(collection(db, 'vendas'), {
      ...venda,
      criadoEm: Timestamp.now(),
    });
    count++;
  }

  console.log(`  ✓ ${count} vendas criadas`);
  console.log(`  • Total de unidades vendidas: ${vendasData.reduce((acc, v) => acc + v.quantidade, 0)}`);
  console.log(`  • Receita total: R$ ${vendasData.reduce((acc, v) => acc + (v.quantidade * v.valor), 0).toFixed(2)}`);
}

// ===== 8. USUÁRIOS =====

async function seedUsuarios() {
  console.log('\n👤 Criando usuários...');

  const usuarios = [
    {
      email: 'admin@revis.com',
      senha: 'admin123',
      nome: 'Administrador',
      nivel: 'admin',
    },
    {
      email: 'producao@revis.com',
      senha: 'producao123',
      nome: 'Equipe Produção',
      nivel: 'producao',
    },
    {
      email: 'pedidos@revis.com',
      senha: 'pedidos123',
      nome: 'Responsável Pedidos',
      nivel: 'pedidos',
    },
  ];

  for (const usuario of usuarios) {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        usuario.email,
        usuario.senha
      );

      // Criar documento de usuário no Firestore
      await addDoc(collection(db, 'usuarios'), {
        id: userCredential.user.uid,
        nome: usuario.nome,
        email: usuario.email,
        nivel: usuario.nivel,
        ativo: true,
        criadoEm: Timestamp.now(),
        atualizadoEm: Timestamp.now(),
      });

      console.log(`  ✓ ${usuario.nome} (${usuario.email})`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`  ⚠ ${usuario.email} já existe`);
      } else {
        console.error(`  ✗ Erro ao criar ${usuario.email}:`, error.message);
      }
    }
  }
}

// ===== EXECUÇÃO PRINCIPAL =====

async function main() {
  console.log('🚀 Iniciando seed do Firebase...\n');

  try {
    const ingredienteIds = await seedIngredientes();
    const produtoIds = await seedProdutos(ingredienteIds);
    await seedPedidos(ingredienteIds);
    const eventoIds = await seedEventos();
    await seedLotesProducao(eventoIds, produtoIds, ingredienteIds);
    const pontoVendaIds = await seedPontosVenda();
    await seedVendas(eventoIds, pontoVendaIds, produtoIds);
    await seedUsuarios();

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  • ${Object.keys(ingredienteIds).length} ingredientes`);
    console.log(`  • ${Object.keys(produtoIds).length} produtos`);
    console.log('  • 3 pedidos');
    console.log(`  • ${eventoIds.length} eventos`);
    console.log('  • 2 lotes de produção');
    console.log(`  • ${pontoVendaIds.length} pontos de venda`);
    console.log('  • 7 vendas registradas');
    console.log('  • 3 usuários');
    console.log('\n🔑 Credenciais de acesso:');
    console.log('  Admin: admin@revis.com / admin123');
    console.log('  Produção: producao@revis.com / producao123');
    console.log('  Pedidos: pedidos@revis.com / pedidos123');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

main();
