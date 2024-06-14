const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const blogCategoryRules = require("../middlewares/validation/validation-rules/blogCategory-validation-rules");
const blogCategoryMiddleware = require("../middlewares/validation/validation-middlewares/blogCategory-validation-middleware");
const blogCategoryController = require("../controllers/blogCategory-controller");

router.get( "/:bcid", blogCategoryController.getBlogCategoryById);

router.put(
  "/:bcid",
  [verifyAccessToken, isAdmin],
  blogCategoryRules.updateBlogCategoryValidationRules(),
  [blogCategoryMiddleware.updateBlogCategoryMiddleware],
  blogCategoryController.updateBlogCategoryById
);

router.delete(
  "/:bcid",
  [verifyAccessToken, isAdmin],
  blogCategoryController.deleteBlogCategoryByid
);

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  blogCategoryRules.createBlogCategoryValidationRules(),
  [blogCategoryMiddleware.createBlogCategoryMiddleware],
  blogCategoryController.createBlogCategory
);
router.get("/", blogCategoryController.getBlogCategories)

module.exports = router;