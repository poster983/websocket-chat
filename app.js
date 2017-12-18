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
const WebSocket = require('ws');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport')
var cookieSession = require("cookie-session")
var utils = require("./lib/utils.js")
var config = require('config');

require("./lib/passportStrat.js")

var index = require('./routes/index');
var accounts = require('./routes/accounts');
var messages = require('./routes/messages');
var auth = require('./routes/auth');

/** SERVER **/
var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.get('secrets.cookie')));
app.use(cookieSession({
  name: 'session',  
  secret: config.get('secrets.session'),
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
//dscm protection
app.use(utils.dscm)

app.use(passport.initialize());
app.use(passport.session());// persistent login sessions

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/accounts', accounts);
app.use('/messages', messages);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.set("errormessage", encodeURIComponent(err.message));
  res.status(err.status || 500);
  res.render('error');
});

/** Server Stuff **/
var server = require('http').Server(app);
const wss = new WebSocket.Server({ server });

/** WS Routes **/
var messagesWS = require("./routes/websockets/messages");

wss.on('connection', function connection(ws, req) {
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  console.log("User Connected")
  console.log(location)
  

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('received: ' + message);
  });

  ws.send('something');

  /** Initial Routeing.  (Equivalent to app.use('/', index);) **/
  //TODO 
  switch(location.path) {
    case "/messages/global": 
    case "/messages/global/": 
      messagesWS.global(ws, req);
      break;
    default: 
      ws.close()
      break;
  }
  
});

module.exports = {app: app, server: server};
