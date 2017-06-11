'use strict';
var bcrypt = require('bcrypt');
var PollUser = require("../models/User");
var jwt = require('jsonwebtoken');
require('dotenv').load();

var userController = {};

//Register new user
userController.signupPost = function(req, res){
    var user = {
        username: req.body.username,
        email: req.body.email,
    };
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        user.salt = salt;
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            user.password = hash;
            var pollUser = new PollUser(user);
            pollUser.save(function (err) {
              if (err) {
                var serverResponse = {
                    userSignup: false,
                    message: "User is not created."
                };
                res.setHeader('Content-Type', 'application/json');
                return res.send(JSON.stringify(serverResponse));
              }
              var serverResponse = {
                    userSignup: true,
                    message: "User is created."
                };
                res.setHeader('Content-Type', 'application/json');
                return res.send(JSON.stringify(serverResponse));
            });
        });
    });
};

//User login
userController.loginPost = function(req, res){
    PollUser.findOne({ email: req.body.email }, function (err, pollUser) {
      if (err) return res.send(err);
      if(pollUser) {
        bcrypt.compare(req.body.password, pollUser.password).then(function(booleanRes) {
            if(booleanRes) {
                var user = {
                    id: pollUser.id,
                    username: pollUser.username,
                    email: pollUser.email,
                    agent: req.headers['user-agent'],
                    ipaddress: req.headers['x-forwarded-for']
                };
                var jwtToken = jwt.sign(user, process.env.JWT_SECRET_KEY, {
                    expiresIn: 1800,
                });
                var serverResponse = {
                    loggedIn: true,
                    message: "User is logged in.",
                    token: jwtToken
                };
                res.setHeader('Content-Type', 'application/json');
                return res.send(JSON.stringify(serverResponse));
            } else {
                var serverResponse = {
                    loggedIn: false,
                    message: "Email/Password is not correct.",
                };
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            }
        });
      } else {
            var serverResponse = {
                loggedIn: false,
                message: "User not found.",
            };
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(serverResponse));
      }
    });
};



module.exports = userController;