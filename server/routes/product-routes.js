const router = require("express").Router();
const productController = require("../controllers/product-controller.js");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken.js");
const productMiddleware = require("../middlewares/validation/validation-middlewares/product-validation-middleware.js");
const productValidationRules = require("../middlewares/validation/validation-rules/product-validation-rules.js");
const uploader = require("../config/cloudinary.config.js");

// cấu hình router 
router.put(
  '/ratings',
  [verifyAccessToken],
  productValidationRules.ratingValidationRules(),
  [productMiddleware.ratingsProductMiddleware],
  productController.ratings
);

router.get("/:pid", productController.getProductById);

router.delete("/:pid", [verifyAccessToken, isAdmin], productController.deleteProductbyId);

router.put(
  "/:pid", 
  [verifyAccessToken, isAdmin],
  productValidationRules.updateProductValidationRules(),
  [productMiddleware.updateProductMiddleware],
  productController.updateProductById
);

router.put(
  "/upload-images/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array('images', 10), // mỗi lần tối đa 10 ảnh
  productController.uploadImages
)

router.post(
  "/", 
  [verifyAccessToken, isAdmin], 
  productValidationRules.createProductValidationRules(),
  [productMiddleware.createProductMiddleware],
  productController.createProduct
);

router.get("/", productController.getProducts);


module.exports = router;