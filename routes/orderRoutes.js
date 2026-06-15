import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  simulatePayment,
  cancelOrder,
  getAllOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/simulate-pay')
  .put(protect, simulatePayment);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

export default router;
