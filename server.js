//You can run either "npm start" or preferrably "npm run server" to run the db server continously. We set that up in package.json

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
// const config = require('config');

const app = express();

require('dotenv').config();

//BODY-PARSER MIDDLEWARE
app.use(express.json());
app.use(cors());

// DB CONFIG (we get our congif folder values with "config.get()")
// const db = config.get('mongoURI');
const db = process.env.MONGO_URI;


//CONNECT TO MONGO
mongoose
	.connect(db, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

//USE ROUTES
app.use('/api/users', require('./routes/users')); //this means the route "api/users" is now "/"
app.use('/api/auth', require('./routes/auth')); //this means the route "api/auth" is now "/"

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server started on port ${port}`));
