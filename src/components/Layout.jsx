import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService.js'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      navigate('/login')
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
    { path: '/pedidos', icon: 'fa-receipt', label: 'Pedidos' },
    { path: '/produtos', icon: 'fa-utensils', label: 'Produtos' },
    { path: '/clientes', icon: 'fa-users', label: 'Clientes' }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-6 py-6 border-b">
            <i className="fa-solid fa-bowl-food text-2xl text-indigo-600"></i>
            <span className="font-bold text-lg text-gray-800">Painel Delivery</span>
          </div>
          
          <nav className="mt-6 flex flex-col gap-1 px-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="px-6 py-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Sair
          </button>
        </div>
      </aside>
      
      {/* Conteúdo */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}

export default Layout 