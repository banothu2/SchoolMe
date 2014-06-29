
/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes/index');
var http = require('http');
var path = require('path');
var braintree = require("braintree");
var Parse = require('parse').Parse;


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

Parse.initialize("gTP2cSOkEsZ6pYdyrxH1STKC8sRCmX2RO5qdMUVa", "balU43Pdd31z1MCiPFrCLvwh2Slwug1A78Ubv8rY");

 
// Routes
app.get('/', function(req, res){
	res.render('login');
});

app.get('/login', function(req, res){
	res.render('login');
})

app.post('/login/data', function(req, res){
	var username = req.body.user
	var password = req.body.pass


	Parse.User.logIn(username, password, {
	  success: function(user) {
	    // Do stuff after successful login.
	    res.render('index');
	  },
	  error: function(user, error) {
	    // The login failed. Check error to see why.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
})

app.get('/register', function(req, res){
	res.render('register');
})

app.post('/register/data', function(req, res){
	var username = req.body.user
	var password = req.body.pass
	var email = req.body.email

	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);
	 
	// other fields can be set just like with Parse.Object
	//user.set("phone", "415-392-0202");
	 
	user.signUp(null, {
	  success: function(user) {
	    // Hooray! Let them use the app now.
	    res.render('login');
	  },
	  error: function(user, error) {
	    // Show the error message somewhere and let the user try again.
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
})

app.get('/login', function(req, res){
	var apples = 2;
	apples++;
	res.send('apples')
})
// Start
// End -- Delete it
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
