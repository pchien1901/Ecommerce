const router = require("express").Router();
const productCategoryController = require("../controllers/productCategory-controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const productCategoryMiddleware = require("../middlewares/validation/validation-middlewares/productCategory-validation-middleware");
const productCatgoryRules = require("../middlewares/validation/validation-rules/productCategory-validation-rules");


router.get("/:pcid", productCategoryController.getProductCategoryById);
router.put(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  productCatgoryRules.updateProductCategoryValidationRules(),
  [productCategoryMiddleware.updateProductCategoryMiddleware],
  productCategoryController.updateProductCategoryById
);
router.delete(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  productCategoryController.deleteProductCategoryById
);
router.post(
  "/",
  [verifyAccessToken, isAdmin],
  productCatgoryRules.createProductCategoryValidationRules(),
  [productCategoryMiddleware.createProductCategoryMiddleware],
  productCategoryController.createProductCategory
);
router.get("/", productCategoryController.getProductCategories);

module.exports = router;