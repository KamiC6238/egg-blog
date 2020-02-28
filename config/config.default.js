
// exports.keys = 'danzzzz is awesome';

// // 如果csrf为true 接口返回403 并且提示See https://eggjs.org/zh-cn/core/security.html#安全威胁csrf的防范
// exports.security = {
//   csrf: false
// };

// exports.jwt = {
//   secret: 'danzzzz is awesome'
// };

// exports.mysql = {
//   client: {
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: 'fuermosi159',
//     database: 'egg-blog'
//   },
//   app: true,
//   agent: false
// }

// exports.sequelize = {
//   dialect: 'mysql',
//   host: 'localhost',
//   port: 3306,
//   database: 'egg-blog',
//   username: 'root',
//   password: 'fuermosi159'
// }

// // 如果请求的content-type是multipart/form-data类型的
// // 1. cnpm install egg-multipart --save-dev
// // 2. 在plugin.js中使用egg-multipart插件
// // 3. 配置下面的代码
// // 4. 此时可以通过ctx.request.body获取FormData中的文件之外的数据
// //      也可以通过ctx.request.files获取所有的文件数据, 比如图片
// exports.multipart = {
//   mode: 'file',
//   fields: 50,
//   fileSize: '10mb'
// }
const path = require('path')
const os = require('os')

module.exports = appInfo => {
  const config = exports = {
    processEnv: 'http://localhost:7001',
    keys: 'danzzzz is awesome',
    security: {
      csrf: false
    },
    jwt: {
      secret: 'danzzzz is awesome'
    },
    mysql: {
      client: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'fuermosi159',
        database: 'egg-blog'
      },
      app: true,
      agent: false
    },
    sequelize: {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'egg-blog',
      username: 'root',
      password: 'fuermosi159'
    },
    multipart: {
      mode: 'stream',     // 如果mode为file, 那么使用ctx.getFileStream时会报错, 提示multipart不能被consumed两次
      fields: 10,
      fieldSize: '10mb',
    },
    bodyParser: {
      formLimit: '1000000kb',
      jsonLimit: '10mb',
      textLimit: '10mb'
    }
  }
  return config
}