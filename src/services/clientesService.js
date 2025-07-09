import apiRequest from './api.js'

export const clientesService = {
  // Buscar todos os clientes
  async getClientes(filters = {}) {
    const params = new URLSearchParams(filters)
    return await apiRequest(`/clientes?${params}`)
  },

  // Buscar cliente por ID
  async getClienteById(id) {
    return await apiRequest(`/clientes/${id}`)
  },

  // Criar novo cliente
  async createCliente(clienteData) {
    return await apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(clienteData)
    })
  },

  // Atualizar cliente
  async updateCliente(id, clienteData) {
    return await apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clienteData)
    })
  },

  // Deletar cliente
  async deleteCliente(id) {
    return await apiRequest(`/clientes/${id}`, {
      method: 'DELETE'
    })
  },

  // Buscar cliente por email
  async getClienteByEmail(email) {
    return await apiRequest(`/clientes/email/${email}`)
  },

  // Buscar cliente por telefone
  async getClienteByTelefone(telefone) {
    return await apiRequest(`/clientes/telefone/${telefone}`)
  },

  // Buscar pedidos do cliente
  async getClientePedidos(id) {
    return await apiRequest(`/clientes/${id}/pedidos`)
  },

  // Buscar estatísticas do cliente
  async getClienteStats(id) {
    return await apiRequest(`/clientes/${id}/stats`)
  },

  // Atualizar status do cliente
  async updateClienteStatus(id, status) {
    return await apiRequest(`/clientes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
  },

  // Buscar clientes ativos
  async getClientesAtivos() {
    return await apiRequest('/clientes/ativos')
  },

  // Buscar clientes inativos
  async getClientesInativos() {
    return await apiRequest('/clientes/inativos')
  },

  // Buscar clientes por nome
  async searchClientesByNome(nome) {
    return await apiRequest(`/clientes/search?nome=${encodeURIComponent(nome)}`)
  }
} 