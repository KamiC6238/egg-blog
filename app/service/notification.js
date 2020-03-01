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
          let notification = Object.assign(results[i], userInfo[0])
          notification.avatar = await ctx.service.formatAvatar.index(notification.avatar)
          notifications.push(notification)
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
        where: body.is_tags ? {
          uid: body.uid,
          article_id: body.article_id, 
          is_tags: body.is_tags
        } : {
          uid: body.uid,
          other_uid: body.other_uid,
          article_id: body.article_id,
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