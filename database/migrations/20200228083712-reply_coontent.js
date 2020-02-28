'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, TEXT, BOOLEAN } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: STRING(30),
      password: STRING(30),
      uid: STRING(60),
      created_at: DATE,
      updated_at: DATE,
    });
    await queryInterface.createTable('articles', {
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
    // 注意, 不能写成userInfo, 这种写法不被支持, 包括字段articleNums要写成article_nums, 否则会报错
    await queryInterface.createTable('user_infos', {
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
      created_at: DATE,
      updated_at: DATE
    })
    await queryInterface.createTable('points', {
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
    })
    await queryInterface.createTable('replys', {
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
    })
    await queryInterface.createTable('replys_children', {
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
    await queryInterface.createTable('likes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),
      point_id: STRING(60),
    }, {
      timestamps: false
    })
    await queryInterface.createTable('focus', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),         // 用户本身的uid
      focus_id: STRING(60),    // 用户关注的用户uid
      follow_id: STRING(60),   // follower的uid
    }, {
      timestamps: false
    })
    await queryInterface.createTable('focus_tags', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),                  // 用户本身的uid
      tag_name: STRING(30),             // 用户关注的标签
    }, {
      timestamps: false
    })
    await queryInterface.createTable('followers', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),         // 用户本身的uid
      focus_id: STRING(60),    // 用户关注的用户uid
      follow_id: STRING(60),   // follower的uid
    }, {
      timestamps: false
    })
    await queryInterface.createTable('article_likes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),
      article_id: STRING(60),
      create_time: STRING(60)
    }, {
      timestamps: false
    })
    await queryInterface.createTable('notifications', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      uid: STRING(60),            // 被通知的用户
      other_uid: STRING(60),      // 哪个用户发布了文章
      article_id: STRING(60),     // 发布的文章id
      article_title: STRING(60),
      tags: STRING(60),           // 文章标签
      point_id: STRING(60),
      point_reply_content: TEXT,
      article_reply_content: TEXT, // 评论内容
      point_be_reply_content: TEXT, // 评论了沸点里的回复
      article_be_reply_content: TEXT, // 评论了文章里的回复
      is_read: {                  // 被通知的用户是否已经阅读了该通知
        type: BOOLEAN
      },
      is_publish: {                // 发布文章
        type: BOOLEAN            
      },
      is_point_reply: {            // 评论沸点类型
        type: BOOLEAN
      },
      is_point_child_reply: {      // 回复沸点里的评论
        type: BOOLEAN
      },
      is_point_like: {            // 点赞文章类型
        type: BOOLEAN
      },
      is_article_reply: {            // 评论文章类型
        type: BOOLEAN
      },
      is_article_child_reply: {     // 回复文章里的评论
        type: BOOLEAN
      },
      is_article_like: {            // 点赞文章类型
        type: BOOLEAN
      },
      is_focus: {                // 关注类型
        type: BOOLEAN,
      },      
      create_time: STRING(60),
    }, {
      timestamps: false
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('articles');
    await queryInterface.dropTable('personal');
    await queryInterface.dropTable('points');
    await queryInterface.dropTable('replys');
    await queryInterface.dropTable('replys_children');
    await queryInterface.dropTable('likes');
    await queryInterface.dropTable('focus');
    await queryInterface.dropTable('focus_tags');
    await queryInterface.dropTable('followers');
    await queryInterface.dropTable('article_likes');
    await queryInterface.dropTable('notifications');
  }
};