const router = require("express").Router();
const orderController = require("../controllers/order-controller");
const orderRules = require("../middlewares/validation/validation-rules/order-validation-rules");
const validationMiddleware = require("../middlewares/validation/validation-middlewares/validation-middleware");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.put("/status/:orderId",
   [verifyAccessToken],
   orderRules.updateStatusRules(),
  [validationMiddleware.validationMiddleware],
  orderController.updateOrderStatus
);

router.get("/:orderId", [verifyAccessToken], orderController.getOrderById);

router.get("/admin", [verifyAccessToken, isAdmin], orderController.getOrderById);

router.get("/", [verifyAccessToken], orderController.getOrderByUserId);

router.post(
  "/",
  [verifyAccessToken],
  orderRules.createOrderRules(),
  [validationMiddleware.validationMiddleware],
  orderController.createOrder
);
module.exports = router;