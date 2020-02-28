const Controller = require('egg').Controller;

class FocusController extends Controller {
  // 获取关注者和被关注者的数量
  async getFocusAndFollowers() {
    const { ctx } = this
    let res = await ctx.service.focus.getFocusAndFollowers()
    ctx.body = res
  }

  // 新增关注
  async createFocusUser() {
    const { ctx } = this
    let res = await ctx.service.focus.createFocusUser()
    ctx.body = res
  }

  // 关注标签
  async focusTag() {
    const { ctx } = this
    let res = await ctx.service.focus.focusTag()
    ctx.body = res
  }

  async getAllTags() {
    const { ctx } = this
    let res = await ctx.service.focus.getAllTags()
    ctx.body = res
  }

  // 判断一个用户是否关注了另一个用户
  async isUserFocus() {
    const { ctx } = this
    const { uid, uid_1 } = ctx.request.body
    let res
    try {
      res = await ctx.service.focus.isFocuserExist(uid_1, uid)
      ctx.body = {
        status: true,
        code: 0,
        isFocus: res
      }
    } catch (err) {
      ctx.body = {
        status: false,
        code: 1
      }
    }
  }
}

module.exports = FocusController