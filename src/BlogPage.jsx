import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Make sure this path is correct!
import Navigation from './Navigation';
import './PagePlaceholder.css'; // You can rename this to BlogPage.css later!

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
      .order('created_at', { ascending: false }); // Show newest posts first

    if (error) {
      console.error('Error fetching blog posts:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Online Recipe Sharing Platform</h1>
      <Navigation />
      
      <div className="blog-container">
        <h2>Latest Food & Cooking Articles</h2>
        
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
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <h3>{post.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p>{post.excerpt}</p>
                
                {/* We can build a /blog/:id route for this next! */}
                <Link 
                to={`/blog/${post.id}`} 
                 className="read-more-btn" 
                 style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}
                >     
                  Read Article
                </Link>
              </div>
            ))}
          </div>
        )}
        // Find your <h2>Latest Food & Cooking Articles</h2> and add this right below it:

        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <Link 
            to="/blog/new" 
            style={{ background: '#2d5a27', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          + Write New Post
         </Link>
      </div>
      
        <div style={{ marginTop: '30px' }}>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
