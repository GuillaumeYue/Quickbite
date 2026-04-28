import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import api from '../api';
import '../styles/cart.css';

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function Cart() {
  const { items, total, setQty, removeItem, clear } = useCart();
  const navigate = useNavigate();
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        items: items.map(function(it) {
          return { menuItem: it.menuItem, quantity: it.quantity };
        }),
        tableNumber: tableNumber,
        note: note
      };
      const res = await api.post('/orders', payload);
      clear();
      navigate('/orders/' + res.data._id);
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not place order');
      setSubmitting(false);
    }
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      <p className="cart-sub">Review your items, add a table number if you are dining in.</p>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/menu" className="btn-primary">Browse menu</Link>
        </div>
      ) : (
        <div>
          <div className="cart-list">
            {items.map(function(it) {
              return (
                <div key={it.menuItem} className="cart-row">
                  <div className="cart-thumb">{it.name.charAt(0)}</div>
                  <div className="cart-info">
                    <div className="name">{it.name}</div>
                    <div className="unit">{formatPrice(it.price)} each</div>
                  </div>
                  <div className="qty-stepper">
                    <button onClick={function() { setQty(it.menuItem, it.quantity - 1); }}>-</button>
                    <span className="qty-value">{it.quantity}</span>
                    <button onClick={function() { setQty(it.menuItem, it.quantity + 1); }}>+</button>
                  </div>
                  <div className="cart-line-total">{formatPrice(it.price * it.quantity)}</div>
                  <button className="cart-remove" onClick={function() { removeItem(it.menuItem); }} aria-label="Remove">x</button>
                </div>
              );
            })}
          </div>

          <div className="cart-extra">
            <div className="cart-field">
              <label>Table number (optional)</label>
              <input
                type="text"
                placeholder="e.g. 12"
                value={tableNumber}
                onChange={function(e) { setTableNumber(e.target.value); }}
              />
            </div>
            <div className="cart-field">
              <label>Note for the kitchen (optional)</label>
              <textarea
                rows={3}
                placeholder="Allergies, requests..."
                value={note}
                onChange={function(e) { setNote(e.target.value); }}
              />
            </div>
          </div>

          {error ? <div className="cart-error">{error}</div> : null}

          <div className="cart-totals">
            <span className="label">Total</span>
            <span className="amount">{formatPrice(total)}</span>
          </div>

          <button
            className="cart-checkout"
            onClick={handleCheckout}
            disabled={submitting}
          >
            {submitting ? 'Placing order...' : 'Place order'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
