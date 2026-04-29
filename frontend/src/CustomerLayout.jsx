import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import './styles/layout.css';

function CustomerLayout() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="customer-layout">
      <header className="customer-header">
        <Link to="/" className="brand">QuickBite</Link>
        <nav className="customer-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          {user ? <NavLink to="/orders">My Orders</NavLink> : null}
          {user && (user.role === 'staff' || user.role === 'admin') ? (
            <NavLink to="/staff/orders">Staff</NavLink>
          ) : null}
        </nav>
        <div className="customer-actions">
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <span>C</span>
            {count > 0 ? <span className="cart-badge">{count}</span> : null}
          </Link>
          {user ? (
            <div className="user-block">
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={logout} className="link-btn">Log out</button>
            </div>
          ) : (
            <div className="auth-actions">
              <Link to="/login">Log in</Link>
              <Link to="/register" className="btn-primary">Sign up</Link>
            </div>
          )}
        </div>
      </header>
      <main className="customer-main">
        <Outlet />
      </main>
    </div>
  );
}

export default CustomerLayout;
