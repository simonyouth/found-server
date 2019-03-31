const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');

const router = require('./src/routes');
const { mongodUrl } = require('./config');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// 和express.json()作用一样，可不用
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// 解析 application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// 解析客户端的cookie header
app.use(cookieParser());

// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 通过适当地设置 HTTP 头，保护应用程序避免一些众所周知的 Web 漏洞。
app.use(helmet());

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// cookie session结构，保存在客户端里
app.use(session({
  secret: 'found-lost',
  resave: true, // 强制更新 session
  saveUninitialized: false, // 指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid。
  cookie: {
    maxAge: 18000000
  },
  store: new MongoStore({ // 将 session 存储到 mongodb
    url: mongodUrl // mongodb 地址
  })
}));

// 覆盖了接下来的请求
// app.use('/', (req, res, next) => {
//   res.send('hello');
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// router需要放在app.use()其他中间件之后，否则中间件对router生成的路由不会生效
router(app);

module.exports = app;
