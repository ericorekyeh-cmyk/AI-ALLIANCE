import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', lineHeight: '1.8' }}>
      
      {/* Optional: A beautiful wide hero image */}
      <img 
        src="https://images.pexels.com/photos/3184192/pexels-photo-3184192.jpeg?auto=compress&cs=tinysrgb&w=1200" 
        alt="People cooking together" 
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      />

      <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', textAlign: 'center', marginBottom: '10px' }}>
        Welcome to Regent Recipes
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888', fontStyle: 'italic', marginBottom: '40px' }}>
        Elevate Your Culinary Canvas
      </p>

      <div style={{ fontSize: '1.1rem', color: '#333', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p>
          Regent Recipes is the premier digital destination for culinary excellence. We believe that cooking is an art form, and every exceptional dish deserves a gallery.
        </p>
        <p>
          Born out of a passion for fine food, Regent Recipes was created for the discerning home cook and the dedicated epicurean who demands more than just a simple list of ingredients. Our platform is a curated space to discover, preserve, and share meticulously crafted recipes that elevate the everyday meal into an unforgettable dining experience.
        </p>
        <p>
          Whether you are mastering the perfect artisan sourdough, sourcing the finest pantry spices, or exploring the delicate balance of at-home fine dining, you are in the right place. Join our community of passionate creators, refine your technique, and bring the sophistication of the professional kitchen directly to your dining room.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
        <Link 
          to="/" 
          style={{ background: '#2d5a27', color: 'white', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}
        >
          Explore the Kitchen
        </Link>
      </div>
      
    </div>
  );
}

export default About;