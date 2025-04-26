// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SalesInsights from './components/SalesInsights';
import ProductRecommendations from './components/ProductRecommendations';
import ProposalGenerator from './components/ProposalGenerator';
import ObjectionHandler from './components/ObjectionHandler';
import Navigation from './components/Navigation';
import Login from './components/Login';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/insights" element={<SalesInsights />} />
            <Route path="/recommendations" element={<ProductRecommendations />} />
            <Route path="/proposals" element={<ProposalGenerator />} />
            <Route path="/objections" element={<ObjectionHandler />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        
        </div>
      </div>
    </Router>
  );
}

export default App;
