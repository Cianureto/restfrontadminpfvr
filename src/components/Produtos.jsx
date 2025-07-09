import { useState, useEffect } from 'react'
import { produtosService } from '../services/produtosService.js'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    disponivel: true
  })

  useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await produtosService.getProdutos()
      const produtos = response.data || response || []
      setProdutos(produtos)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingProduto) {
        // Editar produto existente
        await produtosService.updateProduto(editingProduto.id, {
          ...formData,
          preco: parseFloat(formData.preco)
        })
        
        // Atualizar estado local
        setProdutos(produtos.map(produto => 
          produto.id === editingProduto.id 
            ? { ...produto, ...formData, preco: parseFloat(formData.preco) }
            : produto
        ))
      } else {
        // Adicionar novo produto
        const newProduto = await produtosService.createProduto({
          ...formData,
          preco: parseFloat(formData.preco)
        })
        
        setProdutos([...produtos, newProduto])
      }

      resetForm()
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto')
    }
  }

  const handleEdit = (produto) => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      disponivel: produto.disponivel
    })
    setShowModal(true)
  }

  const handleDelete = async (produtoId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await produtosService.deleteProduto(produtoId)
        setProdutos(produtos.filter(produto => produto.id !== produtoId))
      } catch (error) {
        console.error('Erro ao excluir produto:', error)
        alert('Erro ao excluir produto')
      }
    }
  }

  const toggleDisponibilidade = async (produtoId) => {
    try {
      const produto = produtos.find(p => p.id === produtoId)
      const newDisponivel = !produto.disponivel
      
      await produtosService.updateProdutoDisponibilidade(produtoId, newDisponivel)
      
      setProdutos(produtos.map(produto => 
        produto.id === produtoId 
          ? { ...produto, disponivel: newDisponivel }
          : produto
      ))
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade:', error)
      alert('Erro ao atualizar disponibilidade')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      disponivel: true
    })
    setEditingProduto(null)
    setShowModal(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-utensils text-indigo-600"></i>
            Produtos
          </h2>
          <p className="text-gray-500">Gerencie o cardápio do restaurante</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <i className="fa-solid fa-plus"></i>
          Novo Produto
        </button>
      </div>

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="bg-white rounded-xl shadow overflow-hidden">
            <img 
              src={produto.imagem} 
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{produto.nome}</h3>
                <span className="text-lg font-bold text-green-600">
                  R$ {produto.preco?.toFixed(2) || 0}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{produto.descricao}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {produto.categoria}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  produto.disponivel 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {produto.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(produto)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <i className="fa-solid fa-edit mr-1"></i>
                  Editar
                </button>
                <button
                  onClick={() => toggleDisponibilidade(produto.id)}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                    produto.disponivel
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <i className={`fa-solid ${produto.disponivel ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                  {produto.disponivel ? 'Ocultar' : 'Mostrar'}
                </button>
                <button
                  onClick={() => handleDelete(produto.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para adicionar/editar produto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduto ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Preço</label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Lanches">Lanches</option>
                  <option value="Pizzas">Pizzas</option>
                  <option value="Acompanhamentos">Acompanhamentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="disponivel"
                  checked={formData.disponivel}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-gray-700">Disponível</label>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingProduto ? 'Salvar' : 'Adicionar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produtos 