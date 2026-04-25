import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import AddRecipe from './AddRecipe';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) {
      console.error('Fetch recipes error:', error);
      return;
    }

    setRecipes(data ?? []);
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm('Delete this recipe?')) {
      return;
    }

    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.error('Delete recipe error:', error);
      return;
    }

    fetchRecipes();
  };

  const filteredRecipes = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return recipes.filter((recipe) => {
      const title = recipe.title?.toLowerCase() ?? '';
      const cuisine = recipe.cuisine_type?.toLowerCase() ?? '';
      return title.includes(normalizedSearch) || cuisine.includes(normalizedSearch);
    });
  }, [recipes, searchTerm]);

  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>

      <AddRecipe onRecipeAdded={fetchRecipes} />

      <input
        type="text"
        placeholder="Search recipes or cuisines..."
        className="search-bar"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        aria-label="Search recipes"
      />

      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <span className="cuisine-tag">{recipe.cuisine_type || 'N/A'}</span>
              <p>{recipe.description}</p>
              <button
                className="delete-btn"
                type="button"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No recipes found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default App;
