import { useState } from 'react'
import { signInAdmin } from '../../lib/auth'

function AdminLogin({ setIsAdminAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await signInAdmin(email, password)
      setIsAdminAuthenticated(true)
    } catch (err) {
      console.error('Giriş hatası:', err)
      setError('Mail veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-box" onSubmit={handleLogin}>
        <h2>Admin Giriş</h2>
        <p>Devam etmek için giriş yap.</p>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <span className="admin-login-error">{error}</span>}

        <button type="submit" disabled={loading}>
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin