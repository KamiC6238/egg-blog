const Controller = require('egg').Controller;
const uuid = require('node-uuid');


// 如果是get请求, 就通过this.ctx.query来获取参数
// 如果是post请求, 就通过this.ctx.request.body来获取参数
class ArticleController extends Controller {
  async getArticles() {
    const { ctx } = this
    let res = await ctx.service.articles.index() // 调用服务
    ctx.body = res
  }

  async getSingleArticle() {
    const { ctx } = this
    let { article_id } = ctx.request.query
    let res = await ctx.model.Articles.findOne({
      raw: true,
      where: {
        article_id
      }
    }).then(data => {
      ctx.body = {
        status: true,
        code: 0,
        data
      }
    }).catch(err => {
      ctx.body = {
        status: false,
        code: 1,
        data: err
      }
    })
  }

  async likeArticle() {
    const { ctx } = this
    let res = await ctx.service.articles.likeArticle()
    ctx.body = res
  }

  async addArticles() {
    const { ctx } = this
    let body = ctx.request.body
    let res
    try {
      if(body.type === 'edit') {
        res = await ctx.service.articles.editArticle()
      } else {
        let id = uuid.v1()
        let articleId_arr = id.split('-')
        let article_id = articleId_arr.join('')
        res = await ctx.service.articles.addArticles(article_id)
      }
      ctx.body = res
    } catch (err) {
      throw err
    }
  }

  async deleteArticle() {
    const { ctx } = this
    let { article_id } = ctx.request.query
    let res = await ctx.model.Articles.destroy({
      where: {
        article_id
      } 
    }).then(res => {
      ctx.body = {
        status: true,
        code: 0,
        message: '删除文章成功'
      }
    })
  }

  async search() {
    const { ctx } = this
    ctx.body = await ctx.service.articles.search()
  }
}

module.exports = ArticleController;