'use strict';

var express = require('express');
var path = require('path');
var emailVerifier = require('../controllers/email-verifier');

module.exports = function(passport){
    var router = new express.Router();
    
    router.get('/', function(req, res){
        res.sendFile(path.resolve(__dirname + '/../../client/views/index.html'));
    });
    
    router.get('/about', function(req, res){
        res.sendFile(path.resolve(__dirname + '/../../client/views/about.html'));
    });
    
    router.get('/play', (req, res) => {
        if (req.isAuthenticated()){
            res.sendFile(path.resolve(__dirname + '/../../client/views/game.html'));
        } else {
            res.redirect('/');
        }
    });
    
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/verify',
        failureRedirect: '/login-fail'
    }));

    router.get('/verify', (req, res) => emailVerifier.sendVerification.bind(emailVerifier)(req, res));
    
    router.get('/verify/:id', (req, res) => emailVerifier.verifyUser(req, res));
    
    router.get('/login', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../../client/views/login.html'));
    });
    
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/play',
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
