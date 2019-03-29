const mongoose = require('mongoose')
const config = require('config')
const chalk = require('chalk')

const hostName = config.get('mongoDB.hostname')
const port = config.get('mongoDB.port')
const dbname = config.get('mongoDB.dbname')
const userName = config.get('mongoDB.username')
const pwd = config.get('mongoDB.pwd')

const dbUrl = `mongodb://${userName}:${pwd}@${hostName}:${port}/${dbname}`

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