import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'quickbite_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch (e) {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(function() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(menuItem, qty) {
    const quantity = qty || 1;
    setItems(function(prev) {
      const idx = prev.findIndex(function(it) { return it.menuItem === menuItem._id; });
      if (idx >= 0) {
        const next = prev.slice();
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return prev.concat([{
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity
      }]);
    });
  }

  function removeItem(menuItemId) {
    setItems(function(prev) {
      return prev.filter(function(it) { return it.menuItem !== menuItemId; });
    });
  }

  function setQty(menuItemId, qty) {
    if (qty < 1) {
      removeItem(menuItemId);
      return;
    }
    setItems(function(prev) {
      return prev.map(function(it) {
        if (it.menuItem === menuItemId) {
          return { ...it, quantity: qty };
        }
        return it;
      });
    });
  }

  function clear() {
    setItems([]);
  }

  let count = 0;
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    count = count + items[i].quantity;
    total = total + items[i].quantity * items[i].price;
  }

  const value = {
    items: items,
    count: count,
    total: total,
    addItem: addItem,
    removeItem: removeItem,
    setQty: setQty,
    clear: clear
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
