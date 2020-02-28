const Controller = require('egg').Controller;

class NotificationController extends Controller {
  async createNotification() {
    const { ctx } = this
    let res = await ctx.service.notification.createNotification()
    ctx.body = res
  }

  async getNotification() {
    const { ctx } = this
    let res = await ctx.service.notification.getNotification()
    ctx.body = res
  }

  async isRead() {
    const { ctx } = this
    let res = await ctx.service.notification.isRead()
    ctx.body = res 
  }
}

module.exports = NotificationController