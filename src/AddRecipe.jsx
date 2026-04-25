import { useState } from 'react';
import { supabase } from './supabaseClient';

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [recipeUrl, setRecipeUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from('recipes')
      .insert([{ 
        title, 
        description, 
        cuisine_type: cuisineType,
        image_url: imageUrl,
        recipe_url: recipeUrl
      }]);

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    alert('Recipe added!');
    setTitle('');
    setDescription('');
    setCuisineType('');
    setImageUrl('');
    setRecipeUrl('');
    onRecipeAdded();
  };

  return (
    <form className="add-recipe-form" onSubmit={handleSubmit}>
      <h3>Add New Recipe</h3>

      <label>
        Title
        <input
          type="text"
          placeholder="Recipe title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </label>

      <label>
        Description
        <textarea
          placeholder="Recipe description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <label>
        Cuisine
        <input
          type="text"
          placeholder="Cuisine type"
          value={cuisineType}
          onChange={(event) => setCuisineType(event.target.value)}
        />
      </label>

      <label>
        Image URL
        <input
          type="url"
          placeholder="https://example.com/meal-image.jpg"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
        />
      </label>

      <label>
        Recipe Link
        <input
          type="url"
          placeholder="https://example.com/recipe"
          value={recipeUrl}
          onChange={(event) => setRecipeUrl(event.target.value)}
        />
      </label>

      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default AddRecipe;
