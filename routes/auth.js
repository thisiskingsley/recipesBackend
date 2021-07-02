const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
// const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//USER MODEL
const User = require('../models/User');

// @route: POST api/auth
// @description: Authenticate the user (DURING LOGIN)
// @access: Public
router.post('/', (req, res) => {
	// res.send(req.body);
	const { username, password } = req.body;

	//Simple validation
	if (!username || !password) {
		return res.status(400).json({ msg: 'PLEASE ENTER ALL FIELDS' });
	}

	//Check for existing user.
	User.findOne({ username }).then(user => {
		if (!user) return res.status(400).json({ msg: 'USER DOES NOT EXISTS' });

		//VALIDATE PASSWORD
		bycrypt.compare(password, user.password).then(isMatch => {
			if (!isMatch) return res.status(400).json({ msg: 'INVALID CREDENTIALS' });

			jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET,
				{
					expiresIn: 3600,
				},
				(err, token) => {
					if (err) throw err;
					res.json({
						token,
						user: {
							id: user.id,
							username: user.username,
						},
					});
				}
			);
		});
	});
});

// @route: GET api/auth/user
// @desc: Get specific user data (for LOAD_USER: with every request we make, we want to try to load the user)
// @access: Private
router.get('/user', auth, (req, res) => {
	User.findById(req.user.id)
		.select('-password')
		.then(user => res.json(user));
});

module.exports = router;
