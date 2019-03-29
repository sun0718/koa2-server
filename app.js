const Koa = require('koa')
//模板引擎
const views = require('koa-views')
//json格式优化
const json = require('koa-json')
//错误提示
const onerror = require('koa-onerror')
//Request Body的解析器,或者使用koa-body
const bodyparser = require('koa-bodyparser')
// 输出请求日志的功能
const logger = require('koa-logger')
//node项目配置文件的管理
const config = require('config');

//引入路由函数
const index = require('./routes/index')
const users = require('./routes/users')
// 实例化Koa
const app = new Koa()

// error handler
onerror(app)

// middlewares
app.use(bodyparser())

app.use(json())

app.use(logger())
//静态文件
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// middleware
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} -- ${ms}ms`)
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
