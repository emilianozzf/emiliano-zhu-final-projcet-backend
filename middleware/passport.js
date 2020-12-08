const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const SECRET = process.env.SECRET;

// Stores the jwt token and the secret key
const opts = {};
// Extracts the jwt token from the client end
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Extracts the SECRET from the server end
opts.secretOrKey = SECRET;

module.exports = (passport) => {
	passport.use(
		// Passes the opts object to JwtStrategy, we get jwt_payload
		new JwtStrategy(opts, (jwt_payload, done) => {
			// Tries to find a user with a matching id field in our database
			User.findOne({ _id: jwt_payload.id })
				.then((user) => {
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					}
				})
				.catch((err) => console.log({ error: 'Error authenticating the user' }));
		})
	);
};
