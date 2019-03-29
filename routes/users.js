const router = require('koa-router')()

const routerFun = require('../controller/user')

router.post('/register', routerFun.register)
router.put('/signin', routerFun.signin)
router.get('/userlist', routerFun.userList)
router.delete('/deleteUser', routerFun.deleteUser)
router.put('/lockUser', routerFun.lockUser)

module.exports = router
