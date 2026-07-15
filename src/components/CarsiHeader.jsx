import { useNavigate } from 'react-router-dom'

function CarsiHeader({ theme, toggleTheme }) {
  const navigate = useNavigate()

  const scrollToSection = (id) => {
    const section = document.getElementById(id)

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    const navbarCollapse = document.getElementById('carsiNavbarNav')

    if (navbarCollapse?.classList.contains('show')) {
      navbarCollapse.classList.remove('show')
    }
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: 'pointer' }}
          onClick={() => scrollToSection('carsi-home')}
        >
          Uzel Kuyumculuk Çarşı
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#carsiNavbarNav"
          aria-controls="carsiNavbarNav"
          aria-expanded="false"
          aria-label="Menüyü aç veya kapat"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="carsiNavbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => scrollToSection('carsi-home')}
              >
                Ana Sayfa
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => scrollToSection('carsi-markets')}
              >
                Canlı Piyasalar
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: 'pointer' }}
                onClick={() => scrollToSection('carsi-contact')}
              >
                İletişim
              </span>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className="btn btn-outline-light-custom ms-lg-2"
                onClick={() => navigate('/')}
              >
                Gebze Center
              </button>
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

export default CarsiHeader