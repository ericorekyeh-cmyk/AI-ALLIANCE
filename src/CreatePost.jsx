import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function CreatePost() {
  const navigate = useNavigate();
  
  // State to hold our form inputs
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // State for user feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing on submit
    setIsSubmitting(true);
    setErrorMsg('');

    // 1. Send the data to Supabase
    const { error } = await supabase
      .from('blog_posts')
      .insert([
        { 
          title: title, 
          excerpt: excerpt, 
          content: content, 
          image_url: imageUrl 
        }
      ]);

    // 2. Handle the result
    if (error) {
      console.error('Error saving post:', error);
      setErrorMsg('Failed to publish post. Please try again.');
      setIsSubmitting(false);
    } else {
      // Success! Send them back to the main blog page to see their new post
      navigate('/blog');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
      <button 
        onClick={() => navigate('/blog')} 
        style={{ background: 'none', border: 'none', color: '#2d5a27', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Back to Blog
      </button>

      <h2>Write a New Blog Post</h2>
      
      {errorMsg && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title *</label>
          <input 
            type="text" 
            required 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="e.g., The Secret to Perfect Sourdough"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Short Excerpt *</label>
          <input 
            type="text" 
            required 
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="A one-sentence summary for the blog card..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Image URL (Optional)</label>
          <input 
            type="url" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Content *</label>
          <textarea 
            required 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            placeholder="Write your amazing article here..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '12px', 
            backgroundColor: isSubmitting ? '#ccc' : '#2d5a27', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1.1rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;