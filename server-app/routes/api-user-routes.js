//Loading modules
var express = require('express');

var router = express.Router();

//Loading controllers
var userController = require('../controllers/user.controller');

//Routes
router.post('/signup', userController.signupPost);
router.post('/login', userController.loginPost);

module.exports = router;