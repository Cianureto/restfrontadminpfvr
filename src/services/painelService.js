import apiRequest from './api.js'

export const painelService = {
  // Informações do painel
  async getInfo() {
    return await apiRequest('/painel/info')
  },

  // Menu do painel
  async getMenu() {
    return await apiRequest('/painel/menu')
  }
} 