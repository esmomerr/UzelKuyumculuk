import { useEffect, useState } from 'react'

function InstallGuide() {
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isStandalone =
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches

    const dismissed = localStorage.getItem('installGuideDismissed')

    if (isIOS && !isStandalone && dismissed !== 'true') {
      setShowGuide(true)
    }
  }, [])

  if (!showGuide) return null

  return (
    <div className="install-guide">
      <div>
        <strong>Uygulama gibi kullan</strong>
        <p>
          iPhone’da Paylaş butonuna basıp “Ana Ekrana Ekle” seçeneğini seç.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          localStorage.setItem('installGuideDismissed', 'true')
          setShowGuide(false)
        }}
      >
        Tamam
      </button>
    </div>
  )
}

export default InstallGuide