import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesHome from './pages/ServicesHome';
import LogosServices from './pages/LogosServices';
import WebServices from './pages/WebServices';
import PortfolioWeb from './pages/Portfolioweb';
import WebAIFactory from './pages/WebAIFactory/WebAIFactory';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesHome />} />
        <Route path="/services/logos" element={<LogosServices />} />
        <Route path="/services/web" element={<WebServices />} />
        <Route path="/portfolio-web" element={<PortfolioWeb />} />
        <Route path="/web-ai-factory" element={<WebAIFactory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
