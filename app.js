
/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes/index');
var http = require('http');
var path = require('path');
var braintree = require("braintree");



var app = express();

// all environments
app.use(express.cookieParser());
app.use(express.session({secret: 'bananatime'}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "939n6gnvngxrspvk",
  publicKey: "q9jbkz2y3dyfypdk",
  privateKey: "0fd62d0c4abfb0ac40d99724aae2553f"
});


// Routes
app.get('/', function(req, res){
	res.render('login');
});

app.get('/login', function(req, res){
	var apples = 2;
	apples++;
	res.send('apples')
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
