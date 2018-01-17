/******************************************************************************************************
*	Users router for handling /api/users request
*	Author: Jaiprasad P. Mungekar
*	Created: 18/01/2018
*
*******************************************************************************************************/

const express = require('express');
const async = require('async');
const User = require('../models/user');
const bcrypt = require('bcrypt');

var router = express.Router();

/**
 * @api {get} /api/users List all users or filtered users based on filter object
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiParam {Object} filter All filters supported by mongodb with operateros including
 *					  $in, $gt, $lt, $regex etc.
 *
 * @apiSuccess {Array} List of Users Instance.
 */
router.get('/', function(req, res){
	bcrypt.genSalt(10, function(err, salt){
		console.log('random salt', salt);
		bcrypt.hash("pass123", salt, function(err, hash){
			console.log('generate hash for pass: pass123', hash);
		})
	})
	var filter = req.query.filter;
	User.find(filter, function(err, results){
		if(err){
			console.log(err);
			return res.status(404).send('PRODUCT_NOT_EXIST');
		}

		//remove sensitive information from list
		results.map(function(data){
			delete data.password;
		})
		res.json(results);
	})
	
});

module.exports = router;
