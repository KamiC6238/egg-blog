module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize
  const Articles = app.model.define('articles', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),
    article_id: STRING(60),
    article_title: STRING(60),
    username: STRING(30),
    avatar: TEXT,
    cover_image: TEXT,
    read_nums: INTEGER,
    md_content: TEXT,
    html_content: TEXT,
    tags: STRING(30),
    create_time: STRING(60),
    support: INTEGER,
  }, {
    timestamps: false
  })
  return Articles
}