import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useSocket } from '../SocketContext';
import '../styles/orders.css';

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function formatDate(d) {
  return new Date(d).toLocaleString();
}

function OrderDetail() {
  const { id } = useParams();
  const socket = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(function() {
    setLoading(true);
    api.get('/orders/' + id).then(function(res) {
      setOrder(res.data);
      setLoading(false);
    }).catch(function(err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Could not load order');
      setLoading(false);
    });
  }, [id]);

  useEffect(function() {
    if (!socket) return;
    function onStatus(updated) {
      if (updated && updated._id === id) {
        setOrder(updated);
      }
    }
    socket.on('order:status', onStatus);
    return function() {
      socket.off('order:status', onStatus);
    };
  }, [socket, id]);

  async function handleCancel() {
    if (!confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put('/orders/' + id + '/cancel');
      setOrder(res.data);
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      alert(msg || 'Could not cancel');
    }
    setCancelling(false);
  }

  if (loading) {
    return <div className="order-detail"><div className="order-loading">Loading order...</div></div>;
  }
  if (error || !order) {
    return (
      <div className="order-detail">
        <div className="orders-empty"><p>{error || 'Order not found'}</p></div>
        <Link to="/orders">Back to my orders</Link>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <h1>Order #{order._id.slice(-6)}</h1>
      <div className="meta">Placed {formatDate(order.createdAt)}</div>

      <div className="order-status-bar">
        <div>
          <div className="label">Status</div>
          <div className="big-status">{order.status}</div>
        </div>
        <span className={'status-chip status-' + order.status}>{order.status}</span>
      </div>

      <div className="order-items">
        {order.items.map(function(it, i) {
          return (
            <div key={i} className="order-item-row">
              <div>
                <span className="name">{it.name}</span>
                <span className="qty">x {it.quantity}</span>
              </div>
              <div className="price">{formatPrice(it.price * it.quantity)}</div>
            </div>
          );
        })}
        <div className="order-item-row" style={{ background: 'var(--color-bg)' }}>
          <div className="name" style={{ fontWeight: 600 }}>Total</div>
          <div className="price">{formatPrice(order.total)}</div>
        </div>
        {order.tableNumber || order.note ? (
          <div className="order-note">
            {order.tableNumber ? <div>Table: {order.tableNumber}</div> : null}
            {order.note ? <div>Note: {order.note}</div> : null}
          </div>
        ) : null}
      </div>

      {order.status === 'pending' ? (
        <button className="order-cancel" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? 'Cancelling...' : 'Cancel order'}
        </button>
      ) : null}
    </div>
  );
}

export default OrderDetail;
