import { useState } from 'react'
import { supabase } from './supabaseClient'

function AddRecipe({ onRecipeAdded }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cuisine, setCuisine] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase
      .from('recipes')
      .insert([{ title, description, cuisine_type: cuisine }])

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Recipe added!')
      setTitle('')
      setDescription('')
      setCuisine('')
      onRecipeAdded()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Add New Recipe</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required /><br/>
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /><br/>
      <input placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} /><br/>
      <button type="submit">Add Recipe</button>
    </form>
  )
}

export default AddRecipe