import Order from '../models/Order.js';

// POST /api/orders
export const createOrder = async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Nenhum item no pedido.');
  }

  if (!shippingAddress?.address || !shippingAddress?.city ||
      !shippingAddress?.postalCode || !shippingAddress?.country) {
    res.status(400);
    throw new Error('Preencha o endereço de entrega completo.');
  }

  if (!paymentMethod) {
    res.status(400);
    throw new Error('Selecione uma forma de pagamento.');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const created = await order.save();
  res.status(201).json(created);
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }

  if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Sem permissão para ver este pedido.');
  }

  res.json(order);
};

// GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  res.json(orders);
};

// PUT /api/orders/:id/pay
export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }

  order.isPaid   = true;
  order.paidAt   = Date.now();
  order.paymentResult = {
    id:            req.body.id,
    status:        req.body.status,
    update_time:   req.body.update_time,
    email_address: req.body.email_address,
  };

  const updated = await order.save();
  res.json(updated);
};

// PUT /api/orders/:id/simulate-pay  — simula pagamento (sem gateway real)
export const simulatePayment = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error('Pedido cancelado não pode ser pago.');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Este pedido já foi pago.');
  }

  order.isPaid   = true;
  order.paidAt   = Date.now();
  order.paymentResult = {
    id:            `SIM-${Date.now()}`,
    status:        'COMPLETED',
    update_time:   new Date().toISOString(),
    email_address: order.user?.email || '',
  };

  const updated = await order.save();
  res.json(updated);
};

// PUT /api/orders/:id/cancel  — cancela pedido (apenas se não pago)
export const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }

  // Apenas o dono ou admin pode cancelar
  if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Sem permissão para cancelar este pedido.');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Pedido já pago não pode ser cancelado.');
  }

  if (order.isCancelled) {
    res.status(400);
    throw new Error('Pedido já foi cancelado.');
  }

  order.isCancelled   = true;
  order.cancelledAt   = Date.now();

  const updated = await order.save();
  res.json(updated);
};

// GET /api/orders — admin
export const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// PUT /api/orders/:id/deliver — admin  (não exige isPaid, admin decide)
export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Pedido não encontrado.');
  }

  order.isDelivered  = true;
  order.deliveredAt  = Date.now();
  const updated = await order.save();
  res.json(updated);
};
