import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Header({ theme, toggleTheme }) {
  const location = useLocation()
  const navigate = useNavigate()

  const closeMobileMenu = () => {
    const navbarCollapse = document.getElementById('navbarNav')

    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show')
    }
  }

  useEffect(() => {
    if (location.hash === '#contact') {
      setTimeout(() => {
        const footer = document.getElementById('contact')
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [location])

  const scrollToSection = (id) => {
    closeMobileMenu()

    if (id === 'contact') {
      window.location.href = '/#contact'
      return
    }

    const doScroll = () => {
      const section = document.getElementById(id)

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }

    if (location.pathname !== '/') {
      navigate('/')

      setTimeout(() => {
        doScroll()
      }, 400)

      return
    }

    doScroll()
  }

  const goHome = () => {
    closeMobileMenu()

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
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Menüyü aç/kapat"
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
                onClick={() => {
                  closeMobileMenu()
                  toggleTheme()
                }}
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