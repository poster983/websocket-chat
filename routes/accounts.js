var express = require('express');
var router = express.Router();

var accountsJS = require("../lib/accounts.js");

/**
* Creates a new user account  
* @param {Object} req
* @param {Object} req.body
* @param {String} req.body.username - The username of the account.
*/
router.post('/', function(req, res, next) {
  accountsJS.new({username: req.body.username}).then((resp) => {
  	res.json(resp).status(201);
  }).catch((err) => {
  	return next(err)
  })
});

module.exports = router;
