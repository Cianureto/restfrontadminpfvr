import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Pedidos from './components/Pedidos'
import Produtos from './components/Produtos'
import Clientes from './components/Clientes'
import Bairros from './components/Bairros'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Layout><Dashboard /></Layout> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/pedidos" 
          element={
            isAuthenticated ? 
            <Layout><Pedidos /></Layout> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/produtos" 
          element={
            isAuthenticated ? 
            <Layout><Produtos /></Layout> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/clientes" 
          element={
            isAuthenticated ? 
            <Layout><Clientes /></Layout> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/bairros" 
          element={
            isAuthenticated ? 
            <Layout><Bairros /></Layout> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
