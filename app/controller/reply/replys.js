const Controller = require('egg').Controller;

class ReplysController extends Controller {
  // 评论沸点
  async replyPoint() {
    const { ctx } = this
    let res = await ctx.service.reply.replyPoint()
    ctx.body = res
  }

  // 评论文章
  async replyArticle() {
    const { ctx } = this
    let res = await ctx.service.reply.replyArticle()
    ctx.body = res
  }

  async getAllReply() {
    const { ctx } = this
    let { point_id, article_id } = ctx.request.query
    let res = {}
    if(point_id) {
      res = await ctx.service.reply.getAllReply('point_id', point_id)
    } else if(article_id) {
      res = await ctx.service.reply.getAllReply('article_id', article_id)
    }
    ctx.body = res
  }
}

module.exports = ReplysController