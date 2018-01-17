const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();

//load required middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, config.clientDir)));
app.use(cors());

//set default error handler
app.use(function(err, req, res, next){
	if(err){
		console.log(err.stack);
		next(err);
	}
});

//connect mongodb
var mongooseOptions = {
	useMongoClient: true,
	autoIndex: false
}
var db = mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.dbname, mongooseOptions);
var ordersRouter = require('./routes/orders');
app.use(config.apiRoot+'/orders', ordersRouter);

mongoose.Promise = global.Promise;

//load routers
var productsRouter = require('./routes/products');
app.use(config.apiRoot+'/products', productsRouter);

var usersRouter = require('./routes/users');
app.use(config.apiRoot+'/users', usersRouter);

app.set('json spaces', 2);

//start server
app.listen(config.port, function(server){
	console.log('server started on', 'http://localhost:'+config.port+"/")
})












/*

Kitchen Display System

order place with quantity
worker mark as Done(button)
   inc created-till-now for that product

set predicted value for each dish api



1. Place order with quantity(and add to listing)
2. API for predicted values(numbers) for each dish
3. Created till now= products * quantity(should be update once done clicked)
4. Download reports
5. Kitchen display Html page (angular/reactjs assume ) update for each page(in browser tab) when done click
6. Heroku upload


Order
_id
product_id
user_id
quantity
created

Products
_id
name
stock
predicted
created*\/

users
_id
name
email
password
created



{
	name: "Jumbo Chicken Wrap",
	predicted: 123,
	created: Date()
},
{
	name: "Vegetarian Lasagne",
	predicted: 456,
	created: Date()
},
{
	name: "Chicken Rice Feast",
	predicted: 1230,
	created: Date()
}








Kitched display system page
*/