/*
MIT License

Copyright (c) 2017 Joseph Hassell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var express = require('express');
var router = express.Router();
var passport = require("passport")

var messagesJS = require("../lib/messages.js");

/**
* Creates a new global message.  
* @param {Object} req
* @param {Object} req.body
* @param {String} req.body.message - The message sent.
*/

router.post('/global', passport.authenticate('jwt', { session: false}), function(req, res, next) {
  //TODO, get USER ID, PASS IT TO FUNCTION 
  //console.log(req.body)
  messagesJS.newGlobalMessage({fromID: req.user.id, message: req.body.message}).then((resp) => {
  	res.json(resp).status(201);
  }).catch((err) => {
  	return next(err);
  })
});

module.exports = router;