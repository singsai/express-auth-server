const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
}

//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

	// See if the user ID in the payload exists in the database
	// If it does, call 'done' with that user (we found the user)
	// Otherwise, call done without a user object (invalid!)
	User.findById(payload.sub, function(err, user) {
		if (err) { return done(err, false) } //error

		if (user) {
			done(null, user) //user found!
		} else {
			done(null, false) //did not find the user
		}
	})
})

// Tell passport to use this strategy
passport.use(jwtLogin)