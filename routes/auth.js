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
var passport = require('passport');
var authJS = require("../lib/auth.js")

/**
    * Logges the user in using passport.authenticate AND uses the Double Submit Cookies Method for web apps.  This sets cookies
    * @function loginDSCM
    * @async
    * @param {request} req
    * @param {response} res
    * @api POST /api/auth/login
    * @apibody {application/json}
    * @example 
    * <caption>Body structure: </caption>
    * email:<user's email>,
    * password:<user's password>
    * @todo Test application/json
    * @apiresponse {json} Sends Status code of 200.  Sets Cookies for webapp auth
    */

router.post('/login', function(req, res, next) {
    //NORMANY YOUR USER WOULD HAVE A PASSWORD, THOS IS HERE FOR THE DEMO
    req.body.password = "IGNORETHIS";
    next();
}, passport.authenticate('local-login', {
    session: true
}), function loginDSCM(req, res, next) {

    authJS.newJWTForCookies(req.user.id, function(err, jwtData) {
        if(err) {
            return next(err);
        }
        res.cookie('JWT', "JWT " + jwtData.token, {httpOnly: true, signed: true, maxAge: 24 * 60 * 60 * 1000});
        res.cookie('XSRF-TOKEN', jwtData.dscm, {maxAge: 24 * 60 * 60 * 1000});
        res.cookie('ACCOUNT-ID', req.user.id, {maxAge: 24 * 60 * 60 * 1000});
        return res.status(200).json({
            userId: req.user.id
        });
    })
});


router.get('/logout', function(req, res, next){
    req.session = null;
    req.logout();
    res.redirect('/login'); 
})

module.exports = router;