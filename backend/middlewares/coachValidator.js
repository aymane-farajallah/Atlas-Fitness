const { body, validationResult } = require('express-validator');

const createCoachValidationRules = () => {
    return [
        body('fullname').optional().isString().withMessage('Full name must be a string'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
        body('gender').optional().isIn(['man', 'woman']).withMessage('Invalid gender'),
        body('city').optional().isString().withMessage('City must be a string'),
        body('address').optional().isString().withMessage('Address must be a string'),
        body('image').optional().isString().withMessage('Image must be a string'),
        body('flag_system').optional().isIn(['banned', 'not banned']).withMessage('Invalid flag system'),
        body('bank_details').optional().isString().withMessage('Bank details must be a string'),
        body('phone_number').optional().isNumeric().withMessage('Phone number must be numeric'),
        body('bio').optional().isString().withMessage('Bio must be a string'),
        body('price').optional().isNumeric().withMessage('Price must be numeric'),
        body('diploma').optional().isString().withMessage('Diploma must be a string'),
        body('availability').optional().isIn(['online', 'offline']).withMessage('Invalid availability')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createCoachValidationRules,
    validate
};
