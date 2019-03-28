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
