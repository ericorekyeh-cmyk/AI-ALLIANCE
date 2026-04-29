import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';

function CreatePost() {
  const navigate = useNavigate();
  
  // --- FORM STATE ---
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // --- RECENT POSTS STATE ---
  const [recentPosts, setRecentPosts] = useState([]);

  // Fetch recent posts when the page loads
  useEffect(() => {
    const fetchRecentPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(5); // Just grab the 5 newest ones!

      if (!error && data) {
        setRecentPosts(data);
      }
    };

    fetchRecentPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('blog_posts')
      .insert([{ title, excerpt, content, image_url: imageUrl }]);

    if (error) {
      console.error('Error saving post:', error);
      setErrorMsg('Failed to publish post. Please try again.');
      setIsSubmitting(false);
    } else {
      navigate('/blog');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <button 
        onClick={() => navigate('/blog')} 
        style={{ background: 'none', border: 'none', color: '#2d5a27', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Back to Main Blog
      </button>

      {/* FLEXBOX CONTAINER: Puts form on left, list on right */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN: The Form */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2>Write a New Blog Post</h2>
          {errorMsg && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{errorMsg}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Title *</label>
              <input 
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Short Excerpt *</label>
              <input 
                type="text" required value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Image URL (Optional)</label>
              <input 
                type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Content *</label>
              <textarea 
                required value={content} onChange={(e) => setContent(e.target.value)} rows="10"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              style={{ 
                padding: '12px', backgroundColor: isSubmitting ? '#ccc' : '#2d5a27', 
                color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Recent Posts Sidebar */}
        <div style={{ flex: '1', minWidth: '250px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee', alignSelf: 'flex-start' }}>
          <h3 style={{ marginTop: 0, borderBottom: '2px solid #2d5a27', paddingBottom: '10px' }}>Recent Posts</h3>
          
          {recentPosts.length === 0 ? (
            <p style={{ color: '#666' }}>No posts yet!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentPosts.map((post) => (
                <li key={post.id} style={{ marginBottom: '15px' }}>
                  <Link 
                    to={`/blog/${post.id}`} 
                    style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}
                  >
                    {post.title}
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default CreatePost;