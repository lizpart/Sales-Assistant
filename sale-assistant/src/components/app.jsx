// File: App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
import SalesInsights from './components/SalesInsights';
import ProductRecommendations from './components/ProductRecommendations';
import ProposalGenerator from './components/ProposalGenerator';
import ObjectionHandler from './components/ObjectionHandler';
import Navigation from './components/Navigation';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (success) => {
    setIsLoggedIn(success);
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            <Navigation />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/insights" element={<SalesInsights />} />
                <Route path="/recommendations" element={<ProductRecommendations />} />
                <Route path="/proposals" element={<ProposalGenerator />} />
                <Route path="/objections" element={<ObjectionHandler />} />
              </Routes>
            </div>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App;
