import { useState } from "react";
import MenuSuperior from "../components/header";
import Popup from "../components/Popup";
import Movimentacoes from "../pages/movements/Movements";
import Participantes from "../pages/Participants/Participantes";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"movimentacoes" | "participantes">("movimentacoes");

  return (
    <div className="container-fluid">
      <MenuSuperior setActiveSection={setActiveSection} activeSection={activeSection} />
      
      <Popup show={false} message="" />

      <div className="container mt-4">
        {activeSection === "movimentacoes" ? <Movimentacoes /> : <Participantes />}
      </div>
    </div>
  );
};

export default Dashboard;
