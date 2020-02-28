const Controller = require('egg').Controller;

class RegisterController extends Controller {
  async index() {
    const { ctx } = this
    await ctx.service.user.register()
  }
}

module.exports = RegisterController;