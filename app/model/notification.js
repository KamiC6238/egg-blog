// 通知表
/**
 * is_point_reply, is_point_like, is_article_reply, is_article_like都是标志位，
 * 表示该条通知信息是属于那种类型的, 是属于在沸点里被评论，还是沸点被点赞了，还是文章被评论了或者评论被点赞了
 * 默认为0, 在插入数据的时候通过判断来确定是那种类型，再将对应的标志位置为1
 * 
 * @is_point_reply    通知信息的类型
 * @is_point_like     通知信息的类型
 * @is_article_reply  通知信息的类型
 * @is_article_like   通知信息的类型
 * @is_focus          通知信息的类型
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, BOOLEAN } = app.Sequelize
  const Notifications = app.model.define('notifications', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    uid: STRING(60),            // 被通知的用户
    other_uid: STRING(60),      // 哪个用户发布了文章
    article_id: STRING(60),     // 发布的文章id
    article_title: STRING(60),  // 文章标题
    tags: STRING(60),           // 文章标签
    point_id: STRING(60),       // 沸点id
    point_reply_content: TEXT,  // 评论内容
    article_reply_content: TEXT, // 评论内容
    point_be_reply_content: TEXT, // 评论了沸点里的回复
    article_be_reply_content: TEXT, // 评论了文章里的回复
    is_read: {                  // 被通知的用户是否已经阅读了该通知
      type: BOOLEAN
    },
    is_tags: {                   // 是否属于关注标签的类型
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
  return Notifications
}