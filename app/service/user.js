const Service = require('egg').Service;
const uuid = require('node-uuid');

class UserService extends Service {
  async login() {
    const { ctx, app } = this
    const { username, password } = ctx.request.body
    const user = await ctx.model.User.findOne({
      where: {
        username,
        password
      }
    })
    app.config.jwt.enable = app.config.jwt.enable === false ? true : true
    if(user) {
      let data = user.dataValues
      const token = app.jwt.sign({
        username: data.username,
        timestamp: new Date().getTime()
      }, app.config.jwt.secret, {
        expiresIn: '7200s' // 设置token的有效时间
      })
      return {
        data,
        token
      }
    } else {
      ctx.body = {
        status: false,
        code: 1,
        message: '用户或密码有误, 请重新输入!'
      }
    }
  }

  async register() {
    const { ctx } = this
    const { username, password } = ctx.request.body
    const res = await ctx.model.User.findOne({         // 注册之前先查询该用户是否存在
      where: {username}
    })
    if(res) {
      ctx.body = {
        status: false,
        code: 1,
        message: '该用户名已存在!'
      }
    } else {
      let id = uuid.v1()
      let uid_arr = id.split('-')
      const uid = uid_arr.join('')
      await ctx.model.User.create({
        username,
        password,
        uid
      })
      ctx.body = {
        status: true,
        code: 0,
        uid,
        message: '创建用户成功!'
      }
    }
  }
}

module.exports = UserService