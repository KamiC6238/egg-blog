const Controller = require('egg').Controller;

// 如果是get请求, 就通过this.ctx.query来获取参数
// 如果是post请求, 就通过this.ctx.request.body来获取参数
class LoginController extends Controller {
  async index() {
    const { ctx } = this
    let obj = await ctx.service.user.login() // 调用服务
    if(obj.data) {
      await ctx.service.userInfo.setUserInfo(obj.data)
      await ctx.service.userInfo.getUserInfo(obj.data.uid, obj.token)
    } 
  }
}

module.exports = LoginController;