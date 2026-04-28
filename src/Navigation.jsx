import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, onLogout }) {
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
        <li className="nav-item">
          <Link 
            to="/add-recipe" 
            className={`nav-link ${location.pathname === '/add-recipe' ? 'active' : ''}`}
          >
            ADD YOUR OWN
          </Link>
        </li>
        <li className="nav-item auth-item">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                LOGIN
              </Link>
              <Link 
                to="/signup" 
                className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
              >
                SIGN UP
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
