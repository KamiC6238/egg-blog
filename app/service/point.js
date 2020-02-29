const Service = require('egg').Service;
const fs = require('mz/fs');
const path = require('path')
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write
const awaitReadStream = require('await-stream-ready').read
const uuid = require('node-uuid');

// 多文件上传, 使用ctx.multipart()

/**
 * ctx.getFileStream() 是针对单文件上传的
 * ctx.multipart() 是针对多文件上传的
 *
 * @parts 一个异步函数， 通过await parts()可以拿到表单中的数据, 但每次只能取一个字段的数据, 有点像yield,可以多次调用直到为undefined
 * @part 是await parts() 每次yield(猜测的)返回的数组，数组包含该字段的key以及value, part[0]是key, part[1]是value
 * @part 除了是包含字段的数组，还可以是一个file, 如果是file类型的数据, 那么必须在流关闭后才会结束请求返回响应
 */
class PointsService extends Service {
  async createPoint() {
    const { ctx, config, app } = this
    const parts = ctx.multipart()
    let part
    let point = {}
    point.image_cache = ''                    // 缓存图片的字段
    while((part = await parts())) {
      if(part && part.length) {
        point[part[0]] = part[1]              // 组装插入数据库的数据
      } else {
        if (part && !part.filename) {
          continue;
        }
        if(part) {
          const filename = Math.random().toString(36).substr(2) + new Date().getTime() + path.extname(part.filename).toLocaleLowerCase();
          const target = path.join(config.baseDir, 'app/public/img', filename);
          const writeStream = fs.createWriteStream(target)
          try {
            await awaitWriteStream(part.pipe(writeStream))
            point['image_cache'] += config.processEnv + '/public/img/' + filename + ','
          } catch(err) {
            await sendToWormhole(part);
            throw err;
          }
        }
      }
    }
    try {
      let id = uuid.v1()
      let point_arr = id.split('-')
      let point_id = point_arr.join('')
      point.point_id = point_id
      let res = await ctx.model.models.points.create(point)
      return {
        status: true,
        code: 0,
        message: '发布成功!'
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: '发布失败!'
      }
    }
  }

  async getAllPoints() {
    const { ctx, config, app } = this
    const { uid, other_uid, type, isLog } = ctx.request.query    // 这里的uid是用来获取登录用户点赞了哪些沸点用的
    let avatar = ''
    try {
      let res = await ctx.service.point.allPoints(uid, type, isLog)
      uid === other_uid
      ? await ctx.service.point.formatPoints(uid, res)
      : await ctx.service.point.formatPoints(other_uid, res)
      return {
        status: true,
        code: 0,
        points: res,
      }
    } catch(err) {
      return {
        status: false,
        code: 1,
        message: err
      }
    }
  }

  async formatPoints(uid, res, isLog) {
    const { ctx } = this
    for(let index = 0; index < res.length; index++) {
      res[index].avatar = await ctx.service.point.getAvatar(res[index].uid)
      if(res[index].image_cache === '') {
        res[index].image_cache = []
      } else {
        let imageList = []
        let arr = res[index].image_cache.split(',')
        arr.forEach(item => {
          if(item !== '') {
            imageList.push(item)
          }
        })
        res[index].image_cache = imageList
      }
      res[index].isShowComments = false      // 给前端用于展示关闭评论区
      res[index].comments = []               // 给一个默认的评论列表为空
      res[index].isLike = isLog ? await ctx.service.point.isLikePoint(uid, res[index].point_id) : false    // 判断该沸点是否点赞过
      res[index].isFocus = isLog ? await ctx.service.focus.isFocuserExist(uid, res[index].uid) : false     // 判断该用户是否关注了发布沸点的这个用户
    }
  }

  async isLikePoint(uid, point_id) {
    const { ctx } = this
    let res = await ctx.model.models.likes.findAll({
      where: {
        uid,
        point_id
      }
    })
    return res.length ? true : false
  }

  async allPoints(uid, type, isLog) {
    const { ctx } = this
    return await ctx.model.models.points.findAll({
      raw: true,
      order: [
        ['create_time', 'DESC']
      ],
      where: (uid && (type === 'all')) || ((isLog === 'false') && (type === 'all')) ? {} : { uid }
    })
  }

