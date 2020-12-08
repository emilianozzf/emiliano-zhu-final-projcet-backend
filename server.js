const express = require('express');
require('dotenv').config(); // for loading environment variables
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require("cors");

const app = express();

// REQUIRE ROUTES
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const comments = require('./routes/api/comments');

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// DB CONFIG
const MONGO_URI = process.env.MONGO_URI;
mongoose
	.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Mongo Connection successful'))
	.catch((err) => console.log('err'));

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

// PASSPORT CONFIG
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use('/api/users', users);
app.use('/api/posts', posts);
// app.use('/api/posts/:id/comments', comments);
app.use('/api/comments', comments);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server up and running on port ${PORT}`);
});
