import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Navigation from './Navigation';
import './PagePlaceholder.css';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Regent Recipes</h1>
      <Navigation />
      
      <div className="blog-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Latest Food & Cooking Articles</h2>
          
          {/* Button neatly placed at the top right! */}
          <Link 
            to="/blog/new" 
            style={{ background: '#2d5a27', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            + Write New Post
          </Link>
        </div>
        
        {loading ? (
          <p>Loading articles...</p>
        ) : (
          <div className="blog-grid" style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {posts.map((post) => (
              <div key={post.id} className="blog-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    /* ---> THE NEW IMAGE STYLE FIX IS HERE <--- */
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <h3 style={{ marginTop: '15px' }}>{post.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p>{post.excerpt}</p>
                
                <Link 
                  to={`/blog/${post.id}`} 
                  className="read-more-btn" 
                  style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center', marginTop: '10px' }}
                >    
                  Read Article
                </Link>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;