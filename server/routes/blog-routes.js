const router = require("express").Router();
const blogController = require("../controllers/blog-controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const blogValidationRules = require("../middlewares/validation/validation-rules/blog-validation-rules");
const blogValidationMiddleware = require("../middlewares/validation/validation-middlewares/blog-validation-middleware");
const uploader = require("../config/cloudinary.config");

router.get(
  "/:bid/like",
  [verifyAccessToken],
  blogValidationRules.likeBlogRules(),
  [blogValidationMiddleware.favouriteBlogMiddleware],
  blogController.likeBlog
);

router.get(
  "/:bid/dislike",
  [verifyAccessToken],
  blogValidationRules.dislikeBlogRules(),
  [blogValidationMiddleware.favouriteBlogMiddleware],
  blogController.dislikeBlog
)

router.get(
  "/:bid",
  blogValidationRules.getBlogByIdRules(),
  [blogValidationMiddleware.getBlogByIdMiddleware],
  blogController.getBlogById
);

router.put(
  "/:bid",
  [verifyAccessToken, isAdmin],
  blogValidationRules.updateBlogValidationRules(),
  [blogValidationMiddleware.updateBlogMiddleware],
  blogController.updateBlogById
);

router.put(
  "/upload-image/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"), // tải lên một ảnh nên dùng single
  blogController.uploadImage
)

router.delete(
  "/:bid",
  [verifyAccessToken, isAdmin],
  blogValidationRules.deleteBlogValidationRules(),
  [blogValidationMiddleware.deleteBlogMiddleware],
  blogController.deleteBlogById
);

router.post(
  "/", 
  [verifyAccessToken, isAdmin],
  blogValidationRules.createBlogValidationRules(),
  [blogValidationMiddleware.createBlogMiddleware],
  blogController.createBlog
);

router.get("/", blogController.getBlogs);;

module.exports = router;