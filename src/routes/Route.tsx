import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../pages/LoginScreen";
import Dashboard from "../pages/Dashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/loginpromotor" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard controla a exibição interna */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
