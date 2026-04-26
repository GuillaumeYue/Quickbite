const MenuItem = require('../models/MenuItem');

async function listItems(req, res) {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getItem(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createItem(req, res) {
  try {
    const { name, description, price, category, imageUrl, available } = req.body;
    if (!name || price == null) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const item = new MenuItem({
      name: name,
      description: description || '',
      price: price,
      category: category || 'main',
      imageUrl: imageUrl || '',
      available: available !== undefined ? available : true
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateItem(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const fields = ['name', 'description', 'price', 'category', 'imageUrl', 'available'];
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (req.body[f] !== undefined) {
        item[f] = req.body[f];
      }
    }
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function removeItem(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { listItems, getItem, createItem, updateItem, removeItem };
