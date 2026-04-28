import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
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

  const parseRecipeContent = (content) => {
    if (!content) return { ingredients: [], instructions: '' };

    const ingredientsMatch = content.match(/Ingredients?:([\s\S]*?)(?:Method|Instructions|$)/i);
    const instructionsMatch = content.match(/(?:Method|Instructions):([\s\S]*?)$/i);

    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim().split('\n').filter(line => line.trim()) : [];
    const instructions = instructionsMatch ? instructionsMatch[1].trim() : '';

    return { ingredients, instructions };
  };

  const parsedContent = useMemo(() => {
    return recipe?.recipe_content ? parseRecipeContent(recipe.recipe_content) : { ingredients: [], instructions: '' };
  }, [recipe?.recipe_content]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.error('Delete recipe error:', error);
      alert('Error deleting recipe');
      return;
    }

    navigate('/');
  };

  if (loading) {
    return <div className="recipe-detail-container"><p>Loading...</p></div>;
  }

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

          {recipe.recipe_content && (
            <>
              <div className="recipe-ingredients">
                <h2>Ingredients</h2>
                <ul>
                  {parsedContent.ingredients.length > 0 ? (
                    parsedContent.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))
                  ) : (
                    <li>No ingredients listed</li>
                  )}
                </ul>
              </div>

              {parsedContent.instructions && (
                <div className="recipe-instructions">
                  <h2>Instructions</h2>
                  <p>{parsedContent.instructions}</p>
                </div>
              )}
            </>
          )}

          <button onClick={handleDelete} className="delete-btn">Delete Recipe</button>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
