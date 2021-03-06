
const Service = require('egg').Service;
const uuid = require('node-uuid');

class ReplysChildService extends Service {
  // 回复评论
  async replyChild() {
    const { ctx } = this
    let reply = ctx.request.body
    let id = uuid.v1()
    let reply_arr = id.split('-')
    let reply_child_id = reply_arr.join('')
    let replys = []
    let result = {}
    reply.reply_child_id = reply_child_id
    try {
      await ctx.model.models.replys_children.create(reply)
      replys = await ctx.model.models.replys.findAll({                // 先找reply_id
        raw: true,
        where: {
          reply_id: reply.reply_id
        }
      })
      if(reply.article_id) {
        if(reply.type === 'is_article_child_reply') {
          await ctx.service.replyChild.notify_article_reply_child()
        }
        result = await ctx.service.replyChild.replyArticle(replys)
      } else {
        if(reply.type === 'is_point_child_reply') {
          await ctx.service.replyChild.notify_point_reply_child()
        }
        result = await ctx.service.replyChild.replyPoint(replys)
      }
      return result
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: err,
        position: 'service'
      }
    }
  }

  async notify_article_reply_child() {
    const { ctx } = this
    let body = ctx.request.body
    if(body.uid !== body.replyUserUid) {
      await ctx.model.models.notifications.create({
        uid: body.replyUserUid,
        other_uid: body.uid,
        article_id: body.article_id,
        article_reply_content: body.content,
        article_be_reply_content: body.replyUserContent,
        is_article_child_reply: true,
        create_time: body.create_time
      })
    }
  }

  async notify_point_reply_child() {
    const { ctx } = this
    let body = ctx.request.body
    // 相等的时候相当于自己回复自己, 此时不用做通知提醒
    if(body.uid !== body.replyUserUid) {
      await ctx.model.models.notifications.create({
        uid: body.replyUserUid,                               // 被通知的用户
        other_uid: body.uid,                                  // 导致用户被通知的用户
        point_id: body.point_id,
        point_reply_content: body.content,                    // 评论的content
        point_be_reply_content: body.replyUserContent,        // 被评论的content
        is_point_child_reply: true,
        create_time: body.create_time
      })
    }
  }

  async replyPoint(replys) {
    const { ctx } = this
    let points = await ctx.model.models.points.findAll({      // 去replys表中找回复所在的沸点，得到point_id
      raw: true,
      where: {
        point_id: replys[0].point_id
      }
    })
    let replys_num = points[0].replys_num + 1
    await ctx.model.models.points.update({           // 给该沸点的评论数加1， 回复也属于该沸点的评论
      replys_num
    }, {
      where: {
        point_id: replys[0].point_id
      }
    })
    return {
      status: true,
      code: 0,
      message: '回复成功',
      point_id: replys[0].point_id
    }
  }

  async replyArticle(replys) {
    // const { ctx } = this
    // let articles = await ctx.model.models.articles.findAll({
    //   raw: true,
    //   where: {
    //     article_id: replys[0].article_id
    //   }
    // })
    return {
      status: true,
      code: 0,
      message: '回复文章成功',
    }
  }

  async updateAvatar(uid, filename) {
    const { ctx } = this
    await ctx.model.models.replys_children.update({
      avatar: await ctx.service.formatAvatar.index(filename)
    }, {
      where: { uid }
    })
  }
}



module.exports = ReplysChildService