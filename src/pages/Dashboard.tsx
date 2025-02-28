import { Outlet } from "react-router-dom";
import MenuSuperior from "../components/header";
import { useMovimentacoesApi } from "../hooks/useMovementsApi";
import Popup from "../components/Popup";

const Dashboard: React.FC = () => {
  const { showPopup, popupMessage } = useMovimentacoesApi(null); // Pegando mensagens da API

  return (
    <div className="container-fluid">
      <MenuSuperior />
      <Popup show={showPopup} message={popupMessage} /> {/* Exibir mensagens da API */}

      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
