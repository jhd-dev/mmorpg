'use strict';

var mongoose = require('mongoose');

var Users = new mongoose.Schema({
    name: String,
});

module.exports = mongoose.model('Users', Users);