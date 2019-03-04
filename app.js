const Koa = require('koa')
//模板引擎
const views = require('koa-views')
//json格式优化
const json = require('koa-json')
//错误提示
const onerror = require('koa-onerror')
//Request Body的解析器
const bodyparser = require('koa-bodyparser')
// 输出请求日志的功能
const logger = require('koa-logger')
// 跨域设置
const cors = require('koa2-cors');
//node项目配置文件的管理
const config = require('config');


//引入路由函数
const index = require('./routes/index')
const users = require('./routes/users')
// 实例化Koa
const app = new Koa()

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', 'https://203.195.175.18');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    console.log('000')
    ctx.body = 200; 
  } else {
    await next();
  }
});

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
//静态文件服
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

const PORT = process.env.PORT || config.get('host.port');

app.listen(PORT,function(){
  console.log(`Server is run ${PORT} PROT`)
})

module.exports = app
