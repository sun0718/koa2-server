const jwt = require('jsonwebtoken')
const config = require('../config/default')
const util = require('util')
const verify = util.promisify(jwt.verify)

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        try {
            // 获取jwt
            const token = ctx.header.authorization
            if (token) {
                try {
                    // 解密payload，获取用户名和ID
                    let payload = await verify(token.split(' ')[1], config.tokenSecret)
                    // console.log(payload)
                } catch (err) {
                    ctx.body = {
                        code: '0001',
                        msg: '1token verify fail: ' + err
                    }
                }
            }
            await next()
        } catch (err) {
            if (err.status === 401) {
                ctx.status = 401
                ctx.body = {
                    code: '0001',
                    msg: '认证失败'
                }
            } else {
                err.status = 404
                ctx.body = {
                    code: '0001',
                    msg: '404'
                }
            }
        }
    }
}