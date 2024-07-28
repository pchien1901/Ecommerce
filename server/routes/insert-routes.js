const router = require('express').Router();
const insertController = require("../controllers/insertData-controller");

router.post('/', insertController.insertProduct);
router.post('/brands', insertController.insertBrand);
router.post('/product-categories', insertController.insertProductCategory);

module.exports = router;