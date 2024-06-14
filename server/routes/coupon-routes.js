const couponController = require("../controllers/coupon-controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const couponRules = require("../middlewares/validation/validation-rules/coupon-validation-rules");
const validationMiddleware = require("../middlewares/validation/validation-middlewares/validation-middleware");
const router = require("express").Router();

router.get("/:couponId", couponController.getCouponById);

router.put(
  "/:couponId",
  [verifyAccessToken, isAdmin],
  couponRules.updateCouponRules(),
  [validationMiddleware.validationMiddleware],
  couponController.updateCouponById
);

router.delete(
  "/:couponId",
  [verifyAccessToken, isAdmin],
  couponController.deleteCouponById
);

router.get("/", couponController.getCoupons);

router.post(
  "/", 
  [verifyAccessToken, isAdmin], 
  couponRules.createCouponRules(), 
  [validationMiddleware.validationMiddleware], 
  couponController.createCoupon
);

module.exports = router;