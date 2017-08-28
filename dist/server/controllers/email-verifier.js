'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nodemailer = require('nodemailer');
var emailValidator = require('email-validator');
var mailSettings = require('../config/mailer');
var User = require('../models/user');
var domain = require('../config/config').DOMAIN;

var EmailVerifier = function () {
    function EmailVerifier() {
        _classCallCheck(this, EmailVerifier);

        this.transporter = nodemailer.createTransport(mailSettings);
    }

    _createClass(EmailVerifier, [{
        key: 'validateEmail',
        value: function validateEmail(email) {
            return !emailValidator.validate(email);
        }
    }, {
        key: 'sendVerification',
        value: function sendVerification(req, res) {
            console.log('ver');
            if (this.validateEmail(req.body.email)) {
                var verificationUrl = domain + '/verify/' + req.user._id;
                console.log(req);
                this.transporter.sendMail({
                    to: req.user.local.email,
                    subject: 'Verify your account',
                    text: 'Welcome to mmorpg! Use the following link to verify your account: ' + verificationUrl,
                    html: ('<h2>Welcome to mmorpg!</h2>\n                    <p>Click <a href="' + verificationUrl + '">here</a> to verify your account.</p>').replace('\n', '')
                }, function (err, info) {
                    if (err) throw err;
                    res.redirect('/play');
                    //console.log('Message %s sent: %s', info.messageId, info.response);
                });
            } else {
                res.redirect('/login-fail');
            }
        }
    }, {
        key: 'verifyUser',
        value: function verifyUser(req, res) {
            User.findOne({
                "_id": req.params.id
            }, function (err, user) {
                if (err) throw err;
                if (user) {
                    user.verified = true;
                    user.save(function (err) {
                        if (err) throw err;
                        res.redirect('/play');
                    });
                }
            });
        }
    }]);

    return EmailVerifier;
}();

module.exports = new EmailVerifier();