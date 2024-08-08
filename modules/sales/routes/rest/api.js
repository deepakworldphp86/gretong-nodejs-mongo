const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  returnOrder
} = require('../../controllers/orderController');

const { validateOrder } = require('../../middlewares/orderValidation');


// Routes
router.post('/', validateOrder,createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.put('/return/:id', returnOrder);

module.exports = router;
