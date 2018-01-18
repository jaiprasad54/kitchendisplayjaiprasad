const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.set('port', process.env.port || config.port);

//load required middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, config.clientDir)));
app.use(cors());


//set default error handler
app.use(function(err, req, res, next){
	console.log('error handler');
	if(err){
		console.log(err.stack);
		next(err);
	}
	next();
});

//connect mongodb
var mongooseOptions = {
	useMongoClient: true,
	//autoIndex: false
}
var db = mongoose.connect('mongodb://'+config.db.host+':'+config.db.port+'/'+config.db.dbname, mongooseOptions);

mongoose.Promise = global.Promise;

//connection handler for new socket client
io.on('connection', function(client){
	console.log('new client connected', typeof client);
});

//register socket.io object in request object by setting up in middleware
app.use(function(req, res, next){
	console.log('setting request io', typeof io);
	req.io = io;
	next();
});


var ordersRouter = require('./routes/orders');
app.use(config.apiRoot+'/orders', ordersRouter);


//load routers
var productsRouter = require('./routes/products');
app.use(config.apiRoot+'/products', productsRouter);

var usersRouter = require('./routes/users');
app.use(config.apiRoot+'/users', usersRouter);

app.set('json spaces', 2);

//start server
server.listen(app.get('port'), function(server){
	console.log('server started on', 'http://localhost:'+app.get('port')+"/")
});