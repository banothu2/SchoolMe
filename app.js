
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
	res.redirect('login');
});

app.get('/login', function(req, res){
	res.render('login');
})

app.post('/login/data', function(req, res){
	var username = req.body.user
	var password = req.body.pass


	Parse.User.logIn(username, password, {
	  success: function(user) {

	  	var currentUser = Parse.User.current();
	  	if(currentUser.profileType == 'student'){
	  		res.redirect('/student/profile');
	  	} else {
	  		res.redirect('/investor/profile');
	  	}
	    // Do stuff after successful login.
	}});
})

app.get('/register', function(req, res){
	res.render('register');
})

app.post('/register/data', function(req, res){
	var username = req.body.user
	var password = req.body.pass
	var email = req.body.email
	var profileType = req.body.profileType

	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);
	user.set("profileType", profileType);
	 
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

app.get('/payment', function(res,res){
	res.render('payment');
})

app.post("/create_transaction", function (req, res) {
	console.log(req.body)
  var saleRequest = {
    amount: req.body.amount,
    creditCard: {
      number: req.body.number,
      cvv: req.body.cvv,
      expirationMonth: req.body.month,
      expirationYear: req.body.year
    },
    options: {
      submitForSettlement: true
    }
  };

  gateway.transaction.sale(saleRequest, function (err, result) {
    if (result.success) {
      res.send("<h1>Success! Transaction ID: " + result.transaction.id + "</h1>");
    } else {
      res.send("<h1>Error:  " + result.message + "</h1>");
    }
  });
});

// Start
app.get('/investor/profile', function(req, res){
	var currentUser = Parse.User.current();
	if (currentUser) {
	    res.render('investorProfile')
	} else {
	    // show the signup or login page
	   	res.redirect('/login')

	}
})

app.post('/student/questionnaire', function(req, res){
	var amount = req.body.amount
	var degree = req.body.degree
	var school = req.body.school
	var year = req.body.year
	var major = req.body.major

	console.log('amount = ' + amount);
	console.log('degree = ' + degree);
	console.log('school = ' + school);
	console.log('year = ' + year);
	console.log('major = ' + major);

	if (amount || degree || school || year || major) {
		res.redirect('/student/home');
	} else {
		res.redirect('/student/profile');
	}
})

app.get('/student/home', function(req, res){
	res.render('studentHomePage');
})

app.get('/student/profile', function(req, res){
	res.render('studentProfile');
})

app.get('/student/profile', function(req, res){
	var currentUser = Parse.User.current();
	if (currentUser) {
		res.render('studentProfile')
	} else {
		res.redirect('/login')
	}
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
