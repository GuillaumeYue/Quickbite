import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './styles/staff-layout.css';

function StaffLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="staff-layout">
      <aside className="staff-side">
        <Link to="/staff/orders" className="staff-brand">
          QuickBite
          <span className="staff-brand-sub">Staff</span>
        </Link>
        <NavLink to="/staff/orders" className="staff-link">Orders</NavLink>
        <NavLink to="/staff/menu" className="staff-link">Menu</NavLink>
        <Link to="/" className="staff-link">Customer view</Link>
        <div className="staff-side-foot">
          <div className="me">{user ? user.name : ''}</div>
          <div className="role">{user ? user.role : ''}</div>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="staff-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StaffLayout;
