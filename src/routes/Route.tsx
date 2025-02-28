import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../pages/LoginScreen";
import Dashboard from "../pages/Dashboard";
import Movimentacoes from "../pages/movements/movements";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/loginpromotor" element={<LoginScreen />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route index element={<Navigate to="movimentacoes" />} />
          <Route path="movimentacoes/*" element={<Movimentacoes />} />
          <Route path="participantes" element={<h1>Participantes</h1>} />
          <Route path="roleta" element={<h1>Roleta</h1>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
