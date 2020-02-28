const Service = require('egg').Service;

class ArticleService extends Service {
  async index() {
    const { ctx, app } = this
    let { uid, other_uid } = ctx.request.query
    try {
      let articles = await ctx.model.Articles.findAll({
        raw: true,
        order: [
          ['create_time', 'DESC']
        ],
        where: uid ? { uid } : {}
      })
      // 给每个文章加上isLike字段表明用户是否已经点赞过该文赞了
      uid && (uid === other_uid)
      ? await ctx.service.articles.addIsLike(uid, articles)
      : await ctx.service.articles.addIsLike(other_uid, articles)
      return {
        status: true,
        code: 0,
        data: articles,
        message: '获取文章列表成功'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: '获取文章列表失败'
      }
    }
  }

  async addArticles(article_id) {
    const { ctx } = this
    let body = ctx.request.body
    await ctx.model.Articles.create({
      uid: body.uid,
      article_id,
      article_title: body.article_title,
      username: body.username,
      avatar: body.avatar,
      md_content: body.md_content,
      html_content: body.html_content,
      tags: body.tags,
      create_time: body.create_time
    })
    await ctx.service.articles.isByFocused(article_id, body.article_title)    // 该用户是否被别的用户关注了
    return {
      status: true,
      code: 0,
      message: '发布文章成功',
      article_id,
    }
  }

  async isByFocused(article_id, article_title) {
    const { ctx } = this
    let body = ctx.request.body
    let followers = await ctx.model.models.followers.findAll({
      raw: true,
      where: { uid: body.uid }
    })
    if(followers.length) {
      for(let i = 0; i < followers.length; i++) {
        await ctx.model.models.notifications.create({
          uid: followers[i].follow_id,
          other_uid: followers[i].uid,
          article_id,
          article_title,
          tags: body.tags,
          is_read: false,
          is_publish: true,
          create_time: body.create_time
        })
      }
    }
  }

  async editArticle() {
    const { ctx } = this
    let body = ctx.request.body
    let res = await ctx.model.Articles.update({
      article_title: body.article_title,
      md_content: body.md_content,
      html_content: body.html_content,
      tags: body.tags
    }, {
      where: {
        article_id: body.has_article_id
      }
    })
    return {
      status: true,
      code: 0,
      article_id: body.has_article_id,
      message: '修改文章成功'
    }
  }

  async addIsLike(uid, articles) {
    const { ctx } = this
    if(articles.length) {
      for(let i = 0; i < articles.length; i++) {
        let isLike = await ctx.service.articles.isLike(uid, articles[i].article_id)
        isLike ? articles[i].isLike = true : articles[i].isLike = false
      }
    }
  }

  // 给文章点赞
  async likeArticle() {
    const { ctx } = this
    let body = ctx.request.body
    let res
    try {
      if(body.type === 'is_article_like') {  // 文章被点赞，新增通知数据，通知文章作者
        await ctx.service.articles.notify_article_like()
      }
      // 判断文章是否已经点赞过了, 是的话就取消用户对改文章的点赞, 因为一个用户只能对一篇文章点赞一次
      let isLike = await ctx.service.articles.isLike(body.uid, body.article_id)
      if(isLike) {
        await ctx.service.articles.changeSupport(body.article_id, false)   // 点赞数减1
        return await ctx.service.articles.cancelLike(body.uid, body.article_id)
      } else {
        await ctx.model.models.article_likes.create(body)
        await ctx.service.articles.changeSupport(body.article_id, true)   // 点赞数加1
      }
      return {
        status: true,
        code: 0,
        message: '点赞文章'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: '点赞失败'
      }
    }
  }

  async notify_article_like() {
    const { ctx } = this
    let body = ctx.request.body
    await ctx.model.models.notifications.create({
      uid: body.other_uid,
      other_uid: body.uid,
      article_id: body.article_id,
      article_title: body.article_title,
      is_read: false,
      is_article_like: true,
      create_time: body.create_time
    })
  }

  async changeSupport(article_id, flag) {
    const { ctx } = this
    let articles = await ctx.model.models.articles.findAll({
      raw: true,
      where: { article_id }
    })
    let supportNum = flag ? articles[0].support + 1 : articles[0].support - 1
    await ctx.model.models.articles.update({
      support: supportNum
    }, {
      where: { article_id }
    })
  }

  async isLike(uid, article_id) {
    const { ctx } = this
    let res = await ctx.model.models.article_likes.findAll({
      raw: true,
      where: {
        uid,
        article_id
      }
    })
    return res.length ? true : false
  }

  async cancelLike(uid, article_id) {
    const { ctx } = this
    await ctx.model.models.article_likes.destroy({
      where: {
        uid,
        article_id
      }
    })
    return {
      status: true,
      code: 0,
      message: '取消文章点赞'
    }
  }

  async updateAvatar(uid, filename) {
    const { ctx, config } = this
    try {
      await ctx.model.Articles.update({
        avatar: config.processEnv + '/public/img/' + filename
      }, {
        where: {
          uid
        }
      })
    } catch (err) {
      console.log('articles updateAvatar', err)
    }
  }
}

module.exports = ArticleService