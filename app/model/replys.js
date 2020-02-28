module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Reply = app.model.define('replys', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(60),
    uid: STRING(60),
    reply_id: STRING(60),
    avatar: TEXT,
    content: TEXT,
    post: STRING(60),
    company: STRING(60),
    likes: INTEGER,
    create_time: STRING(30),
    point_id: STRING(60),
    article_id: STRING(60)
  }, {
    timestamps: false
  });

  Reply.associate = () => {
    Reply.belongsTo(app.model.models.points, {
      foreignKey: 'point_id'
    })
  }

  return Reply;
}