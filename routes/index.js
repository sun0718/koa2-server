const router = require('koa-router')()

const routerFun = require('../controller/article')

router.post('/postArticle', routerFun.postArticle)
router.get('/postList', routerFun.postList)

module.exports = router