const Service = require('egg').Service;

class AvatarService extends Service {
  async index(avatar) {
    const { config } = this
    return config.processEnv + '/public/img/' + avatar
  }
}

module.exports = AvatarService;