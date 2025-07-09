// Tipos baseados no arquivo api-routes-types.json

// Tipos de Autenticação
export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: {
      id: string
      email: string
      nome: string
      telefone: string | null
      tipo: string
    }
  }
  message: string
}

export interface User {
  id: string
  email: string
  nome: string
  telefone: string | null
  tipo: string
}

// Tipos do Dashboard
export interface DashboardStats {
  pedidosHoje: number
  totalVendasHoje: number
  ticketMedio: number
  totalClientes: number
}

export interface TopProduto {
  nome: string
  categoria: string
  quantidade_vendida: number
  total_vendido: number
}

export interface PedidoRecente {
  id: string
  cliente: {
    nome: string
    telefone: string
  }
  total: number
  status: string
  dataHora: string
  forma_pagamento: string
}

export interface DashboardResponse {
  success: boolean
  data: {
    estatisticas: DashboardStats
    topProdutos: TopProduto[]
    pedidosRecentes: PedidoRecente[]
  }
}

export interface VendasChartData {
  data: string // YYYY-MM-DD
  vendas: number
}

export interface VendasChartResponse {
  success: boolean
  data: {
    periodo: string
    dados: VendasChartData[]
  }
}

// Tipos de Produtos
export interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  imagem: string | null // URL relativa da imagem
  disponivel: boolean
  criado_em: string
}

export interface CreateProdutoRequest {
  nome: string
  descricao: string
  categoria: string
  preco: number
  disponivel?: boolean
}

export interface UpdateProdutoRequest {
  nome?: string
  descricao?: string
  categoria?: string
  preco?: number
  disponivel?: boolean
}

// Tipos de Pedidos
export interface ItemPedido {
  id: string
  nome: string
  quantidade: number
  precoUnitario: number
  subtotal: number
  observacoes: string | null
}

export interface Pedido {
  id: string
  cliente_id: string
  cliente_nome: string
  cliente_telefone: string
  total: number
  taxa_entrega: number
  status: string
  forma_pagamento: string
  observacoes: string | null
  endereco_entrega: string
  criado_em: string
  itens: ItemPedido[]
}

export interface CreatePedidoRequest {
  cliente_id: string
  total: number
  taxa_entrega?: number
  observacoes?: string
  endereco_entrega?: string
  forma_pagamento?: string
  itens: any[]
}

export interface UpdatePedidoRequest {
  cliente_id?: string
  total?: number
  taxa_entrega?: number
  observacoes?: string
  endereco_entrega?: string
  forma_pagamento?: string
  itens?: any[]
}

// Tipos de Clientes
export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string | null
  endereco: string | null
  bairro: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  observacoes: string | null
  status: string
  criado_em: string
}

export interface CreateClienteRequest {
  nome: string
  telefone: string
  email?: string
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  observacoes?: string
}

export interface UpdateClienteRequest {
  nome?: string
  telefone?: string
  email?: string
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  observacoes?: string
}

// Tipos de Configurações
export interface Config {
  id: string
  chave: string
  valor: string
  descricao: string | null
  tipo: string
  criado_em: string
}

export interface CreateConfigRequest {
  chave: string
  valor: string
  descricao?: string
  tipo?: string
}

export interface UpdateConfigRequest {
  chave?: string
  valor?: string
  descricao?: string
  tipo?: string
}

// Tipos de Painel
export interface PainelInfo {
  nome: string
  versao: string
  ambiente: string
}

export interface MenuItem {
  id: string
  nome: string
  icone: string
  url: string
}

// Tipos de API Status
export interface ApiStatus {
  uptime: number
  timestamp: string
  environment: string
  version: string
}

export interface HealthCheck {
  status: string
  message: string
  timestamp: string
}

// Tipos de Resposta Genérica
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  error?: any
} 