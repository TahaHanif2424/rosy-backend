import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Order from '../models/Order';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { items, total, customerName, email, contactNumber, address } = req.body;

    console.log('📦 Creating new order for:', customerName);
    console.log('Order details:', { items: items.length, total, email });

    const order = await Order.create({
      items,
      total,
      customerName,
      email,
      contactNumber,
      address,
      status: 'pending',
    });

    console.log('✅ Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('📦 Fetching all orders...');
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${orders.length} orders`);

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProfit = totalSales * 0.4; // 40% profit margin

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders, // Return orders directly in data (not nested)
    });
  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin)
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
    });
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order,
      },
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
    });
  }
};
