// 关注标签表

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  const FocusTags = app.model.define('focus_tags', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),                   // 用户本身的uid
    tag_name: STRING(30),              // 用户关注的标签
    image_name: STRING(30),            // 前端获取图片用的标签名
  }, {
    timestamps: false
  })
  return FocusTags
}