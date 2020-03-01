
module.exports = app => {
  const { router, controller } = app
  router.get('/apis/getArticles', controller.article.articles.getArticles)            // 获取文章列表
  router.get('/apis/getSingleArticle', controller.article.articles.getSingleArticle)  // 获取单独的文章
  router.get('/apis/deleteArticle', controller.article.articles.deleteArticle)           // 删除文章
  router.get('/apis/article/search', controller.article.articles.search)             // 查询文章
  router.post('/apis/addArticles', controller.article.articles.addArticles)           // 发布文章
  router.post('/apis/article/likeArticle', controller.article.articles.likeArticle)   // 文章点赞

  router.get('/apis/user/pin/getSinglePoint', controller.point.points.getSingle) // 获取单条沸点
  router.get('/apis/user/getAllPins', controller.point.points.getAllPoints)         // 获取所有沸点
  router.post('/apis/user/publish/pin', controller.point.points.createPoint)        // 发布沸点
  router.post('/apis/user/pin/like', controller.point.points.likePoint)            // 点赞沸点

  router.get('/apis/getUserInfo', controller.personal.userInfo.getUserInfo)       // 获取用户信息
  router.post('/apis/setUserInfo', controller.personal.userInfo.setUserInfo)      // 保存用户信息到localStorage
  router.post('/apis/editUserInfo', controller.personal.userInfo.editUserInfo)    // 编辑用户个人信息

  router.post('/apis/uploadAvatar', controller.auth.upload.uploadAvatar)          // 上传头像
  router.post('/apis/upload', controller.auth.upload.upload)                      // 上传图片

  router.post('/apis/auth/login', controller.auth.login.index)                    // 登录
  router.post('/apis/auth/register', controller.auth.register.index)              // 注册

  router.get('/apis/reply/getAllReply', controller.reply.replys.getAllReply)         // 获取评论
  router.post('/apis/reply/replyPoint', controller.reply.replys.replyPoint)          // 评论沸点
  router.post('/apis/reply/replyArticle', controller.reply.replys.replyArticle)      // 评论文章
  router.post('/apis/reply/replyComment', controller.reply.replysChild.replyChild)   // 回复评论

  router.get('/apis/user/focusAndFollowers', controller.focus.index.getFocusAndFollowers) // 获取关注者和被关注者的数量
  router.get('/apis/user/focus/allTags', controller.focus.index.getAllTags)              // 获取所有标签
  router.post('/apis/user/focus', controller.focus.index.createFocusUser)               // 关注或者取消关注(二次点击关注的时候)
  router.post('/apis/user/focus/isUserFocus', controller.focus.index.isUserFocus)      // 用户是否关注了另一个用户
  router.post('/apis/user/focus/focusTag', controller.focus.index.focusTag)            // 关注标签

  router.get('/apis/notification/getNotification', controller.notification.index.getNotification)  // 获取用户的通知信息
  router.post('/apis/notification', controller.notification.index.createNotification)  // 新建通知信息
  router.post('/apis/notification/isRead', controller.notification.index.isRead)      // 修改通知信息状态为已读
}