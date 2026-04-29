import { useEffect, useState } from 'react';
import api from '../api';
import { useSocket } from '../SocketContext';
import '../styles/staff-orders.css';
import '../styles/orders.css';

const FILTERS = ['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'];

function formatPrice(n) {
  return 'C$' + Number(n).toFixed(2);
}

function timeAgo(d) {
  const seconds = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (seconds < 60) return seconds + 's ago';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  return new Date(d).toLocaleDateString();
}

function StaffOrders() {
  const socket = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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

  useEffect(function() {
    if (!socket) return;
    function onNew(o) {
      setOrders(function(prev) {
        if (prev.some(function(p) { return p._id === o._id; })) return prev;
        return [o].concat(prev);
      });
    }
    function onStatus(o) {
      setOrders(function(prev) {
        return prev.map(function(p) { return p._id === o._id ? o : p; });
      });
    }
    socket.on('order:new', onNew);
    socket.on('order:status', onStatus);
    return function() {
      socket.off('order:new', onNew);
      socket.off('order:status', onStatus);
    };
  }, [socket]);

  async function changeStatus(id, status) {
    try {
      const res = await api.put('/orders/' + id + '/status', { status: status });
      setOrders(function(prev) {
        return prev.map(function(p) { return p._id === id ? res.data : p; });
      });
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      alert(msg || 'Could not update');
    }
  }

  function counts() {
    const c = { all: orders.length, pending: 0, preparing: 0, ready: 0, completed: 0, cancelled: 0 };
    for (let i = 0; i < orders.length; i++) {
      c[orders[i].status] = (c[orders[i].status] || 0) + 1;
    }
    return c;
  }

  const c = counts();
  const visible = filter === 'all' ? orders : orders.filter(function(o) { return o.status === filter; });
  const activeCount = c.pending + c.preparing;

  return (
    <div>
      <div className="staff-page-head">
        <div>
          <h1>Orders</h1>
          <div className="staff-counts">
            <strong>{activeCount}</strong> active, <strong>{c.ready}</strong> ready for pickup
          </div>
        </div>
        <div className="staff-note">Updates live from the kitchen</div>
      </div>

      <div className="staff-filters">
        {FILTERS.map(function(f) {
          const active = filter === f ? ' active' : '';
          return (
            <button
              key={f}
              className={'staff-filter' + active}
              onClick={function() { setFilter(f); }}
            >
              {f}
              <span className="badge">{c[f] || 0}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="staff-loading">Loading orders...</div>
      ) : error ? (
        <div className="staff-empty">{error}</div>
      ) : (
        <div className="staff-orders-grid">
          {visible.length === 0 ? (
            <div className="staff-empty">No orders match this filter.</div>
          ) : (
            visible.map(function(o) {
              const totalQty = o.items.reduce(function(s, it) { return s + it.quantity; }, 0);
              return (
                <div key={o._id} className={'staff-order is-' + o.status}>
                  <div className="staff-order-head">
                    <span className="staff-order-id">#{o._id.slice(-6)}</span>
                    <span className={'status-chip status-' + o.status}>{o.status}</span>
                  </div>
                  <div className="staff-order-meta">
                    <span><strong>{totalQty}</strong> item{totalQty === 1 ? '' : 's'}</span>
                    {o.tableNumber ? <span>Table <strong>{o.tableNumber}</strong></span> : null}
                    <span>{timeAgo(o.createdAt)}</span>
                  </div>
                  <div className="staff-order-items">
                    {o.items.map(function(it, i) {
                      return <div key={i}>{it.quantity} x {it.name}</div>;
                    })}
                  </div>
                  {o.note ? <div className="staff-note">Note: {o.note}</div> : null}
                  <div className="staff-order-foot">
                    <span className="staff-order-total">{formatPrice(o.total)}</span>
                  </div>
                  <div className="staff-actions">
                    {o.status === 'pending' ? (
                      <>
                        <button className="staff-btn primary" onClick={function() { changeStatus(o._id, 'preparing'); }}>Accept</button>
                        <button className="staff-btn danger" onClick={function() { changeStatus(o._id, 'cancelled'); }}>Reject</button>
                      </>
                    ) : null}
                    {o.status === 'preparing' ? (
                      <button className="staff-btn primary" onClick={function() { changeStatus(o._id, 'ready'); }}>Mark ready</button>
                    ) : null}
                    {o.status === 'ready' ? (
                      <button className="staff-btn primary" onClick={function() { changeStatus(o._id, 'completed'); }}>Mark completed</button>
                    ) : null}
                    {o.status === 'completed' || o.status === 'cancelled' ? (
                      <button className="staff-btn" disabled>Closed</button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default StaffOrders;
