import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateMarketSetting } from '../../lib/marketSettings'
import { signOutAdmin } from '../../lib/auth'
import { createMarketLog, getMarketLogs } from '../../lib/marketLogs'
import { supabase } from '../../lib/supabase'

function AdminPanel({
  adminSettings,
  setAdminSettings,
  setIsAdminAuthenticated,
}) {
  const navigate = useNavigate()
  const [savingKey, setSavingKey] = useState('')
  const [message, setMessage] = useState('')
  const [draftSettings, setDraftSettings] = useState(adminSettings)
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setDraftSettings(adminSettings)
  }, [adminSettings])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getMarketLogs()
        setLogs(data)
      } catch (error) {
        console.error('Loglar alınamadı:', error)
      }
    }

    fetchLogs()
  }, [])

  const products = [
    { key: 'gramAltin', title: '24 Ayar Gram', showSell: true },
    { key: 'ayar22', title: '22 Ayar Gram', showSell: true },
    { key: 'yeniCeyrek', title: 'Yeni Çeyrek', showSell: true },
    { key: 'eskiCeyrek', title: 'Eski Çeyrek', showSell: true },
    { key: 'yeniYarim', title: 'Yeni Yarım', showSell: true },
    { key: 'eskiYarim', title: 'Eski Yarım', showSell: true },
    { key: 'yeniTam', title: 'Yeni Tam', showSell: true },
    { key: 'eskiTam', title: 'Eski Tam', showSell: true },
    { key: 'ataAltin', title: 'Ata Altın', showSell: true },
    { key: 'hurda8', title: '8 Ayar Hurda', showSell: false },
    { key: 'hurda14', title: '14 Ayar Hurda', showSell: false },
    { key: 'hurda18', title: '18 Ayar Hurda', showSell: false },
    { key: 'hurda22', title: '22 Ayar Hurda', showSell: false },
  ]

  const handleChange = (product, field, value) => {
    setDraftSettings((prev) => ({
      ...prev,
      [product]: {
        ...prev[product],
        [field]: Number(value),
      },
    }))
  }

  const handleStepChange = (product, field, amount) => {
    setDraftSettings((prev) => {
      const currentValue = Number(prev[product]?.[field] ?? 0)

      return {
        ...prev,
        [product]: {
          ...prev[product],
          [field]: currentValue + amount,
        },
      }
    })
  }

  const handleSave = async (productKey) => {
    try {
      setSavingKey(productKey)
      setMessage('')

      const product = products.find((p) => p.key === productKey)
      const oldBuyOffset = Number(adminSettings[productKey]?.buyOffset ?? 0)
      const oldSellOffset = Number(adminSettings[productKey]?.sellOffset ?? 0)
      const newBuyOffset = Number(draftSettings[productKey]?.buyOffset ?? 0)
      const newSellOffset = Number(draftSettings[productKey]?.sellOffset ?? 0)

      await updateMarketSetting(productKey, newBuyOffset, newSellOffset)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      await createMarketLog({
        productKey,
        productTitle: product?.title || productKey,
        oldBuyOffset,
        oldSellOffset,
        newBuyOffset,
        newSellOffset,
        adminEmail: user?.email || '',
      })

      setAdminSettings((prev) => ({
        ...prev,
        [productKey]: {
          buyOffset: newBuyOffset,
          sellOffset: newSellOffset,
        },
      }))

      const updatedLogs = await getMarketLogs()
      setLogs(updatedLogs)

      setMessage(`${product?.title} kaydedildi`)
    } catch (error) {
      console.error('Kayıt hatası:', error)
      setMessage('Kayıt sırasında hata oluştu')
    } finally {
      setSavingKey('')
    }
  }

  const handleLogout = async () => {
    try {
      await signOutAdmin()
      setIsAdminAuthenticated(false)
    } catch (error) {
      console.error('Çıkış hatası:', error)
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-top">
        <div>
          <h3>Admin Panel</h3>
          <p>Buradan ürün alış ve satış farklarını yönetiyorsun.</p>
          {message && <span className="admin-message">{message}</span>}
        </div>

        <div className="admin-panel-actions">
          <button className="admin-home-btn" onClick={handleGoHome}>
            Anasayfaya Dön
          </button>

          <button className="admin-logout-btn" onClick={handleLogout}>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="admin-grid">
        {products.map((product) => (
          <div className="admin-card" key={product.key}>
            <h4>{product.title}</h4>

            <label>Alış Farkı</label>
            <input
              type="number"
              value={draftSettings[product.key]?.buyOffset ?? 0}
              onChange={(e) =>
                handleChange(product.key, 'buyOffset', e.target.value)
              }
            />

            <div className="admin-step-grid">
              <button
                type="button"
                className="admin-step-btn"
                onClick={() => handleStepChange(product.key, 'buyOffset', -10)}
              >
                -10
              </button>
              <button
                type="button"
                className="admin-step-btn"
                onClick={() => handleStepChange(product.key, 'buyOffset', -50)}
              >
                -50
              </button>
              <button
                type="button"
                className="admin-step-btn"
                onClick={() => handleStepChange(product.key, 'buyOffset', 10)}
              >
                +10
              </button>
              <button
                type="button"
                className="admin-step-btn"
                onClick={() => handleStepChange(product.key, 'buyOffset', 50)}
              >
                +50
              </button>
            </div>

            {product.showSell && (
              <>
                <label>Satış Farkı</label>
                <input
                  type="number"
                  value={draftSettings[product.key]?.sellOffset ?? 0}
                  onChange={(e) =>
                    handleChange(product.key, 'sellOffset', e.target.value)
                  }
                />

                <div className="admin-step-grid">
                  <button
                    type="button"
                    className="admin-step-btn"
                    onClick={() => handleStepChange(product.key, 'sellOffset', -10)}
                  >
                    -10
                  </button>
                  <button
                    type="button"
                    className="admin-step-btn"
                    onClick={() => handleStepChange(product.key, 'sellOffset', -50)}
                  >
                    -50
                  </button>
                  <button
                    type="button"
                    className="admin-step-btn"
                    onClick={() => handleStepChange(product.key, 'sellOffset', 10)}
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    className="admin-step-btn"
                    onClick={() => handleStepChange(product.key, 'sellOffset', 50)}
                  >
                    +50
                  </button>
                </div>
              </>
            )}

            <div className="admin-card-actions">
              <button
                className="admin-save-btn"
                onClick={() => handleSave(product.key)}
                disabled={savingKey === product.key}
                type="button"
              >
                {savingKey === product.key ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-log-panel">
        <h3>Son Değişiklikler</h3>

        <div className="admin-log-list">
          {logs.length === 0 ? (
            <p className="admin-log-empty">Henüz log yok.</p>
          ) : (
            logs.map((log) => (
              <div className="admin-log-item" key={log.id}>
                <div className="admin-log-head">
                  <strong>{log.product_title}</strong>
                  <span>{new Date(log.created_at).toLocaleString('tr-TR')}</span>
                </div>

                <div className="admin-log-body">
                  <p>
                    Alış: {log.old_buy_offset} → {log.new_buy_offset}
                  </p>
                  <p>
                    Satış: {log.old_sell_offset} → {log.new_sell_offset}
                  </p>
                  <p>Admin: {log.admin_email || 'Bilinmiyor'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel