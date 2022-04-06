const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    username: {
		type: String,
		unique: true,
        required: true,
	},
	email: {
		type: String,
		unique: true,
        required: true,
	},
	password: {
    type: String,
    required: true,
    min: 8
    
    },
    confirmPassword: {
    type: String,
    required: true,
    min: 8
        }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;