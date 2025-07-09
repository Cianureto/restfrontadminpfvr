import apiRequest from './api.js'

export const pedidosService = {
  // Buscar todos os pedidos
  async getPedidos(filters = {}) {
    const params = new URLSearchParams(filters)
    return await apiRequest(`/pedidos?${params}`)
  },

  // Buscar pedido por ID
  async getPedidoById(id) {
    return await apiRequest(`/pedidos/${id}`)
  },

  // Atualizar status do pedido
  async updatePedidoStatus(id, status) {
    return await apiRequest(`/pedidos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  },

  // Criar novo pedido
  async createPedido(pedidoData) {
    return await apiRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData)
    })
  },

  // Atualizar pedido
  async updatePedido(id, pedidoData) {
    return await apiRequest(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedidoData)
    })
  },

  // Cancelar pedido
  async deletePedido(id) {
    return await apiRequest(`/pedidos/${id}`, {
      method: 'DELETE'
    })
  },

  // Buscar pedidos por status
  async getPedidosByStatus(status) {
    return await apiRequest(`/pedidos/status/${status}`)
  },

  // Buscar pedidos por data
  async getPedidosByDate(data) {
    return await apiRequest(`/pedidos/date/${data}`)
  }
} 