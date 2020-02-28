const Service = require('egg').Service;

class FocusService extends Service {
  // 获取用户的关注列表和被关注列表
  async getFocusAndFollowers() {
    const { ctx } = this
    const { uid } = ctx.request.query
    try {
      let focus = await ctx.model.models.focus.findAll({
        raw: true,
        where: { uid }
      })
      let followers = await ctx.model.models.followers.findAll({
        raw: true,
        where: { uid }
      })
      let focuserList = await ctx.service.focus.getAllFocuser(focus, uid)
      let followerList = await ctx.service.focus.getAllFollower(followers, uid)
      return {
        status: true,
        code: 0,
        data: {
          focus: focuserList,
          followers: followerList
        }
      }
    } catch (err) {
      return {
        status: false,
        code: 1
      }
    }
  }

  async focusTag() {
    const { ctx } = this
    let body = ctx.request.body
    try {
      let isFocused = await ctx.service.focus.isTagFocus(body.uid, body.tag_name)
      isFocused
      ? await ctx.model.models.focus_tags.destroy({    // 如果已经关注过了, 就取消关注
          where: {
            uid: body.uid,
            tag_name: body.tag_name
          }
       })
      : await ctx.model.models.focus_tags.create(body)  // 如果没关注过，就新增标签关注
      return {
        status: true,
        code: 0,
        message: '关注标签成功'
      }
    } catch (err) {
      throw err
    }
  }

  // 判断标签是否已经关注过了
  async isTagFocus(uid, tag_name) {
    const { ctx } = this
    let res = await ctx.model.models.focus_tags.findAll({
      raw: true,
      where: {
        uid,
        tag_name
      }
    })
    return res.length ? true : false
  }

  async getAllTags() {
    const { ctx } = this
    let { uid } = ctx.request.query
    try {
      let tags = await ctx.model.models.focus_tags.findAll({
        raw: true,
        where: { uid }
      })
      return {
        status: true,
        code: 0,
        tags,
        message: '获取标签成功'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: err
      }
    }
  }

  // 关注一个用户需要插入两条数据
  // 一条是A关注了B
  // 一条是B被A关注了
  async createFocusUser() {
    const { ctx } = this
    const body = ctx.request.body
    try {
      // 如果要关注的用户已存在, 说明是二次点击关注, 此时取消被点击的用户的关注
      if(await ctx.service.focus.isFocuserExist(body.uid, body.focus_id)) {
        await ctx.service.focus.cancelFocus()
        return {
          status: true,
          code: 0,
          message: '取关成功'
        }
      } else {
        await ctx.service.focus.notify_focus()
        await ctx.model.models.focus.create({
          uid: body.uid,
          focus_id: body.focus_id
        })
        await ctx.model.models.followers.create({
          uid: body.focus_id,
          follow_id: body.uid
        })
        return {
          status: true,
          code: 0,
          message: '关注成功'
        }
      }
    } catch (err) {
      return {
        status: false,
        code: 1
      }
    }
  }

  async notify_focus() {
    const { ctx } = this
    let body = ctx.request.body
    await ctx.model.models.notifications.create({
      uid: body.focus_id,
      other_uid: body.uid,
      is_read: false,
      is_focus: true
    })
  }

  // 查找要关注的用户是否已经被关注了
  async isFocuserExist(uid, focus_id) {
    const { ctx } = this
    let isExist = await ctx.model.models.focus.findAll({
      raw: true,
      where: {
        uid,
        focus_id
      }
    })
    return isExist.length ? true : false
  }
  
  // 取消关注
  async cancelFocus() {
    const { ctx } = this
    const body = ctx.request.body
    await ctx.model.models.focus.destroy({
      where: {
        focus_id: body.focus_id
      }
    })
    await ctx.model.models.followers.destroy({
      where: {
        uid: body.focus_id
      }
    })
  }
  
  // 获取所有关注者
  async getAllFocuser(focusList, uid) {
    const { ctx, config } = this
    let list = []
    if(focusList) {
      for(let i = 0; i < focusList.length; i++) {
        let user = await ctx.model.UserInfo.findAll({
          raw: true,
          where: {
            uid: focusList[i].focus_id
          }
        })
        // 给关注者加上一个isFocus字段, 用于前端进行关注或者取消关注的操作
        user[0].isFocus = await ctx.service.focus.isFocuserExist(uid, focusList[i].focus_id)
        list.push(user[0])
      }
      for(let i = 0; i < list.length; i++) {
        list[i].avatar = config.processEnv + '/public/img/' + list[i].avatar
      }
    }
    return list
  }

  // 获取所有被关注者
  async getAllFollower(followerList, uid) {
    const { ctx, config } = this
    let list = []
    if(followerList) {
      for(let i = 0; i < followerList.length; i++) {
        let user = await ctx.model.UserInfo.findAll({
          raw: true,
          where: {
            uid: followerList[i].follow_id
          }
        })
        // 给被关注者加上一个isFocus字段, 用于前端进行关注或者取消关注的操作
        user[0].isFocus = await ctx.service.focus.isFocuserExist(uid, followerList[i].follow_id)
        list.push(user[0])
      }
      for(let i = 0; i < list.length; i++) {
        list[i].avatar = config.processEnv + '/public/img/' + list[i].avatar
      }
    }
    return list
  }
}

module.exports = FocusService