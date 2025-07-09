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
  async createProduto(produtoData, imagem = null) {
    const formData = new FormData()
    
    // Adicionar campos do produto
    Object.keys(produtoData).forEach(key => {
      if (produtoData[key] !== null && produtoData[key] !== undefined) {
        formData.append(key, produtoData[key])
      }
    })
    
    // Adicionar imagem se fornecida
    if (imagem) {
      formData.append('imagem', imagem)
    }
    
    return await apiRequest('/produtos', {
      method: 'POST',
      body: formData
    })
  },

  // Atualizar produto
  async updateProduto(id, produtoData, imagem = null) {
    const formData = new FormData()
    
    // Adicionar campos do produto
    Object.keys(produtoData).forEach(key => {
      if (produtoData[key] !== null && produtoData[key] !== undefined) {
        formData.append(key, produtoData[key])
      }
    })
    
    // Adicionar imagem se fornecida
    if (imagem) {
      formData.append('imagem', imagem)
    }
    
    return await apiRequest(`/produtos/${id}`, {
      method: 'PUT',
      body: formData
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