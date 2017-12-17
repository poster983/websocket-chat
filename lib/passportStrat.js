var jwt = require('jsonwebtoken');
var config = require('config');
var r = require("./db.js").r();
var passport = require("passport")
var LocalStrategy   = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var utils = require('./utils.js');

passport.serializeUser(function(user, done) {
  if(Array.isArray(user)) {
    done(null, user[0].id);
  } else {
    done(null, user.id);
  }
  //console.log(user);
});

passport.deserializeUser(function(id, done) {
     r.table("accounts").get(id).run(function(err, user) {
    	done(err, user);
  	});
});

/*Local  PASSPORT.js auth*/
passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: null,
    passReqToCallback: true
    },
  function(req, username, password, done) {
    r.table("accounts").filter({
        "username": username
    }).run(function(err, accounts){
      if (err) {
        return done(err)
      }
      if(accounts.length == 1) {
      	return done(null, accounts[0]);
      } else {
      	return done(null, false);
      }
    });
  }
));

/**
  JSON Web Token Auth for API 
**/

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT"); // Header: "Authorization"
opts.secretOrKey = config.get('secrets.JWT');


//TODO: Reissue a new JWT if it has been 10 min from last reissuing 
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

  r.table('accounts').get(jwt_payload.id).run(function(err, doc) {
    if (err) {
      return done(err); 
    } else if(doc) {
      return done(null, doc);
    } else {
      return done(null, false);
    }
    
  });
}));