  async getAvatar(uid) {
    const { ctx, config } = this
    let avatar
    let result = await ctx.model.UserInfo.findAll({
      raw: true,
      where: {
        uid
      }
    })
    avatar = config.processEnv + '/public/img/' + result[0].avatar
    return avatar
  }

  async likePoint() {
    const { ctx } = this
    const body = ctx.request.body
    try {
      // 先判断用户是否点赞过该沸点
      let findRes = await ctx.service.point.getSingleLike(body.uid, body.point_id)
      if(findRes.length) {
        // 如果已经点赞过了，那么再点一次就是取消点赞
        await ctx.service.point.removeLike(body.uid, body.point_id)      // 将点赞表中对该沸点的点赞记录删除
        let likes = await ctx.service.point.downLikes(body.uid, body.point_id)             // 获取该沸点的当前点赞数
        await ctx.service.point.updateSinglePoint(likes, body.point_id)  // 将沸点表中对应的沸点的点赞数减1
        return {
          status: true,
          code: 0,
          message: '取消点赞'
        }
      } else {
        if(body.type === 'is_point_like') {  // 沸点被点赞，新增通知数据，沸点文章作者
          await ctx.service.point.notify_point_like()
        }
        await ctx.model.models.likes.create(body)
        let likes = await ctx.service.point.upLikes(body.uid, body.point_id)
        await ctx.service.point.updateSinglePoint(likes, body.point_id)
        return {
          status: true,
          code: 0,
          message: '点赞成功'
        }
      }
    } catch (err) {
      return {
        status: false,
        code: 1,
        message: err
      }
    }
  }

  async notify_point_like() {
    const { ctx } = this
    let body = ctx.request.body
    console.log(body, 'point_like')
    let pointAuthor = await ctx.model.models.points.findAll({
      raw: true,
      where: { point_id: body.point_id }
    })
    await ctx.model.models.notifications.create({
      uid: pointAuthor[0].uid,
      other_uid: body.uid,
      point_id: body.point_id,
      point_reply_content: pointAuthor[0].content,
      is_read: false,
      is_point_like: true,
      create_time: body.create_time
    })
  }

  // 沸点点赞加1
  async upLikes(uid, point_id) {
    const { ctx } = this
    let points = await ctx.service.point.getSinglePoint(point_id)
    let likes = points[0].likes + 1
    return likes
  }

  // 沸点点赞减1
  async downLikes(uid, point_id) {
    const { ctx } = this
    let points = await ctx.service.point.getSinglePoint(point_id)
    let likes = points[0].likes - 1
    return likes
  }

  // 删除用户对该沸点的点赞记录
  async removeLike(uid, point_id) {
    const { ctx } = this
    await ctx.model.models.likes.destroy({
      where: {
        uid,
        point_id
      }
    })
  }
  
  // 获取用户点赞过的沸点
  async getSingleLike(uid, point_id) {
    const { ctx } = this
    return await ctx.model.models.likes.findAll({
      raw: true,
      where: {
        uid,
        point_id
      }
    })
  }

  // 获取单条沸点
  async getSinglePoint(point_id) {
    const { ctx } = this
    return await ctx.model.models.points.findAll({
      raw: true,
      where: {
        point_id
      }
    })
  }

  async getSingle() {
    const { ctx } = this
    let { point_id } = ctx.request.query
    try {
      let points = await ctx.model.models.points.findAll({
        raw: true,
        where: {
          point_id
        }
      })
      if(points[0].image_cache === '') {
        points[0].image_cache = []
      }
      return {
        status: true,
        code: 0,
        point: points[0]
      }
    } catch (err) {
      throw err
    }
  }

  // 更新沸点
  async updateSinglePoint(likes, point_id) {
    const { ctx } = this
    await ctx.model.models.points.update({
      likes
    }, {
      where: { point_id }
    })
  }

  async updateAvatar(uid, filename) {
    const { ctx, config } = this
    try {
      await ctx.model.models.points.update({
        avatar: config.processEnv + '/public/img/' + filename
      }, {
        where: {
          uid
        }
      })
    } catch (err) {
      console.log('point updateAvatar', err)
    }
  }
}

module.exports = PointsService