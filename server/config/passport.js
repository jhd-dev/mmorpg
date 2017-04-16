'use strict';

var LocalStrategy = require('passport-local').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, username, password, done){
		process.nextTick(function(){console.log('sign up');
			User.findOne({
				'local.username': username
			}, function(err, user){
				if (err) return done(err);

				if (user) {
					return done(null, false);
				} else {console.log('new user');
					var newUser = new User();
					newUser.local.username = username;
					newUser.local.password = newUser.generateHash(password);
					newUser.local.email = '';
					newUser.x = 0;
					newUser.y = 0;
					newUser.save(function(err){
						if (err) throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
