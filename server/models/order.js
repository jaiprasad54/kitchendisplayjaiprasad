/******************************************************************************************************
*	Order Model for interacting with mongodb "orders" collection
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
******************************************************************************************************/
const mongoose = require('mongoose');
//Prepare Order Collection schema
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
	//_id: {type: Schema.ObjectId},
	product_id: {type: Schema.ObjectId, ref: 'Product', required: true},
	user_id: {type: Schema.ObjectId, ref: 'User', required: true},
	quantity: {type: Number, required: true},
	status: {type: String, default: "pending", enum: ['pending', 'done']},
	created: {type: Date, default: Date.now},
	modified: {type: Date}
},{id:false, versionKey: false})

module.exports = mongoose.model('Order', OrderSchema);


