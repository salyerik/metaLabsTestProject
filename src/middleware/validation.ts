const { check } = require('express-validator');

export const registerValidation = [
	check('name', 'Name cannot be shorter than 2 letters').isLength({
		min: 2,
		max: 32,
	}),
	check('email', 'Invalid E-mail').isEmail(),
	check('password', 'Password length must be min 6, max 20 letters').isLength({
		min: 6,
		max: 20,
	}),
];

export const loginValidation = [
	check('email', 'Invalid E-mail').isEmail(),
	check('password', 'Incorrect Password').isLength({ min: 6, max: 20 }),
];

export const updateValidation = [
	check('email', 'Invalid E-mail').isEmail(),
	check('name', 'Name cannot be shorter than 2 letters').isLength({
		min: 2,
		max: 32,
	}),
];
