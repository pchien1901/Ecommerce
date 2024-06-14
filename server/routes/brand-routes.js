const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const brandValidationRules = require("../middlewares/validation/validation-rules/brand-validation-rules");
const brandMiddleware = require("../middlewares/validation/validation-middlewares/brand-validation-middleware");
const brandController = require("../controllers/brand-controller");

router.get(
  "/:brandId",
  brandValidationRules.getBrandByIdRules(),
  [brandMiddleware.checkBrandIdMiddleware],
  brandController.getBrandById
);

router.put(
  "/:brandId",
  brandValidationRules.updateBrandValidationRules(),
  [brandMiddleware.updateBrandMiddleware],
  brandController.updateBrandById
);

router.delete(
  "/:brandId",
  [verifyAccessToken, isAdmin],
  brandController.deleteBrandByid
);

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  brandValidationRules.createBrandValidationRules(),
  [brandMiddleware.createBrandMiddleware],
  brandController.createBrand
);

router.get("/", brandController.getBrands);

module.exports = router;
