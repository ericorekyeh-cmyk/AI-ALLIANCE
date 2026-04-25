import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './FeaturedRecipes.css';

function FeaturedRecipes() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);
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

    // If no recipes exist, auto-seed them
    if (!data || data.length === 0) {
      setIsSeeding(true);
      await autoSeedRecipes();
    } else {
      setFeaturedRecipes(data);
    }
  };

  const autoSeedRecipes = async () => {
    const sampleRecipes = [
      {
        title: 'Heirloom Tomato Tart',
        description: 'A delicate buttery crust topped with sun-ripened tomatoes and aromatic garden herbs, evoking the spirit of a rustic summer afternoon.',
        cuisine_type: 'French',
        image_url: 'https://images.unsplash.com/photo-1605450893063-a8b9d9ecc0a0?w=600&h=500&fit=crop',
        recipe_url: 'https://www.example.com/heirloom-tomato-tart'
      },
      {
        title: 'Artisan Sourdough',
        description: 'Master the art of the perfect crust and airy crumb with our signature sourdough guide, featuring locally sourced ancient grains.',
        cuisine_type: 'Bakery',
        image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccf1?w=600&h=500&fit=crop',
        recipe_url: 'https://www.example.com/artisan-sourdough'
      },
      {
        title: 'Wild Berry Pavlova',
        description: 'A cloud-like meringue base paired with seasonal forest berries and silky double cream. An elegant finale to any artisanal meal.',
        cuisine_type: 'Dessert',
        image_url: 'https://images.unsplash.com/photo-1604080853949-b92f50e00b7f?w=600&h=500&fit=crop',
        recipe_url: 'https://www.example.com/wild-berry-pavlova'
      }
    ];

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert(sampleRecipes)
        .select();

      if (error) {
        console.error('Error seeding recipes:', error);
        setIsSeeding(false);
        return;
      }

      console.log('Successfully auto-seeded sample recipes:', data);
      setFeaturedRecipes(data);
      setIsSeeding(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setIsSeeding(false);
    }
  };

  const handleViewRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="featured-section">
      {isSeeding ? (
        <div className="loading-message">Loading featured recipes...</div>
      ) : (
        <div className="featured-grid">
          {featuredRecipes.length > 0 ? (
            featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="featured-card">
                {recipe.image_url && (
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.title} 
                    className="featured-image"
                  />
                )}
                <div className="featured-content">
                  <h3>{recipe.title}</h3>
                  <p className="featured-description">{recipe.description}</p>
                  <button 
                    className="view-recipe-btn"
                    onClick={() => handleViewRecipe(recipe.id)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-featured">No recipes yet. Add one to get started!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FeaturedRecipes;
