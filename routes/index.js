const router = require('koa-router')()

const routerFun = require('../controller/index')

router.get('/', routerFun.index)

router.get('/string', async (ctx, next) => {
  console.log(ctx.request)
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
