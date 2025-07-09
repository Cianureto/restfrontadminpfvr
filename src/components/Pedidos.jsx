import { useState, useEffect } from 'react'
import { pedidosService } from '../services/pedidosService.js'
import { useRef } from 'react';

function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')
  const [error, setError] = useState('')
  const [newPedido, setNewPedido] = useState(null)
  const knownPedidosRef = useRef([])

  useEffect(() => {
    loadPedidos()
    // Checagem periódica de novos pedidos
    const interval = setInterval(() => {
      checkForNewPedidos()
    }, 10000) // 10 segundos
    return () => clearInterval(interval)
  }, [filter])

  const checkForNewPedidos = async () => {
    try {
      let response
      if (filter === 'todos') {
        response = await pedidosService.getPedidos()
      } else {
        response = await pedidosService.getPedidosByStatus(filter)
      }
      const pedidosAtuais = response.data || response || []
      const knownIds = knownPedidosRef.current.map(p => p.id)
      const novos = pedidosAtuais.filter(p => !knownIds.includes(p.id))
      if (novos.length > 0) {
        setNewPedido(novos[0])
        setTimeout(() => setNewPedido(null), 6000)
      }
      knownPedidosRef.current = pedidosAtuais
    } catch (e) {}
  }

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
      knownPedidosRef.current = pedidos // Atualiza lista conhecida
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (pedidoId, newStatus) => {
    try {
      await pedidosService.updatePedidoStatus(pedidoId, newStatus);
      // Atualiza o filtro para a nova etapa após a mudança de status
      let nextFilter = filter;
      if (newStatus === 'Em Preparo') nextFilter = 'em preparo';
      else if (newStatus === 'Pronto') nextFilter = 'pronto';
      else if (newStatus === 'Entregue') nextFilter = 'entregue';
      else if (newStatus === 'Cancelado') nextFilter = 'pendente'; // ou 'todos', conforme desejado
      setFilter(nextFilter);
      // Removido: loadPedidos();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
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

  const statusEtapas = [
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Em Preparo', value: 'Em Preparo' },
    { label: 'Pronto', value: 'Pronto' },
    { label: 'Entregue', value: 'Entregue' },
  ];

  // Função para atualizar o status do pedido

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Pop-up de novo pedido */}
      {newPedido && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in bg-white border-l-8 border-indigo-600 shadow-2xl rounded-xl p-5 flex items-center gap-4 min-w-[320px] max-w-xs">
          <div className="bg-indigo-600 rounded-full p-3 flex items-center justify-center">
            <i className="fa-solid fa-bell text-white text-2xl"></i>
          </div>
          <div>
            <p className="font-bold text-indigo-700 text-lg mb-1 flex items-center gap-2">
              Novo Pedido Recebido!
            </p>
            <p className="text-gray-800 font-semibold">Pedido #{newPedido.id}</p>
            <p className="text-gray-600 text-sm">Cliente ID: {newPedido.cliente_id}</p>
            <p className="text-gray-600 text-sm">Total: R$ {newPedido.total?.toFixed(2)}</p>
            <p className="text-gray-500 text-xs mt-1">{new Date().toLocaleTimeString()}</p>
          </div>
          <button onClick={() => setNewPedido(null)} className="ml-2 text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
        </div>
      )}
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
        {filteredPedidos.map((pedido) => {
          // Determina o índice da etapa atual
          const etapaAtual = statusEtapas.findIndex(e => e.value.toLowerCase() === pedido.status?.toLowerCase());
          return (
            <div key={pedido.id} className="bg-white rounded-xl shadow p-6">
              {/* Stepper visual */}
              <div className="flex items-center justify-between mb-4">
                {statusEtapas.map((etapa, idx) => (
                  <div key={etapa.value} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200
                      ${idx < etapaAtual ? 'bg-indigo-600 border-indigo-600 text-white' : ''}
                      ${idx === etapaAtual ? 'bg-white border-indigo-600 text-indigo-600 shadow-lg' : ''}
                      ${idx > etapaAtual ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                    `}>
                      {idx + 1}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${idx === etapaAtual ? 'text-indigo-700' : 'text-gray-400'}`}>{etapa.label}</span>
                    {idx < statusEtapas.length - 1 && (
                      <div className={`w-full h-1 ${idx < etapaAtual - 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
              {/* Fim do stepper */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Pedido #{pedido.id}</h3>
                  <p className="text-gray-600 font-medium">{pedido.cliente_nome}</p>
                  <p className="text-sm text-indigo-700 font-semibold mt-1">Endereço de Entrega:</p>
                  <p className="text-sm text-gray-700 mb-1">{pedido.endereco_entrega ?? 'N/A'}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>{pedido.status}</span>
                </div>
              </div>
              {/* Itens do pedido */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Itens do Pedido:</h4>
                <div className="space-y-1">
                  {pedido.itens && pedido.itens.length > 0 ? (
                    pedido.itens.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-indigo-50 rounded px-2 py-1">
                        <span className="font-medium text-gray-800">{item.quantidade}x {item.nome}</span>
                        <span className="text-gray-700">R$ {((Number(item.precoUnitario) || 0) * (Number(item.quantidade) || 0)).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-400">Nenhum item</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    Total: R$ {pedido.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* Botões dinâmicos para avançar/retroceder status */}
                  {etapaAtual > 0 && etapaAtual < statusEtapas.length - 1 && (
                    <button
                      onClick={() => updateStatus(pedido.id, statusEtapas[etapaAtual - 1].value)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <i className="fa-solid fa-arrow-left"></i> Voltar
                    </button>
                  )}
                  {etapaAtual < statusEtapas.length - 1 && (
                    <button
                      onClick={() => updateStatus(pedido.id, statusEtapas[etapaAtual + 1].value)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      Avançar <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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