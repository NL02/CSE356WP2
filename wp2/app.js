var createError = require('http-errors');
var express = require('express');
// var session = require('cookie-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// mongodb atlas connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://tictactoeGM:4JozKPHtsYTvTY6j@tictactoe.zbjog.mongodb.net/tictactoe?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var indexRouter = require('./routes/index');
var adduserRouter = require('./routes/adduser')
var verifyRouter = require('./routes/verify')
var loginRouter = require('./routes/login')
var logoutRouter = require('./routes/logout')
var playRouter = require('./routes/play')
var listRouter = require('./routes/listgames')
var gameRouter = require('./routes/getgame')
var scoreRouter = require('./routes/getscore')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// creating the session middleware options
const oneDay = 1000 * 60 * 60 * 24 

// app.use(session({
//   name: 'session',
//   keys: ['key1', 'key2']
// }))

app.use('/', indexRouter);
app.use('/adduser', adduserRouter)
app.use('/verify', verifyRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/ttt/play', playRouter)
app.use('/listgames', listRouter)
app.use('/getgame', gameRouter)
app.use('/getscore', scoreRouter)

//  app.use(function(req, res, next) {  
//       res.header('Access-Control-Allow-Origin', req.headers.origin);
//       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//       next();
//  });  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
