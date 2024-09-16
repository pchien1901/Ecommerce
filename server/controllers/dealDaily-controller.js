const dealDailyServices = require("../services/dealDaily-services.js");
const asyncHandler = require("express-async-handler");

/**
 * Controller thêm mới một deal daily
 * Author: PMChien (16/09/2024) 
 */
const createDealDaily = asyncHandler( async (req, res) => {
  let dealDaily = req.body;
  // Lấy các trường product ( lưu vào productId ), startTime, endTime, couponName, discount
  let { product: productId, startTime, endTime, couponName, discount } = dealDaily;
  let result = await dealDailyServices.createDealDaily(productId, startTime, endTime, couponName, discount);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy một deal daily theo id
 * Author: PMChien (16/09/2024)
 */
const getDealDailyById = asyncHandler(async (req, res) => {
  let { dealDailyId } = req.params;
  let result = await dealDailyServices.getDealDailyById(dealDailyId);
  return res.status(result?.code).json(result);
});

/**
 * Controller lấy deal daily tại thời điểm hiện tại
 * Author: PMChien (16/09/2024)
 */
const getCurrentDealDaily = asyncHandler(async (req, res) => {
    let result = await dealDailyServices.getCurrentDealDaily();
    return res.status(result?.code).json(result);
});

/**
 * Controller lấy toàn bộ deal daily (search, sort, fields limit, paging)
 * Author: PMChien (16/09/2024)
 */
const getDealDailys = asyncHandler(async (req, res) => {
  let result = await dealDailyServices.getDealDailys(req);
  return res.status(result?.code).json(result);
});

/**
 * Controller cập nhật một deal daily theo id
 * Author: PMChien (16/09/2024)
 */
const updateDealDailyById = asyncHandler(async (req, res) => {
  let { dealDailyId } = req.params;
  let dealDaily = req.body;
  let result = await dealDailyServices.updateDealDailyById(dealDailyId, dealDaily);
  return res.status(result?.code).json(result);
});

/**
 * Controller xóa một deal daily theo id
 * Author: PMChien (16/09/2024)
 */
const deleteDealDailyById = asyncHandler(async (req, res) => {
  let { dealDailyId } = req.params;
  let result = await dealDailyServices.deleteDealDailyById(dealDailyId);
  return res.status(result?.code).json(result);
})

module.exports = {
  createDealDaily,
  getDealDailyById,
  getDealDailys,
  getCurrentDealDaily,
  updateDealDailyById,
  deleteDealDailyById
}