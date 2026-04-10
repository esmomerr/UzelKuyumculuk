function Header({ theme, toggleTheme }) {
  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        <span
          className="navbar-brand fw-bold"
          style={{ cursor: 'pointer' }}
          onClick={() => scrollToSection('home')}
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
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header