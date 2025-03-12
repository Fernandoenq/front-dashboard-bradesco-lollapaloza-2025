import { useState } from "react";
import MenuSuperior from "../components/header";
import Popup from "../components/Popup";
import Movimentacoes from "./movements/MovementsScreen";
import Participantes from "./participants/ParticipantsScreen";
import Roleta from "./roulette/RouletteScreen";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"movimentacoes" | "participantes" | "roleta">("movimentacoes");

  return (
    <div className="container-fluid">
      <MenuSuperior setActiveSection={setActiveSection} activeSection={activeSection} />
      
      <Popup show={false} message="" />

      <div className="container mt-4">
        {activeSection === "movimentacoes" && <Movimentacoes />}
        {activeSection === "participantes" && <Participantes />}
        {activeSection === "roleta" && <Roleta />}
      </div>
    </div>
  );
};

export default Dashboard;
