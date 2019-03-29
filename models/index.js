const mongoose = require('mongoose')
const initDb = require('./db')

//连接数据库
initDb()

// 定义一个用户的数据骨架
const acountSchema = mongoose.Schema({
  acountName: String,
  password: String,
  userName: String,
  email: String,
  permissionin: String,
  lock: Boolean,
  sex: String,
  signature: String,
  createTime: {
    type: Number,
    default: Date.now()
  }
})

//定义一个文章的数据骨架
const articleSchema = mongoose.Schema({
  id:Number,
  title: String,
  con: String,
  author: String,
  like: String,
  discuss: Array,
  categorie : String,
  tags:Array,
  imageShow: String,
  oldEditTimeAndEvent:Array,
  goTop:Boolean,
  createTime: {
    type: String,
    default: Date.now()
  }
})

// 判断数据库是否存在这个表，存在则直接返回，不存在新建模型
const acountModel = mongoose.models.acount || mongoose.model('acount', acountSchema)
const articleModel = mongoose.models.article || mongoose.model('article', articleSchema)

module.exports = {
  acountModel,articleModel
} 

