const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path')
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write

/**
 *  @config.processEnv 默认的运行环境, 比如localhost:7001
 *  @stream            文件流, 可以从stream.fields从获取除了文件之外的数据
 *  修改头像的时候, 因为其他表里面也有头像字段, 所以也要修改的时候要把其他表内的头像字段的值也进行修改
 */
class UploadController extends Controller {
  async uploadAvatar() {
    const { ctx, config } = this;
    const stream = await ctx.getFileStream();
    const filename = Math.random().toString(36).substr(2) + new Date().getTime() + path.extname(stream.filename).toLocaleLowerCase();
    const target = path.join(config.baseDir, 'app/public/img', filename);
    const writeStream = fs.createWriteStream(target)
    const { uid } = stream.fields
    try {
      await awaitWriteStream(stream.pipe(writeStream))
      await ctx.service.userInfo.upload(filename, uid)
      await ctx.service.userInfo.updateAvatar(stream.fields.uid, filename)
      await ctx.service.point.updateAvatar(stream.fields.uid, filename)
      await ctx.service.articles.updateAvatar(stream.fields.uid, filename)
      await ctx.service.reply.updateAvatar(stream.fields.uid, filename)
      await ctx.service.replyChild.updateAvatar(stream.fields.uid, filename)
    } catch(err) {
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = {
      uid: stream.fields.uid,
      imageUrl: config.processEnv + '/public/img/' + filename,
      message: '修改头像成功!'
    }
  }

  async upload() {
    const { ctx, config } = this;
    const stream = await ctx.getFileStream();
    const filename = Math.random().toString(36).substr(2) + new Date().getTime() + path.extname(stream.filename).toLocaleLowerCase();
    const target = path.join(config.baseDir, 'app/public/img', filename);
    const writeStream = fs.createWriteStream(target)
    const { article_id } = stream.fields
    try {
      // 写文章的时候上传图片是没有article_id的，只有上传封面的时候才会有
      if(article_id) {
        await ctx.model.models.articles.update({
          cover_image: config.processEnv + '/public/img/' + filename
        }, {
          where: { article_id }
        })
      }
      await awaitWriteStream(stream.pipe(writeStream))
    } catch(err) {
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = {
      status: true,
      code: 0,
      imageUrl: config.processEnv + '/public/img/' + filename,
      message: '上传图片成功'
    }
  }
};

module.exports = UploadController;