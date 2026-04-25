import { supabase } from './supabaseClient';

export async function seedSampleRecipes() {
  const sampleRecipes = [
    {
      title: 'Confit leek and sausage \'pappardelle\'',
      description: 'This indulgent sausage and leek pasta uses a nifty little trick to turn lasagne sheets into homemade pappardelle.',
      cuisine_type: 'Italian',
      image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=500&fit=crop',
      recipe_content: 'Ingredients:\n- 150g/5½oz unsalted butter\n- 2 small leeks, chopped into 1/2cm/¼in slices, thoroughly washed\n- 2–3 good quality pork sausages, skin removed\n- 1 tsp fennel seeds\n- 5 dried lasagne sheets per person\n- ½ tsp chilli flakes\n- Salt and freshly ground black pepper\n- Fresh tarragon, to garnish (optional)\n- Parmesan, to garnish (optional)\n\nMethod:\n1. Add the butter to a small saucepan on a low heat, until melted. Dry off the leeks and add into a saucepan with the melted butter.\n2. Cook gently for 20 minutes until the leeks are soft, turning halfway. Remove from the heat and set aside.\n3. Put a large pan of water on to boil.\n4. In a bowl, mix together the fennel seeds, sausage meat and a big pinch of salt and freshly ground black pepper.\n5. Place a frying pan over a high heat and add in a spoonful of the butter from cooking the leeks. Crumble in the sausage meat and fry until golden brown.\n6. Meanwhile, add a large pinch of salt and the lasagne to the pot of boiling water. Cook for 8–9 minutes until almost cooked, then drain, reserving a ladleful of pasta water. Cut the lasagne into thick strips.\n7. Use a slotted spoon to drain the leeks and add them into the browned sausage meat. Add in all of the cooked pasta, plus the ladle of pasta water to create a bit of sauciness.\n8. Season with salt and freshly ground black pepper to taste, and serve into bowls. Sprinkle with the chilli flakes and tarragon, if using, to garnish. Grate over a mountain of Parmesan, if using.'
    },
    {
      title: 'Artisan Sourdough',
      description: 'Master the art of the perfect crust and airy crumb with our signature sourdough guide, featuring locally sourced ancient grains.',
      cuisine_type: 'Bakery',
      image_url: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccf1?w=600&h=500&fit=crop',
      recipe_content: 'Ingredients:\n- 500g bread flour\n- 350ml water\n- 100g sourdough starter\n- 10g salt\n\nInstructions:\n1. Mix flour, water, and starter. Let autolyse for 30 minutes\n2. Add salt and fold into dough\n3. Bulk fermentation: 4-6 hours with stretch and folds every 30 minutes\n4. Shape and final proof: 12-16 hours in the fridge\n5. Preheat dutch oven to 500°F\n6. Score loaf and bake covered 20 minutes, uncovered 25-30 minutes\n7. Cool completely before slicing'
    },
    {
      title: 'Wild Berry Pavlova',
      description: 'A cloud-like meringue base paired with seasonal forest berries and silky double cream. An elegant finale to any artisanal meal.',
      cuisine_type: 'Dessert',
      image_url: 'https://images.unsplash.com/photo-1604080853949-b92f50e00b7f?w=600&h=500&fit=crop',
      recipe_content: 'Ingredients:\n- 4 egg whites\n- 250g caster sugar\n- 1 tsp cornstarch\n- 1 tsp vanilla extract\n- 300ml double cream\n- 300g mixed wild berries\n- Fresh mint\n\nInstructions:\n1. Preheat oven to 120°C\n2. Whip egg whites until stiff peaks form\n3. Gradually add sugar, whipping until glossy\n4. Fold in cornstarch and vanilla\n5. Spread meringue on baking paper into circle shape\n6. Bake for 1.5 hours until pale and crisp\n7. Cool completely\n8. Top with whipped cream, berries, and fresh mint\n9. Serve immediately'
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
