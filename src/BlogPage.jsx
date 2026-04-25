import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import './PagePlaceholder.css';

function BlogPage() {
  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>
      <Navigation />
      
      <div className="page-placeholder">
        <h2>Blog</h2>
        <p>Read our latest food and cooking articles</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}

export default BlogPage;
