// 文章点赞表

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const ArticleLikes = app.model.define('article_likes', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),
    article_id: STRING(60),
    create_time: STRING(60)
  }, {
    timestamps: false
  })
  return ArticleLikes
}