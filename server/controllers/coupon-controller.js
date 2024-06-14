const asyncHandler = require("express-async-handler");
const couponServices = require("../services/coupon-services");

/**
 * Controller tạo mới một mã giảm giá
 * Author: PMChien (10/05/2024)
 */
const createCoupon = asyncHandler( async (req, res) => {
  let coupon = req.body;
  let result = await couponServices.createCoupon(coupon);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một mã giảm giá theo id
 * Author: PMChien (10/05/2024)
 */
const getCouponById = asyncHandler( async (req, res) => {
  let { couponId } = req.params;
  let result = await couponServices.getCouponById(couponId);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy tất cả mã giảm giá có search, sort, paging, fields limit tối đa lấy được limit bản ghi 
 * Author: PMChien (10/05/2024)
 */
const getCoupons = asyncHandler(async (req, res) => {
  let result = await couponServices.getCoupons(req);
  return res.status(result?.code).json(result);
});

/**
 * Controller cập nhật 1 mã giảm giá theo id
 * Author: PMChien (10/05/2024)
 */
const updateCouponById = asyncHandler(async (req, res) => {
  let { couponId } = req.params;
  let coupon = req.body;
  let result = await couponServices.updateCouponById(couponId, coupon);
  return res.status(result?.code).json(result);
});


/**
 * Controller xóa 1 mã giảm giá theo id
 * Author: PMChien (10/05/2024)
 */
const deleteCouponById = asyncHandler( async (req, res) => {
  let { couponId } = req.params;
  let result = await couponServices.deleteCouponById(couponId);
  return res.status(result?.code).json(result);
})

module.exports = {
  createCoupon,
  getCouponById,
  getCoupons,
  updateCouponById,
  deleteCouponById
}