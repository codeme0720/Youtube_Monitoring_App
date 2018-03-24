
var express = require('express');
var app = express();
var port =  1997;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017/yoyostyle', (err, database) => {
  // ... start the server
  console.log("mongo db started ");
//  console.log(database);
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

require('./app/routes.js')(app);
app.listen(port);
console.log('Server running on port: ' + port);
