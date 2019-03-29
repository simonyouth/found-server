const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const router = require('./src/routes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

router(app);

app.use();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 通过适当地设置 HTTP 头，保护应用程序避免一些众所周知的 Web 漏洞。
app.use(helmet());
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

app.use(session({
  resave: false, //

}));

app.use('/', (req, res) => {
  res.send('hello')
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
