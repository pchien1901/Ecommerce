const router = require("express").Router();
const userController = require("../controllers/user-controller.js");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken.js");
const userValidationRules = require("../middlewares/validation/validation-rules/user-validation-rules.js");
const userMiddleware = require("../middlewares/validation/validation-middlewares/user-validation-middlewares.js");
const validationMiddleware = require("../middlewares/validation/validation-middlewares/validation-middleware.js");

// middleware đặt trong dấu ngoặc vuông để phân biệt
router.put(
  "/cart", 
  [verifyAccessToken], 
  userValidationRules.updateCart(), 
  [validationMiddleware.validationMiddleware], 
  userController.updateCart
);
router.post("/register", userController.register);
router.post("/register-admin", userController.registerAdmin);
router.post("/login", userController.login);
router.get("/current", [verifyAccessToken], userController.getCurrent);
router.post("/refresh-token", userController.refreshAccessToken);
router.get("/logout", userController.logout);
router.get("/forgot-password", userController.forgotPassword);
router.put("/reset-password", userController.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], userController.getUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", [verifyAccessToken, isAdmin], userController.deleteUserById);
router.put(
  "/:id", 
  [verifyAccessToken], 
  userValidationRules.updateUserValidationRules(), 
  [userMiddleware.updateUserMiddleware],
   userController.updateUserById
);

module.exports = router;
