import { useLocation, useNavigate } from 'react-router-dom'

function Header({ theme, toggleTheme }) {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const section = document.getElementById(id)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
      return
    }

    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/')
      return
    }
    scrollToSection('home')
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: 'pointer' }}
          onClick={goHome}
        >
          Uzel Kuyumculuk
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => scrollToSection('home')}
                style={{ cursor: 'pointer' }}
              >
                Anasayfa
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => scrollToSection('markets')}
                style={{ cursor: 'pointer' }}
              >
                Canlı Piyasalar
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => scrollToSection('contact')}
                style={{ cursor: 'pointer' }}
              >
                İletişim
              </span>
            </li>

            <li className="nav-item">
              <button
                className="theme-toggle-btn ms-lg-2"
                onClick={toggleTheme}
                type="button"
                aria-label="Tema değiştir"
                title="Tema değiştir"
              >
                <span className="theme-toggle-icon">
                  {theme === 'dark' ? '☀' : '☾'}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header