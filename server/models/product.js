/******************************************************************************************************
*	Product Model for interacting with mongodb "products" collection
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
******************************************************************************************************/

const mongoose = require('mongoose');

//Prepare Product Collection schema
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
	_id: {type: Schema.ObjectId},
	name: {type: String, required: true},
	stock: {type: Number, default: 0},
	predicted: {type: Number, required: true},
	created: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Product', ProductSchema);


