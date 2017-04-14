'use strict';

var express = require('express');

module.exports = function(app){
    
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/client/index.html');
    });
    
    app.get('/login', function(req, res){
        
    });
    
};