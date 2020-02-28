/**
 * enable为true表示插件被开启了, 此时enable为true的插件会被挂在到app下的middlewares属性中
 */

exports.cors = {
  enable: true,
  package: 'egg-cors'
}

exports.jwt = {
  enable: true,
  package: 'egg-jwt'
}

exports.passport = {
  enable: true,
  package: 'egg-passport'
}

exports.mysql = {
  enable: true,
  package: 'egg-mysql'
}

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}

exports.multipart = {
  enable: true,
  package: 'egg-multipart'
}

exports.oss = {
  enable: true,
  package: 'egg-oss'
}