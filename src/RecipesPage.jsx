import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navigation from './Navigation';
import './RecipesPage.css';

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recipes:', error);
        return;
      }

      setRecipes(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Regent Recipes</h1>
      <Navigation />
      
      <div className="recipes-page">
        <h2>All Recipes</h2>
        
        {isLoading ? (
          <p className="loading-message">Loading recipes...</p>
        ) : recipes.length > 0 ? (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card-full">
                {recipe.image_url && (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="recipe-card-image"
                  />
                )}
                <div className="recipe-card-content">
                  <h3>{recipe.title}</h3>
                  <span className="cuisine-tag">{recipe.cuisine_type || 'N/A'}</span>
                  <p className="recipe-description">{recipe.description}</p>
                  <button 
                    className="view-recipe-btn"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    View Full Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-recipes">No recipes yet. Visit "ADD YOUR OWN" to add a recipe!</p>
        )}
      </div>
    </div>
  );
}

export default RecipesPage;
