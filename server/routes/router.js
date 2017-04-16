'use strict';

var bodyParser = require('body-parser');
var User = require('../models/user');

module.exports = function(app, passport){
    
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/client/index.html');
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/fail'
    }));
    
    app.get('/login', function(req, res){
        User.findOne({
            username: req.body.username,
            password: req.body.password
        }, function(err, user){
            if (err) throw err;
        });
    });
    
    app.get('/auth/local', function(req, res){
        
    })
    
    function isLoggedIn (target){
		var redirect = '/login' + (target ? "?target=" : "");
		return function(req, res, next) {
			if (req.isAuthenticated()) {
				return next();
			} else {
				res.redirect(redirect);
			}
		};
	}
};