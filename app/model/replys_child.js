module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const ReplyChild = app.model.define('replys_children', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(60),
    uid: STRING(60),
    reply_child_id: STRING(60),    // 回复了评论的id
    reply_id: STRING(60),          // 评论的id
    avatar: TEXT,
    content: TEXT,
    post: STRING(60),
    company: STRING(60),
    likes: INTEGER,
    create_time: STRING(30),
    reply_username: STRING(60)
  }, {
    timestamps: false
  });
  return ReplyChild;
}