import { useState } from 'react'
import { getImageUrl } from '../utils/imageUtils.js'

function ImageWithFallback({ src, alt, className, fallbackSrc = 'https://via.placeholder.com/400x300?text=Sem+Imagem' }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  const handleLoad = () => {
    setHasError(false)
  }

  return (
    <img 
      src={getImageUrl(imgSrc)}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}

export default ImageWithFallback 