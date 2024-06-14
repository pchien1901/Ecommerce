const userRouter = require("./user-routes.js");
const productRouter = require("./product-routes.js");
const productCategoryRouter = require("./productCategory-routes.js");
const blogCategoryRouter = require("./blogCategory-routes.js");
const blogRouter = require("./blog-routes.js");
const brandRouter = require("./brand-routes.js");
const couponRouter = require("./coupon-routes.js");
const orderRouter = require("./order-routes.js");
const {
  notFound,
  errorHandler,
  baseErrorHandler,
} = require("../middlewares/error-handler.js");

/**
 * Tạo Route
 * @param {*} app
 * Author: PMChien (02/04/2024)
 */
const initRoutes = (app) => {
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/product-categories", productCategoryRouter);
  app.use("/api/v1/blog-categories", blogCategoryRouter);
  app.use("/api/v1/blogs", blogRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/orders", orderRouter);

  // Middleware
  /**
   * sẽ tìm route từ trên xuống dưới,
   *  nếu không tìm được sẽ rơi vào trường hợp này
   */
  app.use(notFound);
  app.use(baseErrorHandler);
  // Khi có lỗi thì rơi vào đây
  app.use(errorHandler);
};

module.exports = initRoutes;
