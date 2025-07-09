import apiRequest from './api.js'

export const produtosService = {
  // Buscar todos os produtos
  async getProdutos(filters = {}) {
    const params = new URLSearchParams(filters)
    return await apiRequest(`/produtos?${params}`)
  },

  // Buscar produto por ID
  async getProdutoById(id) {
    return await apiRequest(`/produtos/${id}`)
  },

  // Criar novo produto
  async createProduto(produtoData) {
    return await apiRequest('/produtos', {
      method: 'POST',
      body: JSON.stringify(produtoData)
    })
  },

  // Atualizar produto
  async updateProduto(id, produtoData) {
    return await apiRequest(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(produtoData)
    })
  },

  // Deletar produto
  async deleteProduto(id) {
    return await apiRequest(`/produtos/${id}`, {
      method: 'DELETE'
    })
  },

  // Atualizar disponibilidade do produto
  async updateProdutoDisponibilidade(id, disponivel) {
    return await apiRequest(`/produtos/${id}/disponibilidade`, {
      method: 'PUT',
      body: JSON.stringify({ disponivel })
    })
  },

  // Buscar produtos por categoria
  async getProdutosByCategoria(categoria) {
    return await apiRequest(`/produtos/categoria/${categoria}`)
  },

  // Buscar produtos disponíveis
  async getProdutosDisponiveis() {
    return await apiRequest('/produtos/disponiveis')
  },

  // Upload de imagem do produto
  async uploadProdutoImagem(id, imageFile) {
    const formData = new FormData()
    formData.append('imagem', imageFile)
    
    return await apiRequest(`/produtos/${id}/imagem`, {
      method: 'POST',
      body: formData
    })
  },

  // Buscar categorias
  async getCategorias() {
    return await apiRequest('/produtos/categorias')
  }
} 