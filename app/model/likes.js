// 点赞表

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize
  const Likes = app.model.define('likes', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),
    point_id: STRING(60),
  }, {
    timestamps: false
  })
  return Likes
}