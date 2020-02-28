module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(30),
    password: STRING(30),
    uid: STRING(60),
    created_at: DATE,
    updated_at: DATE,
  });
  return User;
};

// 导出的model会被挂载到app和ctx上，可以直接通过app.model.User或者ctx.model.User调用