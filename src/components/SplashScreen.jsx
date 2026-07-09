import { useEffect, useState } from 'react'

function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (!showSplash) return null

  return (
    <div className="splash-screen">
      <div className="splash-logo">UZEL</div>
      <div className="splash-subtitle">KUYUMCULUK</div>
      <p>Canlı Altın Fiyatları</p>
    </div>
  )
}

export default SplashScreen