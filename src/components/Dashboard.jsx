import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { dashboardService } from '../services/dashboardService.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    cards: [],
    vendasChart: null,
    topProdutos: [],
    pedidosRecentes: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      // Buscar dados do dashboard
      const [stats, vendasChart] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getVendasChart()
      ])

      // Converter estatísticas para o formato dos cards
      const estatisticas = stats.data?.estatisticas || stats.estatisticas || {}
      const cards = [
        { 
          title: 'Pedidos Hoje', 
          value: estatisticas.pedidosHoje || 0, 
          icon: 'fa-receipt', 
          color: 'bg-blue-500' 
        },
        { 
          title: 'Receita Hoje', 
          value: `R$ ${(estatisticas.totalVendasHoje || 0).toFixed(2).replace('.', ',')}`, 
          icon: 'fa-dollar-sign', 
          color: 'bg-green-500' 
        },
        { 
          title: 'Ticket Médio', 
          value: `R$ ${(estatisticas.ticketMedio || 0).toFixed(2).replace('.', ',')}`, 
          icon: 'fa-chart-line', 
          color: 'bg-purple-500' 
        },
        { 
          title: 'Total Clientes', 
          value: estatisticas.totalClientes || 0, 
          icon: 'fa-users', 
          color: 'bg-orange-500' 
        }
      ]

      // Converter dados do gráfico de vendas
      const vendasData = vendasChart.data?.dados || vendasChart.dados || []
      const chartData = {
        labels: vendasData.map(item => item.data),
        datasets: [{
          label: 'Vendas (R$)',
          data: vendasData.map(item => item.vendas),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      }

      setDashboardData({
        cards: cards,
        vendasChart: chartData,
        topProdutos: stats.data?.topProdutos || [],
        pedidosRecentes: stats.data?.pedidosRecentes || []
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-chart-line text-indigo-600"></i>
          Dashboard
        </h2>
        <p className="text-gray-500">Resumo geral do restaurante</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {dashboardData.cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{typeof card.value === 'object' ? JSON.stringify(card.value) : card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <i className={`fa-solid ${card.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de vendas */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <i className="fa-solid fa-chart-pie text-indigo-500"></i>
          Vendas dos últimos 7 dias
        </h3>
        <div className="h-80">
          <Line 
            data={dashboardData.vendasChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return 'R$ ' + value
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Grid inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Produtos */}
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
            <i className="fa-solid fa-star text-yellow-500"></i>
            Top Produtos
          </h4>
          <ul className="divide-y">
            {dashboardData.topProdutos.map((produto, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{typeof produto.nome === 'object' ? JSON.stringify(produto.nome) : produto.nome}</p>
                  <p className="text-sm text-gray-500">{typeof produto.quantidade === 'object' ? JSON.stringify(produto.quantidade) : produto.quantidade} vendas</p>
                </div>
                <span className="font-semibold text-green-600">{typeof produto.valor === 'object' ? JSON.stringify(produto.valor) : produto.valor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pedidos Recentes */}
        <div className="bg-white rounded-xl shadow p-6">
          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
            <i className="fa-solid fa-clock-rotate-left text-indigo-400"></i>
            Pedidos Recentes
          </h4>
          <ul className="divide-y">
            {dashboardData.pedidosRecentes.map((pedido, index) => {
              // Extrai nome do cliente corretamente
              let nomeCliente = pedido.cliente;
              if (typeof nomeCliente === 'object' && nomeCliente !== null) {
                nomeCliente = nomeCliente.nome || Object.values(nomeCliente)[0] || 'Cliente';
              }
              if (typeof nomeCliente !== 'string') nomeCliente = String(nomeCliente);
              return (
                <li key={index} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-indigo-700 text-base">#{pedido.id}</span>
                    <span className="text-gray-800 font-medium text-sm">{nomeCliente}</span>
                    {pedido.total && (
                      <span className="text-xs text-gray-500">Total: R$ {Number(pedido.total).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1
                      ${pedido.status?.toLowerCase() === 'entregue' ? 'bg-green-100 text-green-800' :
                        pedido.status?.toLowerCase() === 'pronto' ? 'bg-blue-100 text-blue-800' :
                        pedido.status?.toLowerCase() === 'em preparo' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}
                    `}>
                      {pedido.status?.toLowerCase() === 'entregue' && <i className="fa-solid fa-check-circle"></i>}
                      {pedido.status?.toLowerCase() === 'pronto' && <i className="fa-solid fa-bell"></i>}
                      {pedido.status?.toLowerCase() === 'em preparo' && <i className="fa-solid fa-utensils"></i>}
                      {pedido.status?.toLowerCase() === 'pendente' && <i className="fa-solid fa-clock"></i>}
                      {pedido.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 