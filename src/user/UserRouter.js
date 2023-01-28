const express = require('express');
const { save } = require('./userService');
const UserService = require('./userService');
const { check, validationResult } = require('express-validator');
const User = require('./userModel');

const router = express.Router();

// bail() that is put in the middle is to ensure that if the upper one is checked and thers error,it doesn't need to go to the lower part

router.post(
    '/api/1.0/users',
    check('username')
        .notEmpty()
        .withMessage('Username cannot be null')
        .bail()
        .isLength({ min: 4, max: 32 })
        .withMessage('Must have min of 4 characters and max of 32'),
    check('email').notEmpty().withMessage('E-mail cannot be null').bail().isEmail()
        .withMessage('Email is not valid').bail().custom(async(email) => {
            const user = await UserService.findByEmail(email);
            if (user) {
                throw new Error('E-mail already in use')
            }
        }),
    check('password').notEmpty().withMessage('Password cannot be null').bail()
        .isLength({ min: 4 })
        .withMessage('Password must  have min of 6 characters')
        .bail()
        .matches(/^(?=.*[a-z])(?=.*[^A-Z])(?=.*\d).*$/)
        .withMessage('Password must have at least 1 lower case, 1 upper case and 1 number'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrors = {};
            errors.array().forEach((error) => (validationErrors[error.param] = error.msg));
            // const response = { validationErrors: { ...req.validationErrors } };
            return res.status(400).send({ validationErrors });
        }
            await save(req.body);
            return res.send({ message: 'User created successfully' }); 
    }
);

module.exports = router;
