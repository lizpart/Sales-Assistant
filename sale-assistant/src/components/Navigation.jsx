// components/Navigation.jsx
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="sidebar">
      <div className="logo">
        <h2>Sales Assistant</h2>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/insights" className={location.pathname === '/insights' ? 'active' : ''}>
            Sales Insights
          </Link>
        </li>
        <li>
          <Link to="/recommendations" className={location.pathname === '/recommendations' ? 'active' : ''}>
            Product Recommendations
          </Link>
        </li>
        <li>
          <Link to="/proposals" className={location.pathname === '/proposals' ? 'active' : ''}>
            Proposal Generator
          </Link>
        </li>
        <li>
          <Link to="/objections" className={location.pathname === '/objections' ? 'active' : ''}>
            Objection Handler
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
