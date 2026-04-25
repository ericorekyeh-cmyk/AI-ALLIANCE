import { useState } from 'react';
import { supabase } from './supabaseClient';

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error } = await supabase
      .from('recipes')
      .insert([{ title, description, cuisine_type: cuisineType }]);

    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }

    alert('Recipe added!');
    setTitle('');
    setDescription('');
    setCuisineType('');
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

      <button type="submit">Add Recipe</button>
    </form>
  );
}

export default AddRecipe;
