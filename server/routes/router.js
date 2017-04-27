'use strict';

var express = require('express');

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

module.exports = function(passport){
    var router = new express.Router();
    
    router.get('/', function(req, res){
        res.sendFile(__dirname + '/client/index.html');
    });
    
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/login-fail'
    }));
    
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login-fail'
    }));
    
    router.get('/api/user', function(req, res){
        if (req.isAuthenticated()){
            res.json({
                logged_in: true
            });
        } else {
            res.json({
                logged_in: false
            });
        }
    });
	
	return router;
};