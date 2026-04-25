import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            HOME
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/recipes" 
            className={`nav-link ${location.pathname === '/recipes' ? 'active' : ''}`}
          >
            RECIPES
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/blog" 
            className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
          >
            BLOG
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
