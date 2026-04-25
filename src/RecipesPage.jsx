import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './PagePlaceholder.css';

function RecipesPage() {
  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>
      <Navigation />
      
      <div className="page-placeholder">
        <h2>All Recipes</h2>
        <p>View all recipes from our community</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default RecipesPage;
