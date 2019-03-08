// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;

/**
 1、对于path中的变量，均可以使用req.params.xxxxx方法
 2、对于get请求的?xxxx=,使用req.query.xxxxx方法
 3、对于post请求中的变量，使用req.body.xxxxx方法
 4、以上三种情形，均可以使用req.param()方法，
    所以说req.param()是req.query、req.body、以及req.params获取参数的三种方式的封装。

 */

module.exports = (app) => {
  app.use('/users', require('./users'))
};