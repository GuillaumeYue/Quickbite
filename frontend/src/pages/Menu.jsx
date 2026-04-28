import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ItemDrawer from '../components/ItemDrawer';
import '../styles/menu.css';

const CATEGORIES = ['all', 'mains', 'sides', 'drinks', 'dessert'];

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const cat = searchParams.get('cat') || 'all';

  useEffect(function() {
    setLoading(true);
    api.get('/menu').then(function(res) {
      setItems(res.data);
      setLoading(false);
    }).catch(function(err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not load menu');
      setLoading(false);
    });
  }, []);

  function pickCat(next) {
    if (next === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', next);
    }
    setSearchParams(searchParams);
  }

  const filtered = items.filter(function(it) {
    if (cat !== 'all' && (it.category || '').toLowerCase() !== cat) {
      return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const name = (it.name || '').toLowerCase();
      const desc = (it.description || '').toLowerCase();
      if (name.indexOf(q) === -1 && desc.indexOf(q) === -1) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="menu-page">
      <div className="menu-head">
        <div>
          <h1>Our Menu</h1>
          <p>Tap an item to see details and add to your cart.</p>
        </div>
        <input
          className="menu-search"
          type="search"
          placeholder="Search dishes..."
          value={search}
          onChange={function(e) { setSearch(e.target.value); }}
        />
      </div>

      <div className="menu-chips">
        {CATEGORIES.map(function(c) {
          const active = cat === c ? ' active' : '';
          return (
            <button
              key={c}
              className={'menu-chip' + active}
              onClick={function() { pickCat(c); }}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="menu-loading">Loading menu...</div>
      ) : error ? (
        <div className="menu-empty">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="menu-empty">No items match.</div>
      ) : (
        <div className="menu-grid">
          {filtered.map(function(it) {
            return (
              <div key={it._id} className="menu-card" onClick={function() { setActive(it); }}>
                <div className="menu-card-img">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} /> : it.name.charAt(0)}
                </div>
                <div className="menu-card-body">
                  <div className="menu-card-name">{it.name}</div>
                  <div className="menu-card-desc">{it.description}</div>
                  <div className="menu-card-foot">
                    <span className="menu-card-price">{formatPrice(it.price)}</span>
                    {it.available ? (
                      <span className="menu-card-tag">{it.category}</span>
                    ) : (
                      <span className="menu-card-tag unavailable">Sold out</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {active ? (
        <ItemDrawer item={active} onClose={function() { setActive(null); }} />
      ) : null}
    </div>
  );
}

export default Menu;
