import { Link } from 'react-router-dom';
import '../styles/landing.css';

const cats = [
  { key: 'mains', label: 'Mains', emoji: 'M', desc: 'Bowls, plates, classics' },
  { key: 'sides', label: 'Sides', emoji: 'S', desc: 'Fries, salads, dips' },
  { key: 'drinks', label: 'Drinks', emoji: 'D', desc: 'Soda, tea, juice' },
  { key: 'dessert', label: 'Dessert', emoji: 'B', desc: 'Sweet stuff' }
];

function Landing() {
  return (
    <div>
      <section className="landing-hero">
        <div className="landing-hero-text">
          <h1>Order food fast,<br /><span className="accent">eat fresh</span></h1>
          <p>Browse the menu, place your order in a few taps, and watch the kitchen prepare it in real time. No phone calls, no waiting in line.</p>
          <Link to="/menu" className="landing-cta">Browse menu</Link>
          <Link to="/register" className="landing-cta secondary">Sign up</Link>
        </div>
        <div className="landing-hero-art">
          <img src="/images/hero.png" alt="People cooking together" />
        </div>
      </section>

      <section className="landing-section">
        <h2>Browse by category</h2>
        <div className="landing-cats">
          {cats.map(function(c) {
            return (
              <Link key={c.key} to={'/menu?cat=' + c.key} className="cat-card">
                <div className="cat-emoji">{c.emoji}</div>
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="landing-section">
        <h2>Why QuickBite</h2>
        <div className="landing-features">
          <div className="feature">
            <h3>Live order updates</h3>
            <p>See your order move from the kitchen to ready for pickup without refreshing.</p>
          </div>
          <div className="feature">
            <h3>Pay in CAD</h3>
            <p>Prices in Canadian dollars, no surprise conversions at checkout.</p>
          </div>
          <div className="feature">
            <h3>Save your favorites</h3>
            <p>Reorder your usual in one tap from your order history.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
