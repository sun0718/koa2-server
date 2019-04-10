const mongoose = require('mongoose')
const initDb = require('./db')

//连接数据库
initDb()

var getTime = function(){
  var now = new Date();
  var yy = now.getFullYear();      //年
  var mm = now.getMonth() + 1;     //月
  var dd = now.getDate();          //日
  var clock = yy + "-";
  if(mm < 10) clock += "0";
  clock += mm + "-";
  if(dd < 10) clock += "0";
  clock += dd + " ";
  return clock;
}

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
    type: String,
    default: getTime()
  }
})

//定义一个文章的数据骨架
const articleSchema = mongoose.Schema({
  id:Number,
  title: String,
  con: String,
  preface: String,
  mavonCon:String,
  categorie: [],
  tagsId: [],
  like: {
    type:Number,
    default:0
  },
  imageShow: String,
  overHead:{
    type: String,
    default: 0
  },
  createTime: {
    type: String,
    default: getTime()
  }
})

// 标签骨架
const tagSchema = mongoose.Schema({
  id :Number,
  name: String
})

// 文章分类骨架
const cateSchema = mongoose.Schema({
  id :Number,
  label: String,
  parentID:Number,
  level:Number,
  isEdit:Boolean,
  createTime: {
    type: String,
    default: Date.now()
  }
})


// 判断数据库是否存在这个表，存在则直接返回，不存在新建模型
const acountModel = mongoose.models.acount || mongoose.model('acount', acountSchema)
const articleModel = mongoose.models.article || mongoose.model('article', articleSchema)
const cateModel = mongoose.models.cate || mongoose.model('cate', cateSchema)
const tagModel = mongoose.models.tag || mongoose.model('tag', tagSchema)

module.exports = {
  acountModel,articleModel,cateModel,tagModel
} 

