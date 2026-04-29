import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import AddRecipe from './AddRecipe';
import AddRecipePage from './AddRecipePage';
import FeaturedRecipes from './FeaturedRecipes';
import RecipeDetail from './RecipeDetail';
import Navigation from './Navigation';
import RecipesPage from './RecipesPage';
import BlogPage from './BlogPage';
import Login from './Login';
import SignUp from './SignUp';
import BlogDetail from './BlogDetail';
import './App.css';
import CreatePost from './CreatePost';


function AppContent({ user, onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    if (!user) {
      alert('You must be logged in to delete recipes');
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
      alert('Error: You can only delete your own recipes');
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
    <>
      <div className="container">
        <h1>Online Recipe Sharing Platform</h1>
        <Navigation user={user} onLogout={onLogout} />

        <FeaturedRecipes />

        <div className="additional-content">
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
                  {recipe.image_url && (
                    <img src={recipe.image_url} alt={recipe.title} className="recipe-image" />
                  )}
                  <h3>{recipe.title}</h3>
                  <span className="cuisine-tag">{recipe.cuisine_type || 'N/A'}</span>
                  <p>{recipe.description}</p>
                  <div className="recipe-actions">
                    <button
                      className="view-recipe-btn"
                      type="button"
                      onClick={() => navigate(`/recipe/${recipe.id}`)}
                    >
                      View Recipe
                    </button>
                    {user && user.id === recipe.user_id && (
                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No recipes found matching your search.</p>
            )}
          </div>
        </div>
      </div>
      </>
    );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      setUser(null);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<AppContent user={user} onLogout={handleLogout} />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        
        {/* Auth & User Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-recipe" element={user ? <AddRecipePage onRecipeAdded={() => {}} /> : <Login />} />
        
        {/* Blog Pages (Order is critical here!) */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/new" element={<CreatePost />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
