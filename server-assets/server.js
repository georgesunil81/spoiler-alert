var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/spoiler-alert');

var User = require('./models/User');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { 
      	return done(err);
      }
      if (!user) { 
      	return done(null, false); 
      }
      user.verifyPassword(password).then(function(result) {
      	if (!result) {
      		return done(null, false); 
      	}
      	return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
	// if we needed req.user.verifyPassword some day...
	// User.findById(obj._id).exec().find(user) {
	// 	done(null, user);
	// }
});

var app = express();
app.use(session({
	secret: 'THISis AMZING THE FRCE IS WITH US'
}));
app.use(bodyParser.json());
// you could use this to lock down some front end assets...
// app.use(function(req, res, next) {
// 	console.log(req.path);
//   if(req.user == null && req.path.indexOf('/secure') === 0)
//   {
//     return res.redirect('/#/login');
//   }
//   next(); 
// });
app.use(express.static(__dirname+'/../public'));
app.use(passport.initialize());
app.use(passport.session());

var requireAuth = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).end();
	}
	next();
};

var requireRole = function(user, role) {
	if (user.roles.indexOf(role) > -1) {
		return true;
	}
	return false;
};

var requireAdmin = function(req, res, next) {
	if (!requireRole(req.user, 'admin')) {
		return res.status(403).end();
	}
	next();
}
var requireModerator = function(req, res, next) {
	if (!requireRole(req.user, 'moderator')) {
		return res.status(403).end();
	}
	next();
}

app.get('/api/users/currentUser', requireAuth, function(req, res) {
	return res.json(req.user);
});

//registration
app.post('/api/users', function(req, res) {
	User.findOne({ username: req.body.username }).exec().then(function(user) {
		if (user) {
			return res.status(409).end();
		}
		user = new User({
			username: req.body.username,
			password: req.body.password
		});
		user.save().then(function() {
			return res.status(201).end();
		});
	});
});
//login
app.post('/api/auth/local', passport.authenticate('local'), function(req, res) {
	return res.status(200).end();
});
app.get('/api/auth/logout', function(req, res) {
	req.logout();
	return res.status(200).end();
});


app.delete('/api/users/spoilers', requireAuth, requireModerator, function(req, res) {
	//delete logic here
});


app.listen(8888);