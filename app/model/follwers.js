// 被关注表

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize
  const Followers = app.model.define('followers', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),         // 用户本身的uid
    focus_id: STRING(60),    // 用户关注的用户uid
    follow_id: STRING(60),   // follower的uid
  }, {
    timestamps: false
  })
  return Followers
}