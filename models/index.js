const mongoose = require('mongoose')
const initDb = require('./db')

//连接数据库
initDb()

const accountSchema = mongoose.Schema({
  accountName: {
    type: String, 
    required: true
  },
  accountPwd: {
    type: String,
    required: true
  }
})

const accountModel = mongoose.models.account || mongoose.model('account', accountSchema)

module.exports = {
  accountModel
}