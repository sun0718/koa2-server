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
const config = require('config')
const koajwt = require('koa-jwt')

const token = require('./controller/token')
//引入路由函数koa
const index = require('./routes/article')
const users = require('./routes/users')
// 实例化Koa
const app = new Koa()

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  jsonLimit: '10mb',
  formLimit: '10mb'
}))

app.use(json())

app.use(logger())
//静态文件
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views'))

// 错误处理
app.use(token())
// 校验token
app.use(koajwt({
  secret: config.get('tokenSecret')
}).unless({
  path: [/^\/signin/,/^\/signOut/,/^\/getPosts/,/^\/getPost/,/^\/uploadImage/,/^\/getclassList/]
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

//错误捕获
// app.use(async (ctx, next) => {
//   var err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

const PORT = process.env.PORT || config.get('host.port');

app.listen(PORT, function () {
  console.log(`Server is run ${PORT} PROT`)
})

module.exports = app
