import { useState, useEffect } from 'react'
import { produtosService } from '../services/produtosService.js'
import { getImageUrl } from '../utils/imageUtils.js'
import ImageWithFallback from './ImageWithFallback.jsx'
import { categoriasService } from '../services/categoriasService.js'

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
    disponivel: true // sempre booleano
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showCategoriasModal, setShowCategoriasModal] = useState(false);

  const [categorias, setCategorias] = useState([
    { id: 1, nome: 'Lanches' },
    { id: 2, nome: 'Pizzas' },
    { id: 3, nome: 'Acompanhamentos' },
    { id: 4, nome: 'Bebidas' },
    { id: 5, nome: 'Sobremesas' },
  ])
  const [novaCategoria, setNovaCategoria] = useState('')
  const [editandoCategoria, setEditandoCategoria] = useState(null)
  const [nomeEditando, setNomeEditando] = useState('')

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
    e.preventDefault();

    try {
      const produtoData = {
        ...formData,
        preco: parseFloat(formData.preco)
      };

      if (editingProduto) {
        // Editar produto existente
        const response = await produtosService.updateProduto(editingProduto.id, produtoData, selectedImage);
        // Atualizar estado local
        setProdutos(produtos.map(produto =>
          produto.id === editingProduto.id
            ? { ...produto, ...produtoData, preco: parseFloat(formData.preco), imagem: response.data.imagem }
            : produto
        ));
      } else {
        // Adicionar novo produto
        const response = await produtosService.createProduto(produtoData, selectedImage);
        setProdutos([...produtos, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  }

  const handleEdit = (produto) => {
    setEditingProduto(produto)
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      disponivel: !!produto.disponivel // força booleano
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
      // Atualiza no backend
      const response = await produtosService.updateProdutoDisponibilidade(produtoId, newDisponivel)
      // Se a resposta da API retorna o produto atualizado, use ela:
      const produtoAtualizado = response && response.data ? response.data : { ...produto, disponivel: newDisponivel }
      setProdutos(produtos.map(p => 
        p.id === produtoId 
          ? { ...p, ...produtoAtualizado }
          : p
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
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? !!checked : value // força booleano
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  // Substituir o mock de categorias por busca real da API
  useEffect(() => {
    if (showCategoriasModal) {
      loadCategorias()
    }
  }, [showCategoriasModal])

  const loadCategorias = async () => {
    try {
      const resp = await categoriasService.getCategorias()
      setCategorias(resp.data || resp || [])
    } catch (e) {
      setCategorias([])
    }
  }

  const handleAddCategoria = async () => {
    if (novaCategoria.trim() && !categorias.some(c => c.nome.toLowerCase() === novaCategoria.trim().toLowerCase())) {
      await categoriasService.createCategoria(novaCategoria.trim())
      setNovaCategoria('')
      loadCategorias()
    }
  }
  const handleEditCategoria = (cat) => {
    setEditandoCategoria(cat.id)
    setNomeEditando(cat.nome)
  }
  const handleSaveEditCategoria = async () => {
    await categoriasService.updateCategoria(editandoCategoria, nomeEditando)
    setEditandoCategoria(null)
    setNomeEditando('')
    loadCategorias()
  }
  const handleDeleteCategoria = async (id) => {
    await categoriasService.deleteCategoria(id)
    loadCategorias()
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
            <ImageWithFallback 
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
              
              <div className="flex items-center gap-2 mb-1">
                <label className="block text-gray-700 font-medium">Categoria</label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:underline focus:outline-none"
                  onClick={() => setShowCategoriasModal(true)}
                >
                  Gerenciar Categorias
                </button>
              </div>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Imagem</label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos aceitos: JPG, PNG, WebP. Máximo 5MB.
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
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

      {/* Modal de Gerenciar Categorias */}
      {showCategoriasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowCategoriasModal(false)}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h3 className="text-lg font-semibold mb-4">Gerenciar Categorias</h3>
            <div className="space-y-2 mb-4">
              {categorias.map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  {editandoCategoria === cat.id ? (
                    <>
                      <input
                        type="text"
                        value={nomeEditando}
                        onChange={e => setNomeEditando(e.target.value)}
                        className="flex-1 px-2 py-1 border rounded"
                      />
                      <button className="text-green-600" onClick={handleSaveEditCategoria}><i className="fa-solid fa-check"></i></button>
                      <button className="text-gray-500" onClick={() => setEditandoCategoria(null)}><i className="fa-solid fa-xmark"></i></button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{cat.nome}</span>
                      <button className="text-blue-600" onClick={() => handleEditCategoria(cat)}><i className="fa-solid fa-edit"></i></button>
                      <button className="text-red-600" onClick={() => handleDeleteCategoria(cat.id)}><i className="fa-solid fa-trash"></i></button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                placeholder="Nova categoria"
                value={novaCategoria}
                onChange={e => setNovaCategoria(e.target.value)}
                className="flex-1 px-2 py-1 border rounded"
              />
              <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={handleAddCategoria}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Produtos 