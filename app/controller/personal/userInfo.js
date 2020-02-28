const Controller = require('egg').Controller;
const fs = require('mz/fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')

class PersonalController extends Controller {
  async getUserInfo() {
    const { ctx } = this
    await ctx.service.userInfo.getUserInfo()
  }

  async setUserInfo() {
    const { ctx } = this
    await ctx.service.userInfo.setUserInfo()
  }

  async editUserInfo() {
    const { ctx } = this
    await ctx.service.userInfo.editUserInfo()
  }

  async uploadAvatar() {
    const { ctx } = this
    const file = ctx.request.files[0]
    console.log(ctx.oss, 'oss')
    console.log(file, 'file')
    const name = 'egg-multipart-test/' + path.basename(file.filename)
    let result
    try {
      result = await ctx.oss.put(name, file.filepath)
    } finally {
      ctx.cleanupRequestFiles()
    }

    // try {
    //   // let result = await ctx.service.userInfo.uploadAvatar()
    // } catch (err) {
    //   await sendToWormhole(stream)
    //   throw err
    // }
    ctx.body = {
      status: true,
      code: 0,
      url: result.url,
      requestBody: ctx.request.body
    }
  }
}

module.exports = PersonalController