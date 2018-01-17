/************************************************************************************************************
*	User Model for interacting with mongodb "user" collection
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
*************************************************************************************************************/
const mongoose = require('mongoose');

//Prepare User Model schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	_id: {type: Schema.ObjectId},
	name: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	created: {type: Date, default: Date.now},
})

module.exports = mongoose.model('User', UserSchema);


