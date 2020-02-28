module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const UserInfo = app.model.define('user_infos', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(30),
    uid: STRING(60),
    avatar: TEXT,
    post: STRING(60),
    company: STRING(60),
    intro: STRING(60),
    personal_page: STRING(60),
    article_nums: INTEGER,
    support_nums: INTEGER,
  }, {
    timestamps: false
  });
  return UserInfo;
};

// 导出的model会被挂载到app和ctx上，可以直接通过app.model.User或者ctx.model.User调用