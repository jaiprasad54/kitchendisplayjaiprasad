/******************************************************************************************************
*	Products router for handling /api/products request
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
*******************************************************************************************************/
//load libraries
const express = require('express');
const async = require('async');
const Product = require('../models/product');

var router = express.Router();

/**
 * @api {get} /api/products List all products or filtered products based on filter object
 * @apiName GetProducts
 * @apiGroup Products
 *
 * @apiParam {String} [id] will be string of product id or comma seperator for product id .
 * @apiParam {String} [name] Product name in string .
 * @apiParam {Number} [stock] Product initial stock .
 * @apiParam {Number} [predicted] Product initial stock expected as a predicted value.
 * @apiParam {String} [date] if specified returns list with date starting from this date 
 							 and will be in format YYYY-mm-dd HH:mm:ss.
 *
 * @apiSuccess {Array} List of Products Instance.
 */

router.get('/', function(req, res){
	let filter = {};
	let id = req.query.id;
	if(req.query.id){
		filter._id = {$in: req.query.id.split(',')} 
	}

	if(req.query.date){
		filter.created = {"$gte": req.query.date};
	}

	if(req.query.name){
		filter.name = {"$regex": req.query.name, "$options": 'i'};
	}

	['stock', 'predicted'].forEach(function(field){
		if(req.query[field])
			filter[field] = req.query[field];
	});
   
    Product.find(filter, function(err, results){
		if(err){
			console.log(err);
			return res.status(404).send('PRODUCT_NOT_EXIST');
		}
		res.json(results);
	})
	
});


/**
 * @api {get} /api/products/:id Get product details based on id given
 * @apiName GetProduct
 * @apiGroup Products
 *
 * @apiParam {String} id Product id of the product to get information.
 *
 * @apiSuccess {Object} Product new instance.
 */
router.get('/:id', function(req, res){
	var productId = req.params.id;
	Product.findOne(productId, function(err, result){
		if(err){
			console.log(err);
			return res.status(404).send('PRODUCT_NOT_EXIST');
		}
		res.json(result);
	})
	
});

/**
 * @api {post} /api/products Create a new Product
 * @apiName CreateProduct
 * @apiGroup Products
 *
 * @apiParam {String} name  Name of the product.
 * @apiParam {String} [stock=0]     Product initial Stock.
 * @apiParam {String}  Predicted 	Product predicted values how much product can be made today.
 *
 * @apiError 409 PRODUCT_ALREADY_EXIST
 * @apiError 503 SAVE_FAILED
 * @apiSuccess {Object} ProductInstance new product instance.
 */
router.post('/', function(req, res){
	let productInst = new Product(req.body);
	productInst.save(function(err, result){
		if(err && err.code==11000){
			return res.status(409).send('PRODUCT_ALREADY_EXIST');
		} else if(err){
			return res.status(503).send('SAVE_FAILED');
		}
		res.json(result);
	})
	
});

/**
 * @api {post} /api/products/:id update a existing Product
 * @apiName UpdateProduct
 * @apiGroup Products
 *
 * @apiParam {String} name  Name of the product.
 * @apiParam {String} [stock=0]     Product Stock in numbers.
 * @apiParam {String}  Predicted 	Product predicted values how much product can be made today.
 *
 * @apiError 404 PRODUCT_NOT_FOUND
 * @apiError 503 UPDATE_FAILED
 * @apiSuccess {Object} ProductInstance updated instance of Product.
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
	Product.findByIdAndUpdate(id, req.body, {new:true}, function(err, result){
		if(err){
			return res.status(503).send('UPDATE_FAILED');
		} else if(Object.keys(result).length==0){
			return res.status(404).send('PRODUCT_NOT_FOUND');
		}
		res.json(result);
	})
	
});


module.exports = router;
