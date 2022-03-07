var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var amqp = require('amqplib/callback_api');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var listenRouter = require('./routes/listen');
var speakRouter = require('./routes/speak')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/listen', listenRouter);
app.use('/speak', speakRouter);


// amqp.connect('amqp://abc:123@localhost', function (err, conn) {
//   conn.createChannel(function (err, ch) {
//     var direct_exchange = "hw3";

//     ch.assertExchange(direct_exchange, 'direct', { durable: true });
//     console.log("Make sure hw3 exchange exists")
//   });
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;