import { useEffect, useState, useMemo } from 'react';
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
    // Check ownership when both recipe and user are available
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

    // Try to parse structured content first
    const ingredientsMatch = content.match(/Ingredients?:?\s*([\s\S]*?)(?:Method|Instructions|Directions|Steps|$)/i);
    const instructionsMatch = content.match(/(?:Method|Instructions|Directions|Steps):?\s*([\s\S]*?)$/i);

    let ingredients = [];
    let instructions = '';

    if (ingredientsMatch) {
      const ingredientText = ingredientsMatch[1].trim();
      // Split by newlines and filter empty lines and lines that don't start with ingredient markers
      ingredients = ingredientText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 0 && !line.match(/^(Method|Instructions|Directions|Steps):/i))
        .slice(0, 50); // Limit to 50 ingredients
    }

    if (instructionsMatch) {
      instructions = instructionsMatch[1].trim();
    }

    console.log('Raw recipe content:', content);
    console.log('Parsed ingredients count:', ingredients.length);
    console.log('Has instructions:', !!instructions);

    return { ingredients, instructions };
  };

  const parsedContent = useMemo(() => {
    return recipe?.recipe_content ? parseRecipeContent(recipe.recipe_content) : { ingredients: [], instructions: '' };
  }, [recipe?.recipe_content]);

  const handleDelete = async () => {
    if (!isOwner) {
      alert('You can only delete your own recipes');
      return;
    }

    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

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

          {recipe.recipe_content ? (
            <>
              {parsedContent.ingredients && parsedContent.ingredients.length > 0 && (
                <div className="recipe-ingredients">
                  <h2>Ingredients</h2>
                  <ul>
                    {parsedContent.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {parsedContent.instructions && (
                <div className="recipe-instructions">
                  <h2>Instructions</h2>
                  <p>{parsedContent.instructions}</p>
                </div>
              )}

              {(!parsedContent.ingredients || parsedContent.ingredients.length === 0) && !parsedContent.instructions && (
                <div className="recipe-instructions">
                  <h2>Full Recipe</h2>
                  <p>{recipe.recipe_content}</p>
                </div>
              )}
            </>
          ) : (
            <p>No recipe details available</p>
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
