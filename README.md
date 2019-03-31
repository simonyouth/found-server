# 微信小程序lost-and-found服务端

## 环境依赖

- node 
- express ^4.16.4
- mongoose ^5.4.20

## 部署步骤

- 下载安装mongoDB，`mongod --dbpath '数据库路径'`
- `npm install` or `yarn`
- `npm start` or `yarn start`

## 目录

```
+ found-server
  + src
    + db // 表
    + middleware // 中间件
      - request.js // 向微信服务器请求
    + models // 表结构声明
    + public // 静态资源文件
    + routes // 路由
    + views // 视图文件
```

## 使用

- express-session
 
  
        name: 设置cookie中，保存session的字段名称，默认为connect.sid
        store: session的存储方式，默认为存放在内存中，我们可以自定义redis等
        genid: 生成一个新的session_id时，默认为使用uid2这个npm包
        rolling: 每个请求都重新设置一个cookie，默认为false
        resave: 指每次请求都重新设置session cookie，假设你的cookie是6000毫秒过期，每次请求都会再设置6000毫秒。默认为true
        saveUninitialized：强制未初始化的session保存到数据库
        secret: 通过设置的secret字符串，来计算hash值并放在cookie中，使产生的signedCookie防篡改
        cookie : 设置存放sessionid的cookie的相关选项

## 问题

- wx.request的post请求，req.body一直是undefined
 app.js
 `router(app)`应该在app.use(middleware)之后，否则应用不到router里
 即该定义必须写在路由分配之前
 
- users/login
        
        使用`express-session`后，`req.session`直接对session读写，
        客户端通过`header['set-cookie']`获取sessionID,放入header里请求
        保证了sessionID每次都一样，从而保证了登录态