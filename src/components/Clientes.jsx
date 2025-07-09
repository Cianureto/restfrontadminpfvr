import { useState, useEffect } from 'react'
import { clientesService } from '../services/clientesService.js'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadClientes()
  }, [])

  // Função para buscar estatísticas de todos os clientes
  const fetchStatsForAllClientes = async (clientesList) => {
    const updatedClientes = await Promise.all(
      clientesList.map(async (cliente) => {
        try {
          const statsResp = await clientesService.getClienteStats(cliente.id)
          const stats = statsResp.data || statsResp
          return {
            ...cliente,
            valorTotal: stats.totalGasto ?? 0,
            totalPedidos: stats.totalPedidos ?? 0,
            ultimoPedido: stats.ultimoPedido?.criado_em ? new Date(stats.ultimoPedido.criado_em).toLocaleDateString('pt-BR') : '',
          }
        } catch (e) {
          return { ...cliente, valorTotal: 0, totalPedidos: 0 }
        }
      })
    )
    setClientes(updatedClientes)
  }

  const loadClientes = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await clientesService.getClientes()
      const clientesList = response.data || response || []
      setClientes(clientesList)
      // Buscar estatísticas após carregar clientes
      fetchStatsForAllClientes(clientesList)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  )

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
          <i className="fa-solid fa-users text-indigo-600"></i>
          Clientes
        </h2>
        <p className="text-gray-500">Gerencie a base de clientes do restaurante</p>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <i className="fa-solid fa-users text-white text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientes.filter(c => c.status === 'Ativo').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <i className="fa-solid fa-user-check text-white text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total de Pedidos</p>
              <p className="text-2xl font-bold text-gray-800">
                {clientes.reduce((sum, cliente) => sum + (cliente.totalPedidos ?? 0), 0)}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <i className="fa-solid fa-receipt text-white text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-gray-800">
                R$ {(clientes.reduce((sum, cliente) => sum + (cliente.valorTotal ?? 0), 0)).toFixed(2)}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <i className="fa-solid fa-dollar-sign text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      <div className="text-sm text-gray-500">{cliente.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.telefone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {cliente.endereco}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.totalPedidos ?? 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      R$ {(cliente.valorTotal ?? 0).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cliente.ultimoPedido}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cliente.status)}`}>
                      {cliente.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredClientes.length === 0 && (
        <div className="text-center py-12">
          <i className="fa-solid fa-users text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">
            {searchTerm ? 'Nenhum cliente encontrado para esta busca' : 'Nenhum cliente cadastrado'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Clientes 