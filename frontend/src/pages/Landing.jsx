import { Link } from 'react-router-dom';
import '../styles/landing.css';

const specials = [
  {
    name: 'Garlic Shrimp Pasta',
    desc: 'Pan seared shrimp tossed with angel hair pasta, cherry tomatoes and chives.',
    image: '/images/seafood-pasta.png'
  },
  {
    name: 'Italian Meatballs',
    desc: 'House made beef and pork meatballs over fresh arugula with sea salt.',
    image: '/images/meatballs.png'
  },
  {
    name: 'Cheeseburger Deluxe',
    desc: 'Beef patty with cheddar, fried egg, bacon and crisp veggies. Served with fries.',
    image: '/images/burger.png'
  }
];

function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Link to="/" className="landing-brand">QuickBite</Link>
        <nav className="landing-nav">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="landing-signup">Sign Up</Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>Order <span className="accent">food</span> anytime,<br />anywhere</h1>
          <p>Browse our menu, place your order in a few taps, and watch the kitchen prepare it in real time. Affordable, tasty and fast.</p>
          <div className="landing-cta-row">
            <Link to="/register" className="landing-cta">Sign up free</Link>
            <Link to="/login" className="landing-cta secondary">Log in</Link>
          </div>
        </div>
        <div className="landing-hero-art">
          <img src="/images/ramen.png" alt="Bowl of ramen" />
        </div>
      </section>

      <section className="landing-specials">
        <h2>Special Meals of the day!</h2>
        <p className="specials-sub">Check our specials of the day and try our most popular dishes, prepared fresh and served hot.</p>
        <div className="specials-row">
          {specials.map(function(s) {
            return (
              <div key={s.name} className="special-card">
                <div className="special-img">
                  <img src={s.image} alt={s.name} />
                </div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-newsletter">
        <div className="newsletter-text">
          <h2>Get notified when we update!</h2>
          <p>Get notified when we add new items to our menu, change prices or run promotions.</p>
        </div>
        <form className="newsletter-form" onSubmit={function(e) { e.preventDefault(); alert('Thanks! We will keep you posted.'); }}>
          <input type="email" placeholder="you@example.com" required />
          <button type="submit">Get notified</button>
        </form>
      </section>

      <footer className="landing-footer">
        <div className="footer-cols">
          <div>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact Us</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Safety Center</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Cookies Policy</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div>
            <h4>Follow us</h4>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
            <a href="#">YouTube</a>
          </div>
        </div>
        <div className="footer-bottom">
          (c) 2026 QuickBite. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Landing;
