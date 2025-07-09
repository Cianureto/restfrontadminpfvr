import apiRequest from './api.js'

export const apiService = {
  // Health check da API
  async getHealth() {
    return await apiRequest('/health')
  },

  // Status do servidor
  async getStatus() {
    return await apiRequest('/status')
  }
} 