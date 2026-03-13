import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AddRecipe from './AddRecipe';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) console.error('Error:', error);
    else setRecipes(data);
  }

  async function deleteRecipe(id) {
    if (window.confirm("Delete this recipe?")) {
      await supabase.from('recipes').delete().eq('id', id);
      fetchRecipes();
    }
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.cuisine_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>

      {/* CRUD Requirement: Create */}
      <AddRecipe onRecipeAdded={fetchRecipes} />

      {/* UX Requirement: Filtering */}
      <input
        type="text"
        placeholder="Search recipes or cuisines..."
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <span className="cuisine-tag">{recipe.cuisine_type}</span>
              <p>{recipe.description}</p>
              <button className="delete-btn" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
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