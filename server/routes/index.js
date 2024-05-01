const userRouter = require("./user-routes.js");
const productRouter = require("./product-routes.js");
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
