'use strict';
var bcrypt = require('bcrypt');
var PollUser = require("../models/User");
var jwt = require('jsonwebtoken');
require('dotenv').load();

var pollController = {};

//Add new poll to the user profile
pollController.addNewPoll = function(req, res){
    if(!req.body.authToken) {
        var serverResponse = {
            successfulRequest: false,      
            message: "No token provided"
        };
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(serverResponse));
    } else {
        //Token provided, get users polls
        var token = req.body.authToken;
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
            if(err){
                var serverResponse = {
                    successfulRequest: false,      
                    message: "Invalid token"
                };
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            } else {
                var options = req.body.options.split('|');
                PollUser.findOne({ "_id": decoded.id }, function(err, pollUser){
                    if (err) return res.send(err); //Return an error
                    if (!pollUser) return res.send('User not found.'); //User not found error
                    var newPoll = {
                        title: req.body.title,
                        options: []
                    };
                    for(var i = 0; i < options.length; i++) {
                        newPoll.options.push({
                            _id: false,
                            optionName: options[i]
                        });
                    }
                    pollUser.polls.push(newPoll);
                    pollUser.save(function (err, addedPoll) {
                        if (err) {
                            var serverResponse = {
                                successfulRequest: false,      
                                message: "Poll is not added."
                            };
                            res.status(500);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        } else {
                            var serverResponse = {
                                successfulRequest: true,      
                                message: "Poll is added."
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        }
                    });
                });
            }
        });
    }
};

pollController.getAllUsersPolls = function(req, res){
    if(!req.body.authToken) {
        var serverResponse = {
            successfulRequest: false,      
            message: "No token provided"
        };
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(serverResponse));
    } else {
        //Token provided, get users polls
        var token = req.body.authToken;
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
            if(err){
                var serverResponse = {
                    successfulRequest: false,      
                    message: "Invalid token"
                };
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            } else {
                PollUser.findOne({ '_id': decoded.id }, 'polls', function (err, polls) {
                    if (err) return res.send("error");
                    res.setHeader('Content-Type', 'application/json');
                    return res.send(JSON.stringify(polls));
                });
            }
        });
    }
}
pollController.deleteUserPoll = function(req, res) {
    if(!req.query.authToken) {
        var serverResponse = {
            successfulRequest: false,      
            message: "No token provided"
        };
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(serverResponse));
    } else {
        //Token provided, get users polls
        var token = req.query.authToken;
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
            if(err){
                var serverResponse = {
                    successfulRequest: false,      
                    message: "Invalid token"
                };
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            } else {
                var pollID = req.query.id;
                PollUser.findOne({ "_id": decoded.id }, function(err, pollUser){
                    if (err) return res.send(err); //Return an error
                    for(var i = 0; i < pollUser['polls'].length; i++) {
                        if(pollUser['polls'][i]._id == pollID){
                            pollUser['polls'].splice(i, 1);
                            break;
                        }
                    }
                    pollUser.save(function (err, addedPoll) {
                        if (err) {
                            var serverResponse = {
                                successfulRequest: false,      
                                message: "Internal error."
                            };
                            res.status(500);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        } else {
                            var serverResponse = {
                                successfulRequest: true,      
                                message: "Poll has been removed.",
                                removedPollID: pollID
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        }
                    });
                });
            }
        });
    }
}

pollController.editUserPoll = function(req, res) {
    if(!req.body.authToken) {
        var serverResponse = {
            successfulRequest: false,      
            message: "No token provided"
        };
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(serverResponse));
    } else {
        var token = req.body.authToken;
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
            if(err){
                var serverResponse = {
                    successfulRequest: false,      
                    message: "Invalid token"
                };
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            } else {
                PollUser.findOne({ '_id': decoded.id }, function (err, pollUser) {
                    if (err) return res.send("error");
                    var pollID = req.body.pollID;
                    var newTitle = req.body.title;
                    var newOptions = req.body.options.split('|');
                    for(let i = 0; i < pollUser['polls'].length; i++) {
                        if(pollID == pollUser['polls'][i]['_id']) {
                            pollUser['polls'][i].title = newTitle;
                            pollUser['polls'][i].options = [];
                            for(let j = 0; j < newOptions.length; j++) {
                                pollUser['polls'][i].options.push({
                                    _id: false,
                                    optionName: newOptions[j],
                                    optionVote: 0
                                });
                            }
                            pollUser['polls'][i]['voteIP'] = [];
                            break;
                        }
                    }
                    pollUser.save(function (err, edited) {
                        if (err) {
                            var serverResponse = {
                                successfulRequest: false,      
                                message: "Internal error.",
                                error: err
                            };
                            res.status(500);
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        } else {
                            var serverResponse = {
                                successfulRequest: true,      
                                message: "Poll has been edited.",
                            };
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify(serverResponse));
                        }
                    });
                });
            }
        });
    }   
}

pollController.publicGetAll = function(req, res) {
    PollUser.find({}, 'polls', function (err, polls) {
        if (err) return res.send("error");
        var serverResponse = {
            successfulRequest: true,      
            usersWithPolls: polls
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(serverResponse));
    });   
}

pollController.publicGetPoll = function(req, res) {
    PollUser.find({}, 'polls', function (err, result) {
        var pollId = req.params.id;
        var selectedPoll;
        if (err) return res.send("error");
        for(var i = 0; i < result.length; i++) {
            if(result[i]['polls'].length > 0) {
                for(var j = 0; j < result[i]['polls'].length; j++) {
                    if(result[i]['polls'][j]['_id'] == pollId) {
                        selectedPoll = result[i]['polls'][j];
                        break;
                    }
                }
            }
        }
        
        var serverResponse = {
            successfulRequest: true,      
            thePoll: selectedPoll
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(serverResponse));
    });   
}

pollController.vote = function(req, res) {
    var id = req.body.id;
    var option = req.body.option;
    PollUser.findOne({ 'polls._id': id }, function (err, user) {
        if (err) return res.send(err);
        for(var i = 0; i < user.polls.length; i++) {
            if(user.polls[i]['_id'] == id) {
                //Check if IP exist in database, if it exist, vote will not be registered again.
                for(var z = 0; z < user.polls[i].voteIP.length; z++) {
                    if(user.polls[i].voteIP[z].userIp == req.headers['x-forwarded-for']) {
                        //Vote exist, cannot vote again, send response.
                        var serverResponse = {
                            successfulRequest: true,
                            doubleVote: true,
                            message: "You have already voted.",
                        };
                        res.setHeader('Content-Type', 'application/json');
                        return res.send(JSON.stringify(serverResponse));
                    }
                }
                
                //If IP does not exist in database, vote will be registered.
                for(var j = 0; j < user.polls[i].options.length; j++) {
                    if(user.polls[i].options[j].optionName == option) {
                        user.polls[i].options[j].optionVote += 1;
                        break
                    }
                }
                //ADD the IP address
                user.polls[i].voteIP.push({ userIp : req.headers['x-forwarded-for'] });
            }
        }
        user.save(function (err, edited) {
            if (err) {
                var serverResponse = {
                    successfulRequest: false,
                    doubleVote: false,
                    message: "Internal error.",
                    error: err
                };
                res.status(500);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            } else {
                var serverResponse = {
                    successfulRequest: true,  
                    doubleVote: false,
                    message: "Vote is registered.",
                };
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(serverResponse));
            }
        });
    }); 
    
}

module.exports = pollController;