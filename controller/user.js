// 权限控制
const config = require('config')
const bcrypt = require('crypto')
const jwt = require('jsonwebtoken')

// 密码加密
var encryptPassword = (password, salt) => {
    if (!password || !salt) return ''
    var salt = new Buffer(salt, 'base64')
    return bcrypt.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  }

// 此文件为路由控制函数
var model = require('../models/index')

let acountModel = model.acountModel

module.exports = {
    // 添加接口  
    register: async (ctx, next) => {
        const { body } = ctx.request;

        try {
            if (!body.acountName || !body.password) {
                ctx.status = 400;
                ctx.body = {
                    error: `expected an object with username, password but got: ${body}`,
                }
                return;
            }
            // https://www.npmjs.com/package/bcrypt
            body.password = encryptPassword(body.password, config.get('pwdSalt'));
            let user = await acountModel.find({ acountName: body.acountName })
            if (!user.length || user.length == 0) {
                const newUser = new acountModel(body);
                user = await newUser.save();
                ctx.status = 200;
                ctx.body = {
                    message: '注册成功',
                    code: '0000',
                    user,
                }
            } else {
                ctx.status = 406;
                ctx.body = {
                    code: '0001',
                    message: '用户名已经存在',
                }
            }
        } catch (error) {
            ctx.body = {
                code: '0001',
                msg: '创建失败'
            }
        }
    },
    // 登陆接口
    signin: async (ctx, next) => {
        const { body } = ctx.request
        try {
            const user = await acountModel.findOne({ acountName: body.acountName });
            if (!user) {
                ctx.status = 401
                ctx.body = {
                    message: '用户名错误'
                }
                return;
            }
            console.log('--------------')
            if (user.password == encryptPassword(body.password,config.get('pwdSalt'))) {
                let payload = {
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2),
                    acountName: user.acountName,
                    userName: user.userName,
                    id: user._id
                }
                //https://www.npmjs.com/package/jsonwebtoken
                let token = jwt.sign(payload, config.get('tokenSecret'))
                // console.log(token)
                ctx.status = 200
                ctx.body = {
                    result: {
                        id: user._id,
                        token: token
                    },
                    code: '0000',
                    message: '登陆成功'
                }
            } else {
                ctx.status = 401
                ctx.body = {
                    result: null,
                    code: '0001',
                    message: '密码错误'
                }
            }
        } catch (err) {
            ctx.body = {
                code: 0001,
                msg: '用户不存在'
            }
        }
    },
    // 用户列表    
    userList: async (ctx, next) => {
        let currentPage = parseInt(ctx.query && ctx.query.currentPage) || 1
        let pagesize = parseInt(ctx.query && ctx.query.pagesize) || 10
        try {
            let allUser = await acountModel.find({}, null).skip(--currentPage * pagesize).limit(pagesize).sort('createTime')
            ctx.status = 200
            ctx.body = {
                code: '0000',
                result: {
                    list: allUser ? allUser : [],
                    count: await acountModel.countDocuments()
                },
                msg: '列表查询成功'
            }
        } catch (error) {
            ctx.body = {
                code: 0001,
                msg: '列表查询失败'
            }
        }

    },
    // 删除用户
    deleteUser: async (ctx, next) => {
        var id = ctx.query.id
        try {
            await acountModel.deleteOne({ _id: id }, function (err) {
                if (err) {
                    ctx.body = {
                        code: 0001,
                        msg: '删除失败'
                    }
                } else {
                    ctx.body = {
                        code: 0000,
                        msg: '删除成功'
                    }
                }
            })
        } catch (error) {
            ctx.body = {
                code: 0001,
                msg: '删除失败'
            }
        }
    },
    // 锁定用户
    lockUser: async (ctx, next) => {
        let { id,lock } = ctx.request.body
        let unlock = lock == 'false' ? 'true' : 'false'
        console.log(unlock)
        try {
            await acountModel.updateOne({_id:id},{$set:{'lock':unlock}}, function (err,result) {
                if (err) {
                    ctx.body = {
                        code: '0001',
                        msg: lock?'解锁失败':'锁定失败'
                    }
                } else {
                    ctx.body = {
                        code: '0000',
                        msg: lock?'解锁成功':'锁定成功'
                    }
                }
            })
        } catch (error) {
            ctx.body = {
                code: '0001',
                msg: lock?'解锁失败':'锁定失败'
            }
        }
    }
}