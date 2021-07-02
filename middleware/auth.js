//THIS MIDDLEWARE IS TO SEE IF A USER HAS ACCESS TO A URL/PATH VIA THEIR TOKEN
// OR SIMPLY TO SEE WHETHER A USER IS LOGGED IN OR NOT.


// const config = require('config');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	const token = req.header('x-auth-token');

	//CHECK FOR TOKEN
	if (!token) {
		return res.status(401).json({ msg: 'NO TOKEN, AUTHORIZATION DENIED' });
	}

	try {
		//VERIFY TOKEN, IF THERE IS A TOKEN
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		//ADD USER FROM PAYLOAD
		req.user = decoded;
		next();
	} catch (e) {
		res.status(400).json({ msg: 'TOKEN IS NOT VALID' });
	}
};

module.exports = auth;
