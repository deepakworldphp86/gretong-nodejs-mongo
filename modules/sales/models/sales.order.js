const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema(
  {
    customers: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'customers',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        products: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'products',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    billingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    invoice: {
      number: { type: String, required: true },
      date: { type: Date, required: true },
      status: { type: String, required: true }, // e.g., 'Pending', 'Paid', 'Cancelled'
      amount: { type: Number, required: true }, // Total amount of the invoice
    },
    returnDetails: {
      isReturned: { type: Boolean, default: false },
      returnDate: { type: Date },
      returnReason: { type: String },
      returnStatus: { type: String }, // e.g., 'Pending', 'Approved', 'Rejected'
      returnAmount: { type: Number }, // Amount to be refunded
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePaginate);

const ordersModel = mongoose.model('orders', orderSchema);

module.exports = { ordersModel };
