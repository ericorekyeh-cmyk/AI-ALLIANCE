import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchRecipe();
    getUser();
  }, [id]);

  useEffect(() => {
    if (recipe && user) {
      setIsOwner(recipe.user_id === user.id);
    }
  }, [recipe, user]);

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

  const fetchRecipe = async () => {
    // 🔥 THE UPGRADE: We now tell Supabase to "Join" the ingredients!
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        *,
        recipe_ingredients (
          amount,
          unit,
          ingredients (
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Fetch recipe error:', error);
      setLoading(false);
      return;
    }

    setRecipe(data);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!isOwner) {
      alert('You can only delete your own recipes');
      return;
    }

    if (!window.confirm('Delete this recipe?')) return;

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Extra security check!

    if (error) {
      console.error('Delete recipe error:', error);
      alert('Error deleting recipe');
      return;
    }

    navigate('/');
  };

  if (loading) return <div className="recipe-detail-container"><p>Loading...</p></div>;

  if (!recipe) {
    return (
      <div className="recipe-detail-container">
        <p>Recipe not found</p>
        <button onClick={() => navigate('/')} className="back-btn">Back to Recipes</button>
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      
      <div className="recipe-detail-card">
        {recipe.image_url && (
          <img src={recipe.image_url} alt={recipe.title} className="recipe-detail-image" />
        )}
        
        <div className="recipe-detail-content">
          <h1>{recipe.title}</h1>
          <span className="cuisine-tag">{recipe.cuisine_type || 'N/A'}</span>
          
          <div className="recipe-detail-description">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </div>

          {/* 🔥 THE UPGRADE: Mapping directly from the database objects */}
          {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
            <div className="recipe-ingredients">
              <h2>Ingredients</h2>
              <ul>
                {recipe.recipe_ingredients.map((item, index) => (
                  <li key={index}>
                    <strong>{item.amount} {item.unit}</strong> - {item.ingredients.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && (
            <div className="recipe-instructions">
              <h2>Instructions</h2>
              <p>{recipe.instructions}</p>
            </div>
          )}

          {isOwner && (
            <button onClick={handleDelete} className="delete-btn">Delete Recipe</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;