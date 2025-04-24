//Creates a new schema for a new user *using the phone number as the unique specifier*

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ['Client', 'Manager', 'Admin'],
		default: 'Client'
	}
});

module.exports = mongoose.model('User', UserSchema);