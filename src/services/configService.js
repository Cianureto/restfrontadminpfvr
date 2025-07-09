import apiRequest from './api.js'

export const configService = {
  // Listar configurações
  async getConfigs() {
    return await apiRequest('/config')
  },

  // Criar configuração
  async createConfig(configData) {
    return await apiRequest('/config', {
      method: 'POST',
      body: JSON.stringify(configData)
    })
  },

  // Atualizar configuração
  async updateConfig(id, configData) {
    return await apiRequest(`/config/${id}`, {
      method: 'PUT',
      body: JSON.stringify(configData)
    })
  },

  // Deletar configuração
  async deleteConfig(id) {
    return await apiRequest(`/config/${id}`, {
      method: 'DELETE'
    })
  }
} 