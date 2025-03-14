import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/header.css";
import { useState } from "react";

interface MenuSuperiorProps {
  setActiveSection: (section: "movimentacoes" | "participantes" | "roleta") => void;
  activeSection: "movimentacoes" | "participantes" | "roleta";
}

const Header: React.FC<MenuSuperiorProps> = ({ setActiveSection, activeSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger header-container">
      <div className="container-fluid">
        {/* Logo/Nome do Banco */}
        <button 
          className="navbar-brand btn btn-link text-white fw-bold header-logo" 
          onClick={() => setActiveSection("movimentacoes")} 
        >
          Bradesco
        </button>

        {/* Botão Hamburguer (para telas menores) */}
        <button 
          className="navbar-toggler" 
          type="button" 
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Itens do menu */}
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav header-menu">
            <li className="nav-item">
              <button 
                className={`nav-link header-button ${activeSection === "movimentacoes" ? "active" : ""}`} 
                onClick={() => {
                  setActiveSection("movimentacoes");
                  setMenuOpen(false);
                }}
              >
                Movimentações
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link header-button ${activeSection === "participantes" ? "active" : ""}`} 
                onClick={() => {
                  setActiveSection("participantes");
                  setMenuOpen(false);
                }}
              >
                Participantes
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link header-button ${activeSection === "roleta" ? "active" : ""}`} 
                onClick={() => {
                  setActiveSection("roleta");
                  setMenuOpen(false);
                }}
              >
                Roleta
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
