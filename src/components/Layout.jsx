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
    { path: '/clientes', icon: 'fa-users', label: 'Clientes' },
    { path: '/bairros', icon: 'fa-map-marker-alt', label: 'Bairros' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-100 via-white to-indigo-50 shadow-xl rounded-r-3xl flex flex-col justify-between transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 px-7 py-7 border-b border-indigo-100">
            <i className="fa-solid fa-bowl-food text-3xl text-indigo-600 drop-shadow"></i>
            <span className="font-extrabold text-xl text-indigo-700 tracking-wide">Painel Delivery</span>
          </div>
          
          <nav className="mt-8 flex flex-col gap-2 px-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl text-left transition-all duration-200 text-base shadow-sm
                  ${isActive(item.path)
                    ? 'bg-indigo-200/80 text-indigo-900 font-bold shadow-md scale-[1.03]'
                    : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'}
                `}
              >
                <i className={`fa-solid ${item.icon} text-lg`}></i>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="px-7 py-5 border-t border-indigo-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:text-white hover:bg-red-500/90 font-semibold transition-all duration-200 shadow-sm"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            Sair
          </button>
        </div>
      </aside>
      
      {/* Conteúdo */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout 