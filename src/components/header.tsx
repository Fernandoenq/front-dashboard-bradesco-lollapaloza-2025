import "bootstrap/dist/css/bootstrap.min.css";

interface MenuSuperiorProps {
  setActiveSection: (section: "movimentacoes" | "participantes" | "roleta") => void;
  activeSection: "movimentacoes" | "participantes" | "roleta";
}

const MenuSuperior: React.FC<MenuSuperiorProps> = ({ setActiveSection, activeSection }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container-fluid">
        <button 
          className="navbar-brand btn btn-link text-white fw-bold" 
          onClick={() => setActiveSection("movimentacoes")} 
          style={{ textDecoration: "none", border: "none", background: "none" }}
        >
          Bradesco
        </button>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className={`nav-link text-white ${activeSection === "movimentacoes" ? "fw-bold" : ""}`} 
                onClick={() => setActiveSection("movimentacoes")}
              >
                Movimentações
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link text-white ${activeSection === "participantes" ? "fw-bold" : ""}`} 
                onClick={() => setActiveSection("participantes")}
              >
                Participantes
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link text-white ${activeSection === "roleta" ? "fw-bold" : ""}`} 
                onClick={() => setActiveSection("roleta")}
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

export default MenuSuperior;
