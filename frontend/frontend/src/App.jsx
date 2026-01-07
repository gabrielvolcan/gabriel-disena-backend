import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import PortfolioWeb from './pages/PortfolioWeb';
import WebAIFactory from './pages/WebAIFactory/WebAIFactory'; // ← LÍNEA NUEVA 1
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/portfolio-web" element={<PortfolioWeb />} />
        <Route path="/web-ai-factory" element={<WebAIFactory />} /> {/* ← LÍNEA NUEVA 2 */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
