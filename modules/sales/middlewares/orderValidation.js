const { z, ZodError } = require('zod');

const orderSchema = z.object({
  customers: z.string().length(24, 'Invalid user ID'),
  orderItems: z.array(z.object({
    name: z.string(),
    qty: z.number().int().positive(),
    price: z.number().positive(),
    products: z.string().length(24, 'Invalid product ID')
  })),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string()
  }),
  paymentMethod: z.string(),
  paymentResult: z.object({
    id: z.string().optional(),
    status: z.string().optional(),
    update_time: z.string().optional(),
    email_address: z.string().email().optional()
  }).optional(),
  itemsPrice: z.number().nonnegative(),
  taxPrice: z.number().nonnegative(),
  shippingPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  isPaid: z.boolean(),
  paidAt: z.string().optional(),
  isDelivered: z.boolean(),
  deliveredAt: z.string().optional()
});

const validateOrder = (req, res, next) => {
  try {
    orderSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

module.exports = { validateOrder };
