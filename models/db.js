const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const NODE_ENV = process.env.NODE_ENV

const DBConfig = NODE_ENV == 'development' ? config.get('mongoDBlocal') : config.get('mongoDB')

const hostName = DBConfig.hostname
const port = DBConfig.port
const dbname = DBConfig.dbname
const userName = DBConfig.username || ''
const pwd = DBConfig.pwd || ''

const dbUrl = `mongodb://${userName}:${pwd}@${hostName}:${port}/${dbname}`

console.log(dbUrl)
function initDb() {
  mongoose.connect(dbUrl,{useNewUrlParser:true,config:{autoIndex:true}})
  mongoose.connection.on('connected', error => {
    if(error) {
      console.log(chalk.red('数据库连接失败'), error)
    } else {
      console.log(chalk.green('数据库连接成功。'))
    }
  })

  return mongoose.connection;
}

module.exports = initDb