import { supabase } from './supabaseClient';

export async function seedSampleRecipes() {
  const sampleRecipes = [
    {
      title: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh mozzarella, basil, and tomato sauce on a crispy crust.',
      cuisine_type: 'Italian',
      image_url: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=400&fit=crop',
      recipe_url: 'https://www.example.com/margherita-pizza'
    },
    {
      title: 'Grilled Salmon',
      description: 'Perfectly grilled salmon fillet with lemon and herbs, served with fresh vegetables.',
      cuisine_type: 'Seafood',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
      recipe_url: 'https://www.example.com/grilled-salmon'
    },
    {
      title: 'Chocolate Cake',
      description: 'Rich and decadent chocolate cake with smooth chocolate frosting and fresh berries on top.',
      cuisine_type: 'Dessert',
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop',
      recipe_url: 'https://www.example.com/chocolate-cake'
    }
  ];

  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert(sampleRecipes)
      .select();

    if (error) {
      console.error('Error seeding recipes:', error);
      alert(`Error adding recipes: ${error.message}`);
      return;
    }

    console.log('Successfully added sample recipes:', data);
    alert('✓ Successfully added 3 sample recipes!');
    
    // Reload the page to show the new recipes
    window.location.reload();
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('Error adding recipes');
  }
}
