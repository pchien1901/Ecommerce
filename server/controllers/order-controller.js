const asyncHandler = require("express-async-handler");
const orderServices = require("../services/order-services");

/**
 * Controller tạo một đơn hàng
 * Author: PMChien (10/06/2024)
 */
const createOrder = asyncHandler( async (req, res) => {
  let { _id } = req.user; // lấy id người dùng từ req, qua middleware xác thực sẽ có user
  let { products, coupon } = req.body;
  const result = await orderServices.createOrder(products, coupon, _id);
  return res.status(result?.code).json(result);
});

/**
 * controller cập nhật trạng thái đơn hàng
 * Author: PMChien (10/06/2024)
 */
const updateOrderStatus = asyncHandler( async (req, res) => {
  let { orderId } = req.params;
  let status = req.body;
  let result = await orderServices.updateStatus(orderId, status);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy các order theo user id
 * Author: PMChien (10/06/2024)
 */
const getOrderByUserId = asyncHandler(async (req, res) => {
  let { _id } = req.user;
  let result = await orderServices.getOrderByUserId(_id);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một order theo order id
 * Author: PMChien (11/06/2024);
 */
const getOrderById = asyncHandler(async (req, res) => {
  let { orderId } = req.params;
  let result = await orderServices.getOrderById(orderId);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy toàn bộ đơn hàng (đối với admin)
 * Author: PMChien (11/06/2024)
 */
const getOrders = asyncHandler( async (req, res) => {
  let result = await orderServices.getOrders(req);
  return res.status(result?.code).json(result);
});

module.exports = {
  createOrder,
  updateOrderStatus,
  getOrderByUserId,
  getOrderById,
  getOrders
}