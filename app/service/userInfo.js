const Service = require('egg').Service;

class PersonalService extends Service {
  // 如果用户的信息已存在于数据库中, 则无需创建新的记录
  async setUserInfo(user = null) {
    const { ctx, app } = this
    let uid = user === null ? ctx.request.body.uid : user.uid
    let res = await ctx.model.UserInfo.findOne({
      where: { uid }
    })
    if(!res) {
      await ctx.model.UserInfo.create({
        username: user.username,
        uid
      })
    }
  }

  async getUserInfo(_uid, token) {
    const { ctx, config } = this
    let uid = _uid === undefined ? ctx.request.query.uid : _uid
    // 查不到会返回null
    let res = await ctx.model.UserInfo.findOne({
      where: { uid }
    })
    if(res) {
      const { username, post, company, avatar, intro, personal_page } = res
      ctx.body = {
        status: true,
        code: 0,
        userInfo: {
          username,            // 用户名
          uid,                 // 用户的唯一标识
          avatar: config.processEnv + '/public/img/' + avatar,             // 头像链接
          post,                // 职位
          company,             // 公司
          intro,               // 个人介绍
          personal_page,       // 个人主页
          articleNums: null,   // 发布的文章的数量
          supportNums: null,    // 点赞数量
          token,
        }
      }
    } else {
      ctx.body = {
        status: false,
        code: 1
      }
    }
  }

  async upload(filename, uid) {
    const { ctx } = this
    await ctx.model.UserInfo.update({
      avatar: filename
    }, {
      where: { uid }
    })
  }

  async editUserInfo() {
    const { ctx } = this
    const { uid, username, post, company, intro, personal_page } = ctx.request.body
    await ctx.model.UserInfo.update({
      username,
      post,
      company,
      intro,
      personal_page
    }, {
      where: { uid }
    })
    await ctx.service.updateAllTableUserInfo.index()
    ctx.body = {
      status: true,
      code: 0,
      message: '编辑个人资料成功。'
    }
  }

  async updateAvatar(uid, filename) {
    const { ctx } = this
    try {
      await ctx.model.Articles.update({
        avatar: filename
      }, {
        where: { uid }
      })
    } catch (err) {
      console.log('userInfo updateAvatar', err)
    }
  }
}

module.exports = PersonalService