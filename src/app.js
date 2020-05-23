var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const serverless = require('serverless-http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');
var getImagesRouter = require('./routes/getImages');
var getCharRouter = require('./routes/getChar');
var nameRouter = require('./routes/name');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join('./', 'public')));
app.use('/Office', express.static(path.join('./', 'public/OfficeCharSet')));
app.use('/WalkingDead', express.static(path.join('./', 'public/WalkingDeadCharSet')));
app.use('/Brooklyn', express.static(path.join('./', 'public/BrooklynCharSet')));


app.use('/.netlify/functions/app', indexRouter);
app.use('/.netlify/functions/app/users', usersRouter);
app.use('/.netlify/functions/app/testAPI', testAPIRouter);
app.use('/.netlify/functions/app/getImages', getImagesRouter);
app.use('/.netlify/functions/app/getChar', getCharRouter);
app.use('/.netlify/functions/app/name', nameRouter);


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
  res.send('error');
});

module.exports.handler = serverless(app);