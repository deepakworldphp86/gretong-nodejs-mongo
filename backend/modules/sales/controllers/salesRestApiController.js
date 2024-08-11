const { ordersModel } = require('../models/orderModel'); // Import your order model

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = new ordersModel(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders with pagination
const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };
    const orders = await ordersModel.paginate({}, options);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await ordersModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order by ID
const updateOrder = async (req, res) => {
  try {
    const order = await ordersModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const order = await ordersModel.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnOrder = async (req, res) => {
  try {
   
    const { id } = req.params;
    const { isReturned, returnDate, returnReason, returnStatus, returnAmount } = req.body.returnDetails;
  
    // Find and update the order with return details
    const order = await ordersModel.findByIdAndUpdate(
      id,
      {
        $set: {
          'returnDetails.isReturned': isReturned,
          'returnDetails.returnDate': returnDate,
          'returnDetails.returnReason': returnReason,
          'returnDetails.returnStatus': returnStatus,
          'returnDetails.returnAmount': returnAmount,
        }
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  returnOrder
};
