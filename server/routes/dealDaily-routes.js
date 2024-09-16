const router = require("express").Router();
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const dealDailyValidationRules = require("../middlewares/validation/validation-rules/dealDaily-validation-rules");
const validationMiddleware = require('../middlewares/validation/validation-middlewares/validation-middleware.js');
const dealDailyController = require("../controllers/dealDaily-controller");

router.get("/current", dealDailyController.getCurrentDealDaily);

router.get(
  "/:dealDailyId",
  dealDailyController.getDealDailyById
);

router.put(
  "/:dealDailyId",
  [ verifyAccessToken, isAdmin ],
  dealDailyValidationRules.updateDealDailyRules(),
  [validationMiddleware.validationMiddleware],
  dealDailyController.updateDealDailyById
);

router.delete(
  "/:dealDailyId",
  [verifyAccessToken, isAdmin],
  dealDailyController.deleteDealDailyById
);

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  dealDailyValidationRules.createDealDailyRules(),
  [validationMiddleware.validationMiddleware],
  dealDailyController.createDealDaily
);


router.get("/", dealDailyController.getDealDailys);

module.exports = router;
