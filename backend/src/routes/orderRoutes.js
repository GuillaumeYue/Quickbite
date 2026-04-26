const express = require('express');
const router = express.Router();
const {
  createOrder,
  listOrders,
  getOrder,
  updateStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, requireRole } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, listOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, requireRole('staff', 'admin'), updateStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
