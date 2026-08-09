import { useEffect, useRef, useState } from 'react'

const VIEWPORT_RATIO = 4 / 5

export function ParallaxImage({ image, className = '' }: { image: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState<number | null>(null)

  useEffect(() => {
    const img = new Image()
    img.onload = () => { if (img.naturalWidth && img.naturalHeight) setRatio(img.naturalWidth / img.naturalHeight) }
    img.src = image
  }, [image])

  const fit = ratio !== null && ratio > VIEWPORT_RATIO ? 'contain' : 'cover'

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '4 / 5' }}>
      <div className={`absolute inset-0 bg-center ${fit === 'contain' ? 'bg-contain bg-no-repeat' : 'bg-cover'}`} style={{ backgroundImage: `url('${image}')` }} />
    </div>
  )
}
