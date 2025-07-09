// Utilitário para lidar com URLs de imagem
import { API_CONFIG } from '../config/api.js'

/**
 * Constrói a URL completa da imagem
 * @param {string} imagePath - Caminho relativo da imagem
 * @returns {string} URL completa da imagem
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=Sem+Imagem'
  }

  // Se já é uma URL completa, retorna como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Se começa com /, adiciona a base URL
  if (imagePath.startsWith('/')) {
    return `${API_CONFIG.BASE_URL_IMAGES}${imagePath}`
  }

  // Caso contrário, assume que é um caminho relativo
  return `${API_CONFIG.BASE_URL_IMAGES}/${imagePath}`
}

/**
 * Verifica se uma imagem existe
 * @param {string} imagePath - Caminho da imagem
 * @returns {Promise<boolean>}
 */
export const checkImageExists = async (imagePath) => {
  if (!imagePath) return false

  try {
    const response = await fetch(getImageUrl(imagePath), { method: 'HEAD' })
    return response.ok
  } catch (error) {
    return false
  }
} 