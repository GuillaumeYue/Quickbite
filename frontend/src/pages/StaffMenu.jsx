import { useEffect, useState } from 'react';
import api from '../api';
import MenuItemForm from '../components/MenuItemForm';
import { useAuth } from '../AuthContext';
import '../styles/staff-menu.css';

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function StaffMenu() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(function() {
    load();
  }, []);

  function load() {
    setLoading(true);
    api.get('/menu').then(function(res) {
      setItems(res.data);
      setLoading(false);
    }).catch(function(err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not load menu');
      setLoading(false);
    });
  }

  async function handleSave(payload) {
    if (editing && editing._id) {
      const res = await api.put('/menu/' + editing._id, payload);
      setItems(function(prev) {
        return prev.map(function(it) { return it._id === editing._id ? res.data : it; });
      });
    } else {
      const res = await api.post('/menu', payload);
      setItems(function(prev) { return [res.data].concat(prev); });
    }
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete('/menu/' + id);
      setItems(function(prev) { return prev.filter(function(it) { return it._id !== id; }); });
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      alert(msg || 'Could not delete');
    }
  }

  async function toggleAvailable(it) {
    try {
      const res = await api.put('/menu/' + it._id, { available: !it.available });
      setItems(function(prev) {
        return prev.map(function(p) { return p._id === it._id ? res.data : p; });
      });
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      alert(msg || 'Could not update');
    }
  }

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(it) {
    setEditing(it);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  const isAdmin = user && user.role === 'admin';

  return (
    <div>
      <div className="staff-page-head">
        <div>
          <h1>Menu</h1>
          <div className="staff-counts"><strong>{items.length}</strong> items</div>
        </div>
        <button className="staff-btn primary" onClick={startAdd} style={{ flex: 'none', padding: '10px 18px' }}>
          + Add item
        </button>
      </div>

      {loading ? (
        <div className="staff-loading">Loading...</div>
      ) : error ? (
        <div className="staff-empty">{error}</div>
      ) : items.length === 0 ? (
        <div className="staff-empty">No items yet. Add your first one.</div>
      ) : (
        <div className="staff-menu-table">
          <div className="staff-menu-row head">
            <div></div>
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div></div>
          </div>
          {items.map(function(it) {
            return (
              <div key={it._id} className="staff-menu-row">
                <div className="staff-menu-thumb">
                  {it.imageUrl ? <img src={it.imageUrl} alt={it.name} /> : it.name.charAt(0)}
                </div>
                <div>
                  <div className="staff-menu-name">{it.name}</div>
                  <div className="staff-menu-desc">{it.description}</div>
                </div>
                <div className="staff-menu-cat">{it.category}</div>
                <div className="staff-menu-price">{formatPrice(it.price)}</div>
                <div>
                  <button
                    className={'staff-toggle ' + (it.available ? 'on' : 'off')}
                    onClick={function() { toggleAvailable(it); }}
                  >
                    {it.available ? 'Available' : 'Sold out'}
                  </button>
                </div>
                <div className="staff-row-actions">
                  <button className="staff-btn" onClick={function() { startEdit(it); }}>Edit</button>
                  {isAdmin ? (
                    <button className="staff-btn danger" onClick={function() { handleDelete(it._id); }}>Delete</button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm ? (
        <MenuItemForm item={editing} onSave={handleSave} onClose={closeForm} />
      ) : null}
    </div>
  );
}

export default StaffMenu;
