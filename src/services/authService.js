import apiRequest from './api.js'

export const authService = {
  // Login
  async login(credentials) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  // Logout
  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },

  // Verificar token
  async verifyToken() {
    return await apiRequest('/auth/verify')
  },

  // Registrar novo admin
  async register(adminData) {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(adminData)
    })
  },

  // Alterar senha
  async changePassword(passwordData) {
    return await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    })
  }
} 