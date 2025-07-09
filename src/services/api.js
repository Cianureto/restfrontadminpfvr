import { API_CONFIG } from '../config/api.js'

// Configuração base do fetch
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken')
  
  const config = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  // Remover Content-Type se for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type']
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Sessão expirada')
      }
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Verificar se a resposta tem a estrutura esperada
    if (data && typeof data === 'object') {
      return data
    }
    
    // Se não tiver a estrutura esperada, retornar como está
    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Timeout na requisição')
    }
    console.error('Erro na requisição:', error)
    throw error
  }
}

export default apiRequest 