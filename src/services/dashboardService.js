import apiRequest from './api.js'

export const dashboardService = {
  // Buscar dados do dashboard
  async getDashboardData() {
    return await apiRequest('/dashboard')
  },

  // Buscar estatísticas gerais (inclui top produtos e pedidos recentes)
  async getStats() {
    return await apiRequest('/dashboard/stats')
  },

  // Buscar dados para gráficos
  async getGrafico(periodo = '7dias') {
    return await apiRequest(`/dashboard/grafico?periodo=${periodo}`)
  },

  // Buscar gráfico de vendas
  async getVendasChart(periodo = '7dias') {
    return await apiRequest(`/dashboard/vendas-chart?periodo=${periodo}`)
  },

  // Buscar top produtos
  async getTopProdutos(limite = 10) {
    return await apiRequest(`/dashboard/top-produtos?limite=${limite}`)
  },

  // Buscar pedidos recentes
  async getPedidosRecentes(limite = 10) {
    return await apiRequest(`/dashboard/pedidos-recentes?limite=${limite}`)
  },

  // Buscar relatórios
  async getRelatorios(tipo) {
    return await apiRequest(`/dashboard/relatorios?tipo=${tipo}`)
  }
} 