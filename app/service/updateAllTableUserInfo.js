const Service = require('egg').Service

/**
 * 因为部分表的一些字段是跟用户的个人信息有关的，比如头像，用户名，职位，公司，因此在个人信息页面进行修改的时候，
 * 要对其他跟这些字段有关系的表也一起改了，不然数据会不一致
 */

class UpdateUserInfo extends Service {
  async index() {
    const { ctx } = this
    let body = ctx.request.body
    try {
      await ctx.service.updateAllTableUserInfo.updateTableArticles(ctx, body)
      await ctx.service.updateAllTableUserInfo.updateTablePoints(ctx, body)
      await ctx.service.updateAllTableUserInfo.updateTableReplys(ctx, body)
      await ctx.service.updateAllTableUserInfo.updateTableReplysChildren(ctx, body)
    } catch (err) {
      throw err
    }
  }

  async updateTableArticles(ctx, body) {
    await ctx.model.models.articles.update({
      username: body.username,
    }, {
      where: { uid: body.uid }
    })
  }

  async updateTablePoints(ctx, body) {
    await ctx.model.models.points.update({
      username: body.username,
      post: body.post,
      company: body.company
    }, {
      where: { uid: body.uid }
    })
  }

  async updateTableReplys(ctx, body) {
    await ctx.model.models.replys.update({
      username: body.username,
      post: body.post,
      company: body.company
    }, {
      where: { uid: body.uid }
    })
  }

  async updateTableReplysChildren(ctx, body) {
    await ctx.model.models.replys_children.update({
      username: body.username,
      post: body.post,
      company: body.company
    }, {
      where: { uid: body.uid }
    })
  }
}

module.exports = UpdateUserInfo

