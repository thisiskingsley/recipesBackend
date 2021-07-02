const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
// const config = require('config');
const jwt = require('jsonwebtoken');

//USER MODEL
const User = require('../models/User');

// @route: GET routes/users
// @description: Fetch users
// @access: Public
router.get('/', (req, res) => {
	User.find().then(users => res.json(users));
});

// @route: POST api/users
// @description: Register new user
// @access: Public
router.post('/', (req, res) => {
	// res.send(req.body);
	const { username, password } = req.body;
	const recipes = [];

	//Simple validation
	if (!username || !password) {
		return res.status(400).json({ msg: 'PLEASE ENTER ALL FIELDS' });
	}

	//Check for existing user.
	User.findOne({ username }).then(user => {
		if (user) return res.status(400).json({ msg: 'USER ALREADY EXISTS' });

		const newUser = new User({
			username,
			password,
			recipes,
		});

		//CREATE SALT & HASH PASSWORD
		bycrypt.genSalt(10, (err, salt) => {
			bycrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err;
				newUser.password = hash;
				newUser.save().then(user => {
					jwt.sign(
						{ id: user.id }, //the payload
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
	});
});

module.exports = router;
