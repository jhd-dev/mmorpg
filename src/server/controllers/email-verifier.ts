'use strict';

var nodemailer = require('nodemailer');
var emailValidator = require('email-validator');
var mailSettings = require('../config/mailer');
var User = require('../models/user');
var domain = require('../config/config').DOMAIN;

class EmailVerifier {
    
    constructor(){
        this.transporter = nodemailer.createTransport(mailSettings);
    }
    
    validateEmail(email){
        return !emailValidator.validate(email);
    }
    
    sendVerification(req, res){console.log('ver');
        if (this.validateEmail(req.body.email)){
            var verificationUrl = domain + '/verify/' + req.user._id;console.log(req);
            this.transporter.sendMail({
                to: req.user.local.email,
                subject: 'Verify your account',
                text: `Welcome to mmorpg! Use the following link to verify your account: ${verificationUrl}`,
                html: `<h2>Welcome to mmorpg!</h2>
                    <p>Click <a href="${verificationUrl}">here</a> to verify your account.</p>`.replace('\n', '')
            }, (err, info) => {
                if (err) throw err;
                res.redirect('/play');
                //console.log('Message %s sent: %s', info.messageId, info.response);
            });
        } else {
            res.redirect('/login-fail');
        }
    }
    
    verifyUser(req, res){
        User.findOne({
            "_id": req.params.id
        }, (err, user) => {
            if (err) throw err;
            
            if (user){
                user.verified = true;
                user.save(err => {
                    if (err) throw err;
                    res.redirect('/play');
                });
            }
        });
    }
    
}

module.exports = new EmailVerifier();
