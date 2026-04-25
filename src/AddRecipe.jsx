import { useState } from 'react';
import { supabase } from './supabaseClient';

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [recipeUrl, setRecipeUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      let imageUrl = '';

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

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
        setIsUploading(false);
        return;
      }

      alert('Recipe added successfully!');
      setTitle('');
      setDescription('');
      setCuisineType('');
      setImageFile(null);
      setRecipeUrl('');
      setIsUploading(false);
      onRecipeAdded();
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsUploading(false);
    }
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
        Recipe Image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imageFile && <p className="file-selected">✓ {imageFile.name} selected</p>}
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

      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Add Recipe'}
      </button>
    </form>
  );
}

export default AddRecipe;
