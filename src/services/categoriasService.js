import apiRequest from './api.js'

export const categoriasService = {
  // Buscar todas as categorias
  async getCategorias() {
    return await apiRequest('/categorias')
  },

  // Criar nova categoria
  async createCategoria(nome) {
    return await apiRequest('/categorias', {
      method: 'POST',
      body: JSON.stringify({ nome })
    })
  },

  // Editar categoria
  async updateCategoria(id, nome) {
    return await apiRequest(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nome })
    })
  },

  // Remover categoria
  async deleteCategoria(id) {
    return await apiRequest(`/categorias/${id}`, {
      method: 'DELETE'
    })
  }
} 