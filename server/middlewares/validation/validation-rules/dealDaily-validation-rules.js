const { body, param } = require("express-validator");
const BaseError = require('../../../exception/base-error');
const { isValidObjectId } = require("../../../ultis/helper.js");

/**
 * Validator khi thêm mới dealDaily
 * Author: PMChien (16/09/2024)
 */
const createDealDailyRules = () => {
    return [
        body('product')
            .trim().notEmpty().withMessage('Sản phẩm tạo deal daily không được để trống.')
            .isMongoId().withMessage('Sản phẩm không hợp lệ.'),
        // Kiểm trả startTime không trống và là ngày hợp lệ
        body('startTime')
            .trim().notEmpty().withMessage('Thời gian bắt đầu không được để trống.')
            .isISO8601().withMessage('Thời gian bắt đầu không hợp lệ.'),
        // endTime không trống và là ngày hợp lệ
        body('endTime')
            .trim().notEmpty().withMessage('Thời gian kết thúc không được để trống.')
            .isISO8601().withMessage('Thời gian kết thúc không hợp lệ'),
        // so sánh startTime < endTime
        body('endTime').custom((value, { req }) => {
            const startTime = new Date(req.body.startTime);
            const endTime = new Date(value);

            if(startTime >= endTime) {
                throw new BaseError(
                    false,
                    400,
                    "startTime >= endTime, thời gian bắt đầu phải nhỏ hơn.",
                    "Thời gian bắt đầu và kết thúc không hợp lệ."
                );
            }
            return true;
        }),
    ];
}

/**
 * Validator khi cập nhật deal daily
 * Author: PMChien (16/09/2024)
 */
const updateDealDailyRules = () => {
    return [
        body('product').notEmpty().withMessage('Sản phẩm không được bỏ trống.'),
        body('product._id')
            .notEmpty().withMessage('Id sản phẩm không được để trống.')
            .isMongoId().withMessage('Id của sản phẩm không đúng định dạng.'),
        // Kiểm trả startTime không trống và là ngày hợp lệ
        body('startTime')
            .trim().notEmpty().withMessage('Thời gian bắt đầu không được để trống.')
            .isISO8601().withMessage('Thời gian bắt đầu không hợp lệ.'),
        // endTime không trống và là ngày hợp lệ
        body('endTime')
            .trim().notEmpty().withMessage('Thời gian kết thúc không được để trống.')
            .isISO8601().withMessage('Thời gian kết thúc không hợp lệ'),
        // so sánh startTime < endTime
        body('endTime').custom((value, { req }) => {
            const startTime = new Date(req.body.startTime);
            const endTime = new Date(value);

            if(startTime >= endTime) {
                throw new BaseError(
                    false,
                    400,
                    "startTime >= endTime, thời gian bắt đầu phải nhỏ hơn.",
                    "Thời gian bắt đầu và kết thúc không hợp lệ."
                );
            }
            return true;
        }), 
        // Kiểm tra coupon
        body('coupon').optional().custom( (coupon) => {
            // coupon có thể null ( typeof null = object , )
            if(coupon === null) {
                return true;
            }

            if(typeof coupon !== 'object') {
                throw new BaseError(false, 400, 'Coupon phải là một object.', 'Hãy kiểm tra lại mã giảm giá.');
            }

            requiredFields = ['_id', 'name', 'discount', 'expiry']
            // Kiểm tra sự tồn tại của các trường bắt buộc
            for(let field of requiredFields) {
                if(!coupon.hasOwnProperty(field)) {
                    throw new BaseError(false, 400, `coupon phải chứa trường ${field}.`, 'Hãy kiểm tra lại mã giảm giá.')
                }
            }

            // Kiểm tra định dạng từng trường
            if(typeof coupon._id !== 'string' || !isValidObjectId(coupon._id)) {
                throw new BaseError(false, 400, `coupon._id ${coupon._id} không phải là MongoDB ObjectId.`, 'Hãy kiểm tra lại mã giảm giá.')
            }

            if(typeof discount !== 'number' || coupon.discount < 0 || coupon.discount > 100) {
                throw new BaseError(false, 400, `discount ${coupon.discount} phải thuộc từ 0 - 100`, 'Hãy kiểm tra lại mã giảm giá.');
            }
            return true;
        })   
    ]
}

module.exports = {
    createDealDailyRules,
    updateDealDailyRules
}