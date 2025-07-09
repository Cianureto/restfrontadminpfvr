import { useState, useEffect } from 'react'
import { pedidosService } from '../services/pedidosService.js'

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [error, setError] = useState('')

  useEffect(() => {
    loadPedidos()
  }, [filter])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      setError('')

      let response
      if (filter === 'todos') {
        response = await pedidosService.getPedidos()
      } else {
        response = await pedidosService.getPedidosByStatus(filter)
      }

      const pedidos = response.data || response || []
      setPedidos(pedidos)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (pedidoId, newStatus) => {
    try {
      await pedidosService.updatePedidoStatus(pedidoId, newStatus)
      
      // Atualizar estado local
      setPedidos(pedidos.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, status: newStatus }
          : pedido
      ))
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do pedido')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-red-100 text-red-800'
      case 'Em preparo': return 'bg-yellow-100 text-yellow-800'
      case 'Pronto': return 'bg-blue-100 text-blue-800'
      case 'Entregue': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredPedidos = pedidos.filter(pedido => {
    if (filter === 'todos') return true
    return pedido.status.toLowerCase() === filter.toLowerCase()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-receipt text-indigo-600"></i>
          Pedidos
        </h2>
        <p className="text-gray-500">Gerencie todos os pedidos do restaurante</p>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2">
        {['todos', 'pendente', 'em preparo', 'pronto', 'entregue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {filteredPedidos.map((pedido) => (
          <div key={pedido.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{pedido.id}</h3>
                <p className="text-gray-600">{pedido.cliente}</p>
                <p className="text-sm text-gray-500">{pedido.telefone}</p>
                <p className="text-sm text-gray-500">{pedido.endereco}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                  {pedido.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">{pedido.data}</p>
                <p className="text-sm text-gray-500">{pedido.tempoEstimado}</p>
              </div>
            </div>

            {/* Itens do pedido */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Itens:</h4>
              <div className="space-y-1">
                {pedido.itens.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantidade}x {item.nome}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <span className="text-lg font-bold text-gray-800">
                  Total: R$ {pedido.total.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                {pedido.status === 'Pendente' && (
                  <button
                    onClick={() => updateStatus(pedido.id, 'Em preparo')}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Iniciar Preparo
                  </button>
                )}
                {pedido.status === 'Em preparo' && (
                  <button
                    onClick={() => updateStatus(pedido.id, 'Pronto')}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Marcar Pronto
                  </button>
                )}
                {pedido.status === 'Pronto' && (
                  <button
                    onClick={() => updateStatus(pedido.id, 'Entregue')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Marcar Entregue
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPedidos.length === 0 && (
        <div className="text-center py-12">
          <i className="fa-solid fa-receipt text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Nenhum pedido encontrado</p>
        </div>
      )}
    </div>
  )
}

export default Pedidos 