module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Point = app.model.define('points', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(60),
    uid: STRING(60),
    point_id: STRING(60),
    avatar: TEXT,
    content: TEXT,
    post: STRING(60),
    company: STRING(60),
    topic: STRING(60),
    likes: INTEGER,
    replys_num: INTEGER,
    create_time: STRING(30),
    image_cache: TEXT
  }, {
    timestamps: false
  });
  // console.log(app.model.Reply, 'models')
  Point.associate = () => {
    Point.hasMany(app.model.models.replys, {
      foreignKey: 'reply_id'
    })
  }

  return Point;
}