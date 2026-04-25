import { supabase } from './supabaseClient';

export async function seedSampleRecipes() {
  const sampleRecipes = [
    {
      title: 'Heirloom Tomato Tart',
      description: 'A delicate buttery crust topped with sun-ripened tomatoes and aromatic garden herbs, evoking the spirit of a rustic summer afternoon.',
      cuisine_type: 'French',
      image_url: 'https://images.unsplash.com/photo-1605450893063-a8b9d9ecc0a0?w=600&h=500&fit=crop',
      recipe_url: 'https://www.example.com/heirloom-tomato-tart'
    },
    {
      title: 'Artisan Sourdough',
      description: 'Master the art of the perfect crust and airy crumb with our signature sourdough guide, featuring locally sourced ancient grains.',
      cuisine_type: 'Bakery',
      image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccf1?w=600&h=500&fit=crop',
      recipe_url: 'https://www.example.com/artisan-sourdough'
    },
    {
      title: 'Wild Berry Pavlova',
      description: 'A cloud-like meringue base paired with seasonal forest berries and silky double cream. An elegant finale to any artisanal meal.',
      cuisine_type: 'Dessert',
      image_url: 'https://images.unsplash.com/photo-1604080853949-b92f50e00b7f?w=600&h=500&fit=crop',
      recipe_url: 'https://www.example.com/wild-berry-pavlova'
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
