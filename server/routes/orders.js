/******************************************************************************************************
*	Orders router for handling /api/orders request
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
*******************************************************************************************************/

const express = require('express');
const mongoose = require('mongoose');
const async = require('async');
const Order = require('../models/order');
const Product = require('../models/product');

var router = express.Router();

/**
 * @api {get} /api/orders List all orders or filtered orders based on filter object
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiParam [date] date Get list filtered by date.
 * @apiParam [status] status Get list filtered by status.
 *
 * @apiSuccess {Array} List of Orders Instance.
 */
router.get('/', function(req, res){
	let filter = {};
	
	if(req.query.date){
		filter.created = {"$gte": req.query.date};
	}

	['status'].forEach(function(field){
		if(req.query[field])
			filter[field] = req.query[field];
	});

	Order.find(filter, function(err, results){
		if(err){
			console.log(err);
			return res.status(404).send('ORDER_NOT_EXIST');
		}
		res.json(results);
	})
	
});

/**
 * @api {post} /api/orders Create a new Order
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiParam {String} product_id  	product id of the dish.
 * @apiParam {String} user_id  		user id of the user order for the dish.
 * @apiParam {String} quantity      Quantity.
 * @apiParam {String} [status="pending"] 	Can be any value of "pending" and "done".
 *
 * @apiError 404 PRODUCT_NOT_EXIST
 * @apiError 503 SAVE_FAILED
 * @apiSuccess {Object} OrderInstance new order instance.
 */
router.post('/', function(req, res){
	var productId = req.body.product_id;
	async.auto({
		productExists: function(callback){
			Product.find({_id: mongoose.Types.ObjectId(productId)}, function(err, result){
				console.log(err, result);
				if(err || (Object.keys(result).length == 0)){
					return callback({statusCode: 404, status: 404, message: 'PRODUCT_NOT_EXIST'});
				}
				callback(null, result);
			})
		},
		save: ['productExists', function(results, callback){
			var orderInst = new Order(req.body);
			/*orderObj.save(req.body, function(err, result){
				if(err){
					return callback({statusCode: 503, status: 503, message: 'SAVE_FAILED'});
				}
				callback(null, result);
			})*/
			orderInst.save(function(err){
				console.log(err);
				if(err)
					return callback({statusCode: 503, status: 503, message: 'SAVE_FAILED'});	
				callback(null, orderInst);

			});
		}]
	}, function(err, results){
		if(err){
			console.error(err);
			return res.status(err.statusCode).send(err.message);
		}
		res.json(results.save);
	})
	
	
});

/**
 * @api {post} /api/orders/:id update a existing Order
 * @apiName UpdateOrder
 * @apiGroup Orders
 *
 * @apiParam {String} status  status of the Order.

 * @apiError 404 ORDER_NOT_EXIST
 * @apiError 503 UPDATE_FAILED
 * @apiSuccess {Object} Updated instance of Order.
 */
router.put('/:id', function(req, res){
	//required filter
	var id = req.params.id;
	var updateData = {};
	//only status allowed to updated in order table
	['status'].forEach(function(field){
		updateData[field] = req.body[field];
	});
	updateData.modified = Date.now();
	var newData = {};
	//TODO: failed order return to initial product stock(by giving status="pending" again)
	async.series({
		updateOrder: function(callback){
			Order.findByIdAndUpdate(id, updateData, {new:true},function(err, result){
				if(err) return callback(err);
				newData = result;
				callback(null, result);
			})
		},
		productStock: function(callback){
			//if new status is not "done" then don't update the product stock
			if(newData.status !== 'done'){
				return callback();
			}
			var quantity = newData.quantity;
			//increment product stock by quantity of the order
			Product.findByIdAndUpdate(newData.product_id, {$inc: {stock: quantity}}, function(err, result){
			})
			//we will not wait for product stock update
			callback();
		}
	}, function(err, results){
		var result = results.updateOrder;
		if(err){
			return res.status(503).send('UPDATE_FAILED');
		}else if(!result){
			return res.status(404).send('ORDER_NOT_EXIST');
		}
		res.json(result);
	})
	
	
});


module.exports = router;
