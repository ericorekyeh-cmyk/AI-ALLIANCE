import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import AddRecipe from './AddRecipe';
import './AddRecipePage.css';

function AddRecipePage({ onRecipeAdded }) {
  const navigate = useNavigate();

  const handleRecipeAdded = () => {
    onRecipeAdded();
    // Show success message
    alert('Recipe added successfully! Redirecting to home page...');
    // Redirect to home after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>
      <Navigation />
      
      <div className="add-recipe-page">
        <div className="add-recipe-header">
          <h2>Share Your Recipe</h2>
          <p>Add your own delicious recipe to our community collection</p>
        </div>

        <AddRecipe onRecipeAdded={handleRecipeAdded} />

        <button onClick={() => navigate('/')} className="back-to-home">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default AddRecipePage;
