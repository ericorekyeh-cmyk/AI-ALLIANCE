import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './FeaturedRecipes.css';

function FeaturedRecipes() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const fetchFeaturedRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .limit(3);

    if (error) {
      console.error('Fetch featured recipes error:', error);
      return;
    }

    setFeaturedRecipes(data ?? []);
  };

  const handleImageClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="featured-section">
      <h2>Featured Recipes</h2>
      <div className="featured-grid">
        {featuredRecipes.length > 0 ? (
          featuredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="featured-card"
              onClick={() => handleImageClick(recipe.id)}
            >
              {recipe.image_url && (
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  className="featured-image"
                />
              )}
              <div className="featured-overlay">
                <h3>{recipe.title}</h3>
                <p className="featured-cuisine">{recipe.cuisine_type || 'N/A'}</p>
                <p className="featured-description">{recipe.description}</p>
                <p className="click-hint">View Recipe →</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-featured">No recipes yet. Add one to get started!</p>
        )}
      </div>
    </div>
  );
}

export default FeaturedRecipes;
