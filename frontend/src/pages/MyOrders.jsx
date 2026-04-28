import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/orders.css';

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleString();
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(function() {
    api.get('/orders').then(function(res) {
      setOrders(res.data);
      setLoading(false);
    }).catch(function(err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not load orders');
      setLoading(false);
    });
  }, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <p className="sub">Track your orders here. Status updates live.</p>

      {loading ? (
        <div className="order-loading">Loading...</div>
      ) : error ? (
        <div className="orders-empty"><p>{error}</p></div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>You have not placed any orders yet.</p>
          <Link to="/menu" className="btn-primary">Browse menu</Link>
        </div>
      ) : (
        orders.map(function(o) {
          const itemCount = o.items.reduce(function(sum, it) { return sum + it.quantity; }, 0);
          return (
            <Link key={o._id} to={'/orders/' + o._id} className="order-card">
              <div className="order-card-head">
                <span className="order-id">#{o._id.slice(-6)}</span>
                <span className={'status-chip status-' + o.status}>{o.status}</span>
              </div>
              <div className="order-card-body">
                <div className="order-summary">
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                  <div className="meta">{formatDate(o.createdAt)}</div>
                </div>
                <div className="order-total">{formatPrice(o.total)}</div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}

export default MyOrders;
