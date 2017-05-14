// https://www.udemy.com/react-redux-tutorial/learn/v4/t/lecture/4755170?start=0

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// Define model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true},
	password: String
})

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this

	// generate a salt, then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err) }

		// hash (encrypt) password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) { return next(err) }

			// overwrite plain text password w/ encrypted password
			user.password = hash
			next() //save the model
		})
	})
})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) { return callback(err) }

		callback(null, isMatch)
	})
}

// Create model class
// Load schema into mongoose
const User = mongoose.model('user', userSchema)

module.exports = User