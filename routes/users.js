var express = require('express');
var User   = require('./../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});  

module.exports = router;
