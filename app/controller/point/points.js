const Controller = require('egg').Controller;
const fs = require('mz/fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')

class PointsController extends Controller {
  // 新增沸点
  async createPoint() {
    const { ctx }  = this
    let res = await ctx.service.point.createPoint()
    ctx.body = res
  }

  // 返回所有沸点
  async getAllPoints() {
    const { ctx } = this
    let res = await ctx.service.point.getAllPoints()
    ctx.body = res
  }

  async likePoint() {
    const { ctx } = this
    let res = await ctx.service.point.likePoint()
    ctx.body = res
  }

  async getSingle() {
    const { ctx } = this
    let res = await ctx.service.point.getSingle()
    ctx.body = res
  }

  // 删除沸点
  async deletePoint() {
    const { ctx } = this
    ctx.body = {
      status: true,
      code: 0,
      message: '删除成功!'
    }
  }
}

module.exports = PointsController