const Service = require('egg').Service;
const uuid = require('node-uuid');

class ReplysService extends Service {
  async replyPoint() {
    const { ctx } = this
    let reply = ctx.request.body
    let id = uuid.v1()
    let reply_arr = id.split('-')
    let reply_id = reply_arr.join('')
    reply.reply_id = reply_id
    // try {
      if(reply.type === 'is_point_reply') {
        await ctx.service.reply.notify_point_reply()
      }
      let result = await ctx.model.models.replys.create(reply)
      let points = await ctx.model.models.points.findAll({
        raw: true,
        where: {
          point_id: reply.point_id
        }
      })
      let replys_num = points[0].replys_num + 1
      await ctx.model.models.points.update({
        replys_num
      }, {
        where: {
          point_id: reply.point_id
        }
      })
      return {
        status: true,
        code: 0,
        message: '评论成功',
        point_id: reply.point_id
      }
    // } catch (err) {
    //   return {
    //     status: false,
    //     code: 1,
    //     message: '评论失败'
    //   }
    // }
  }

  async replyArticle() {
    const { ctx } = this
    let reply = ctx.request.body
    let id = uuid.v1()
    let reply_arr = id.split('-')
    let reply_id = reply_arr.join('')
    reply.reply_id = reply_id
    try {
      console.log(reply, 'replyarticlebody')
      if(reply.type === 'is_article_reply') {
        await ctx.service.reply.notify_article_reply()
      }
      let result = await ctx.model.models.replys.create(reply)
       return {
        status: true,
        code: 0,
        message: '评论文章成功'
       }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: '评论文章失败'
      }
    }
  }

  async notify_article_reply() {
    const { ctx } = this
    let body = ctx.request.body
    await ctx.model.models.notifications.create({
      uid: body.other_articleAuthor_uid,
      other_uid: body.uid,
      article_id: body.article_id,
      article_title: body.article_title,
      article_reply_content: body.content,
      is_read: false,
      is_article_reply: true,
      create_time: body.create_time
    })
  }

  async notify_point_reply() {
    const { ctx } = this
    let body = ctx.request.body
    let pointAuthor = await ctx.model.models.points.findAll({
      raw: true,
      where : { point_id: body.point_id }
    })
    console.log(body, 'notify_point_reply,--------------------------')
    console.log(body.uid, 'body.uid')
    let pointAuthorUid = pointAuthor[0].uid
        console.log(pointAuthorUid, 'pointAuthorUid')
    if(body.uid !== pointAuthorUid) {
      await ctx.model.models.notifications.create({
        uid: pointAuthorUid,
        other_uid: body.uid,
        is_read: false,
        point_id: body.point_id,
        point_reply_content: body.content,
        is_point_reply: true,
        create_time: body.create_time
      })
    }
  }


  // 获取所有评论
  async getAllReply(name, id) {
    const { ctx } = this
    let data = {}
    data = name === 'point_id' ? { point_id: id } : { article_id: id}  // 判断评论的是沸点还是文章
    try {
      let mainReplys = await ctx.model.models.replys.findAll({
        raw: true,
        order: [
          ['create_time', 'DESC']
        ],
        where: data
      })
      // forEach里不支持async/await, for循环可以
      for(let i = 0; i < mainReplys.length; i++) {
        mainReplys[i].comments = await ctx.model.models.replys_children.findAll({
          raw: true,
          order: [
            ['create_time', 'DESC']
          ],
          where: {
            reply_id: mainReplys[i].reply_id
          }
        })
      }
      return {
        status: true,
        code: 0,
        comments: mainReplys,
        message: '获取评论成功'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: err,
        post: 'reply.js'
      }
    }
  }
}

module.exports = ReplysService