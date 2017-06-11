//Loading modules
var express = require('express');

var router = express.Router();

//Loading controllers
var pollController = require('../controllers/poll.controller');

//Routes
router.post('/new', pollController.addNewPoll);
router.post('/all', pollController.getAllUsersPolls);
router.post('/edit', pollController.editUserPoll);
router.delete('/all', pollController.deleteUserPoll);
router.get('/public/all', pollController.publicGetAll);
router.get('/public/all/:id', pollController.publicGetPoll);
router.post('/public/vote', pollController.vote);

module.exports = router;