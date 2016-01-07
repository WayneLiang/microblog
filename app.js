var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');


var settings = require('./settings');
var routes = require('./routes/index');
var users = require('./routes/users');
var reg = require('./routes/reg');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(function(req,res,next){
  res.locals.user = req.session.user;
  //res.locals.post = req.session.post;
  var error = req.flash('error');
  res.locals.error = error.length?error:null;

  var success = req.flash('success');
  res.locals.success = success.length?success:null;

  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/reg', reg);
app.use('/login', login);
app.use('/logout', logout);
app.use('/post', post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
