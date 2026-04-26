const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

async function createOrder(req, res) {
  try {
    const { items, tableNumber, note } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    const orderItems = [];
    let total = 0;

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.menuItem || !it.quantity || it.quantity < 1) {
        return res.status(400).json({ message: 'Each item needs menuItem and quantity' });
      }
      const menu = await MenuItem.findById(it.menuItem);
      if (!menu) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      if (!menu.available) {
        return res.status(400).json({ message: menu.name + ' is not available' });
      }
      const lineTotal = menu.price * it.quantity;
      total = total + lineTotal;
      orderItems.push({
        menuItem: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: it.quantity
      });
    }

    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      total: total,
      tableNumber: tableNumber || '',
      note: note || '',
      status: 'pending'
    });
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to('staff').emit('order:new', order);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listOrders(req, res) {
  try {
    let orders;
    if (req.user.role === 'staff' || req.user.role === 'admin') {
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const isOwner = order.customer.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'staff' || req.user.role === 'admin';
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status || allowed.indexOf(status) === -1) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = status;
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to('staff').emit('order:status', order);
      io.to('user:' + order.customer.toString()).emit('order:status', order);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function cancelOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const isOwner = order.customer.toString() === req.user._id.toString();
    const isStaff = req.user.role === 'staff' || req.user.role === 'admin';
    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    order.status = 'cancelled';
    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to('staff').emit('order:status', order);
      io.to('user:' + order.customer.toString()).emit('order:status', order);
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createOrder, listOrders, getOrder, updateStatus, cancelOrder };
