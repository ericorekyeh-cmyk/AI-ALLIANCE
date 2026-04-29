import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '40px', textAlign: 'center' }}><h2>Loading article...</h2></div>;
  
  if (!post) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <button onClick={() => navigate('/blog')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Back to Blog</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate('/blog')} 
        style={{ background: 'none', border: 'none', color: '#2d5a27', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}
      >
        ← Back to Blog
      </button>
      
      {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title} 
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
      )}
      
      <h1 style={{ marginTop: '30px', fontSize: '2.5rem', color: '#1a1a1a' }}>{post.title}</h1>
      <p style={{ color: '#666', fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
        Published on {new Date(post.created_at).toLocaleDateString()}
      </p>
      
      <div className="blog-content" style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }}>
        <p>{post.content}</p>
      </div>
    </div>
  );
}

export default BlogDetail;