const Service = require('egg').Service;

class NotificationService extends Service {
  async createNotification() {
    const { ctx } = this
    const body = ctx.request.body
    try {
      return {
        status: true,
        code: 0,
        message: '插入通知成功'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: '插入通知失败'
      }
    }
  }

  async getNotification() {
    const { ctx } = this
    const { uid } = ctx.request.query
    let notifications = []
    try {
      let results = await ctx.model.models.notifications.findAll({
        raw: true,
        order: [
          ['create_time', 'DESC']
        ],
        where: { uid }
      })
      if(results.length) {
        for(let i = 0; i < results.length; i++) {
          let userInfo = await ctx.model.models.user_infos.findAll({
            raw: true,
            where: { uid: results[i].other_uid }
          })
          userInfo[0].create_time = results[i].create_time
          userInfo[0].avatar = await ctx.service.formatAvatar.index(userInfo[0].avatar)
          userInfo[0].article_id = results[i].article_id
          userInfo[0].article_title = results[i].article_title
          userInfo[0].isRead = results[i].is_read
          userInfo[0].isPublish = results[i].is_publish
          userInfo[0].isPointReply = results[i].is_point_reply
          userInfo[0].isPointLike = results[i].is_point_like
          userInfo[0].isPointChildReply = results[i].is_point_child_reply
          userInfo[0].isArticleChildReply = results[i].is_article_child_reply
          userInfo[0].isArticleReply = results[i].is_article_reply
          userInfo[0].isArticleLike = results[i].is_article_like
          userInfo[0].isFocus = results[i].is_focus
          userInfo[0].point_id = results[i].point_id
          userInfo[0].point_content = results[i].point_reply_content
          userInfo[0].article_content = results[i].article_reply_content
          userInfo[0].article_be_reply_content = results[i].article_be_reply_content
          userInfo[0].point_be_reply_content = results[i].point_be_reply_content
          notifications.push(userInfo[0])
        }
      }
    } catch (err) {
      throw err
    }
    return {
      status: true,
      code: 0,
      notifications
    }
  }

  // 如果在通知页面点击进入文章, 那么表示已读, 此时将字段is_read改为true
  async isRead() {
    const { ctx } = this
    let body = ctx.request.body
    try {
      await ctx.model.models.notifications.update({
        is_read: true
      }, {
        where: {
          uid: body.uid,
          other_uid: body.other_uid,
          article_id: body.article_id
        }
      })
      return {
        status: true,
        code: 0,
        message: '消息已读'
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = NotificationService