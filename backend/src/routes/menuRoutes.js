const express = require('express');
const router = express.Router();
const {
  listItems,
  getItem,
  createItem,
  updateItem,
  removeItem
} = require('../controllers/menuController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', listItems);
router.get('/:id', getItem);
router.post('/', protect, requireRole('admin', 'staff'), createItem);
router.put('/:id', protect, requireRole('admin', 'staff'), updateItem);
router.delete('/:id', protect, requireRole('admin'), removeItem);

module.exports = router;
