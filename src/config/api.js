// Configurações da API
export const API_CONFIG = {
  // URL base da API
  BASE_URL: 'http://localhost:3000/api',
  
  // Timeout das requisições (em ms)
  TIMEOUT: 10000,
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },
  
  // Configurações de retry
  RETRY: {
    attempts: 3,
    delay: 1000
  }
}

// Estrutura de resposta esperada da API
export const API_RESPONSE_STRUCTURE = {
  success: true,
  data: {},
  message: ''
}

// Endpoints da API
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  
  // Dashboard
  DASHBOARD: {
    ROOT: '/dashboard',
    STATS: '/dashboard/stats',
    GRAFICO: '/dashboard/grafico',
    VENDAS_CHART: '/dashboard/vendas-chart',
    TOP_PRODUTOS: '/dashboard/top-produtos',
    PEDIDOS_RECENTES: '/dashboard/pedidos-recentes',
    RELATORIOS: '/dashboard/relatorios'
  },
  
  // Pedidos
  PEDIDOS: {
    ROOT: '/pedidos',
    BY_ID: (id) => `/pedidos/${id}`,
    BY_STATUS: (status) => `/pedidos/status/${status}`,
    BY_DATE: (date) => `/pedidos/date/${date}`,
    UPDATE_STATUS: (id) => `/pedidos/${id}/status`
  },
  
  // Produtos
  PRODUTOS: {
    ROOT: '/produtos',
    BY_ID: (id) => `/produtos/${id}`,
    BY_CATEGORIA: (categoria) => `/produtos/categoria/${categoria}`,
    DISPONIVEIS: '/produtos/disponiveis',
    CATEGORIAS: '/produtos/categorias',
    UPDATE_DISPONIBILIDADE: (id) => `/produtos/${id}/disponibilidade`,
    UPLOAD_IMAGEM: (id) => `/produtos/${id}/imagem`
  },
  
  // Clientes
  CLIENTES: {
    ROOT: '/clientes',
    BY_ID: (id) => `/clientes/${id}`,
    BY_EMAIL: (email) => `/clientes/email/${email}`,
    BY_TELEFONE: (telefone) => `/clientes/telefone/${telefone}`,
    PEDIDOS: (id) => `/clientes/${id}/pedidos`,
    STATS: (id) => `/clientes/${id}/stats`,
    UPDATE_STATUS: (id) => `/clientes/${id}/status`,
    ATIVOS: '/clientes/ativos',
    INATIVOS: '/clientes/inativos',
    SEARCH: '/clientes/search'
  },
  
  // API Status
  API: {
    HEALTH: '/health',
    STATUS: '/status'
  },
  
  // Painel
  PAINEL: {
    INFO: '/painel/info',
    MENU: '/painel/menu'
  },
  
  // Configurações
  CONFIG: {
    ROOT: '/config',
    BY_ID: (id) => `/config/${id}`
  }
} 