var express = require('express');
var router = express.Router();
var checkAuth = require('connect-ensure-login');

var accountsJS = require("../lib/accounts.js");
/* GET home page. */
router.get('/', checkAuth.ensureLoggedIn('/login'), function(req, res, next) {
  res.render('index', { title: 'Websocket Chat App', user: req.user});
});

router.get("/login", function(req, res, next) {
	accountsJS.get().then((accounts) => {
		res.render('login', { title: 'Websocket Chat App Login', accounts: accounts});
	}).catch((err) => {return next(err);})
	
})
module.exports = router;
