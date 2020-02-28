const Controller = require('egg').Controller;

class ReplysChildController extends Controller {
  async replyChild() {
    const { ctx } = this
    let res = await ctx.service.replyChild.replyChild()
    ctx.body = res
  }
}

module.exports = ReplysChildController