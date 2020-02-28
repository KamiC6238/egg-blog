// ctx是整个环境上下文，进来的请求会被封装在ctx中，包括数据，可以通过ctx.request.query或者ctx.request.body获取
// 但配置环境是存在于app中的,所以要使用config,就需要用app.config来调用


// 每次更新数据库的字段, 首先执行
// npx sequelize migration:generate --name="xxx(版本迭代的信息，比如新增字段或者初始化)"
// 修改本文件的内容，也就是修改数据库的表的数据格式
// npx sequelize db:migrate 更新数据库

// 要注意的是, 需要把之前的migrations中的文件删掉, 再执行npx sequelize db:migrate之后更新才会生效

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(30),
      password: STRING(30),
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('users');
  }
};


/**
 *  通过ctx.model.xxx来调用某个model的时候, 这个xxx必须跟model文件夹下的js文件中的返回值一致,
 *  比如app/model/article.js文件中的函数返回了Article,那么使用的时候就必须通过ctx.model.Article来调用
 */

 /**
  * 在建model的时候，要加上created_at和updated_at两个字段，这两个字段是sequelize自动加上的，如果不加，查询的时候会出现
  * unknown column created_at或者updated_at in field list这样的报错，因为建model的时候没有加，所以数据库里的表也没有这
  * 两个字段
  */