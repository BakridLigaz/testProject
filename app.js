var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'bower_components')));

//passport config
var Model = require('./models');
passport.use(new LocalStrategy( function(username, password, done) {
  Model.User.findOne({
    where: {
      'username': username
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Incorrect credentials.' })
    }

    var hashedPassword = bcrypt.hashSync(password, user.salt);

    if (user.password === hashedPassword) {
      return done(null, user)
    }

    return done(null, false, { message: 'Incorrect credentials.' })
  })
}));
passport.serializeUser(function(user, done) {
  done(null, user.id)
});
passport.deserializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  Model.User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id.'))
    }

    done(null, user)
  })
});

app.use("/",routes);
app.use("/login",login);
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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
