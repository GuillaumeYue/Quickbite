import { useEffect, useState } from 'react';
import { useCart } from '../CartContext';
import '../styles/drawer.css';

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function ItemDrawer({ item, onClose }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(function() {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return function() { window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  if (!item) return null;

  function dec() {
    if (qty > 1) setQty(qty - 1);
  }

  function inc() {
    setQty(qty + 1);
  }

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setTimeout(function() { onClose(); }, 600);
  }

  function handleOverlayClick(e) {
    if (e.target.classList.contains('drawer-overlay')) {
      onClose();
    }
  }

  return (
    <div className="drawer-overlay" onClick={handleOverlayClick}>
      <div className="drawer">
        <div style={{ position: 'relative' }}>
          <button className="drawer-close" onClick={onClose} aria-label="Close">x</button>
          <div className="drawer-img">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.name} /> : item.name.charAt(0)}
          </div>
        </div>
        <div className="drawer-body">
          <h2>{item.name}</h2>
          {item.category ? <span className="drawer-cat">{item.category}</span> : null}
          <div className="drawer-price">{formatPrice(item.price)}</div>
          <p className="drawer-desc">{item.description || 'No description.'}</p>
          <div className="drawer-qty">
            <label>Quantity</label>
            <div className="qty-stepper">
              <button onClick={dec} disabled={qty <= 1}>-</button>
              <span className="qty-value">{qty}</span>
              <button onClick={inc}>+</button>
            </div>
          </div>
        </div>
        <div className="drawer-foot">
          <button
            className={'drawer-add' + (added ? ' drawer-added' : '')}
            onClick={handleAdd}
            disabled={!item.available || added}
          >
            {!item.available ? 'Sold out' : added ? 'Added!' : 'Add ' + qty + ' to cart - ' + formatPrice(item.price * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDrawer;
