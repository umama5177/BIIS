var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser');
var session=require('express-session');

var indexRouter = require('./routes/index');
var contact = require('./routes/contact_route');
var grade = require('./routes/grade');
var registration = require('./routes/registration');
var admin=require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/contact_info/', contact);
app.use('/registration/', registration);
app.use('/grade/', grade);
app.use('/admin',admin);

app.locals.format=function(number){
  var num=number.toFixed(2);
  return num;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave : true
}));
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
