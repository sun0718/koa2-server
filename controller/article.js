// 权限控制
const config = require('config')
const jwt = require('jsonwebtoken')
const fs = require('fs')

// 此文件为路由控制函数
var model = require('../models/index')

let articleModel = model.articleModel
let cateModel = model.cateModel
let tagModel = model.tagModel

module.exports = {
    // 发布文章 
    postArticle: async (ctx, next) => {
        let { body } = ctx.request;
        let blog,addResult
        blog = new articleModel({
            id: Date.now(),
            ...body
        })
        addResult = await blog.save()

        if (addResult) {
            ctx.body = {
                code: '0000',
                msg: '创建成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '创建失败'
            }
        }
    },
    // 删除文章接口
    deleteBlog: async (ctx, next) => {
        const id = ctx.params.id
        var result = await articleModel.remove({id:id})
        if (result.ok == 1) {
            ctx.body = {
                code: '0000',
                msg: '删除成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '删除失败'
            }
        }
    },
    // 所有文章列表    
    postList: async (ctx, next) => {
        let currentPage = parseInt(ctx.query && ctx.query.currentPage) || 1
        let pagesize = parseInt(ctx.query && ctx.query.pagesize) || 10
        let ad = ctx.query.getAd
        let adLen = 0
        let overHead = []
        let allPost = []
        try {
            if (ad) {
                overHead = await articleModel.find({ overHead: { $in: [1, 2, 3, 4] } }, {
                    categorie: 1,
                    title: 1,
                    id: 1,
                    _id: 0,
                    createTime: 1,
                    like: 1,
                    imageShow: 1,
                    preface: 1
                }).sort({ 'createTime': -1 })
                adLen = 3 - overHead.length
                allPost = await articleModel.find({ overHead: 0 }, {
                    categorie: 1,
                    title: 1,
                    id: 1,
                    _id: 0,
                    createTime: 1,
                    like: 1,
                    imageShow: 1,
                    preface: 1
                }).skip(--currentPage * pagesize).limit(pagesize + adLen).sort({ 'createTime': -1 })
            } else {
                allPost = await articleModel.find({}, {
                    categorie: 1,
                    title: 1,
                    id: 1,
                    _id: 0,
                    createTime: 1,
                    like: 1,
                    imageShow: 1,
                    preface: 1
                }).skip(--currentPage * pagesize).limit(pagesize).sort({ 'createTime': -1 })
            }

            ctx.body = {
                code: '0000',
                result: {
                    list: {
                        allPost: allPost,
                        overHead: overHead
                    },
                    count: await articleModel.countDocuments()
                },
                msg: '列表查询成功'
            }
        } catch (error) {
            ctx.body = {
                code: '0001',
                msg: '列表查询失败'
            }
        }

    },
    // 博客详情
    getBlog: async (ctx, next) => {
        var id = ctx.params.id
        console.log(id)
        try {
            var result = await articleModel.findOne({ id: id })
            if (result) {
                var prevBlog = await articleModel.find({ '_id': { '$lt': result._id } }).sort({ _id: -1 }).limit(1)
                var nextBlog = await articleModel.find({ '_id': { '$gt': result._id } }).sort({ _id: -1 }).limit(1)
                ctx.body = {
                    code: '0000',
                    data: {
                        result: result,
                        sibling: {
                            nextBlog: nextBlog[0],
                            prevBlog: prevBlog[0]
                        }
                    }
                }
            } else {
                ctx.body = {
                    code: '0001',
                    data: {},
                    msg: '文章不存在'
                }
            }
        } catch (error) {
            ctx.body = {
                code: '0001',
                msg: error
            }
        }
    },
    // 重新编辑
    updateBlog: async (ctx, next) => {
        let { body } = ctx.request
        let result = await articleModel.update(
            { id: body.id },
            {
                $set: body
            }
        )
        if (result) {
            ctx.body = {
                code: '0000',
                msg: '编辑成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '编辑失败'
            }
        }
    },
    // 顶置文章
    goTopBlog: async (ctx, next) => {
        let overHead = ctx.request.body.goTop ? false : true
        let result = await articleModel.update(
            { id: ctx.params.id },
            {
                $set: { overHead: overHead }
            }
        )
        if (result) {
            ctx.body = {
                code: '0000',
                msg: '编辑成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '编辑失败'
            }
        }
    },
    // 上传文件
    uploadImage: async (ctx, next) => {
        var { file } = ctx.req
        console.log(file)
        if (file) {
            ctx.body = {
                code: '0000',
                msg: 'upload success',
                result: {
                    filename: file.filename,
                    path: `https://sunfafa.cn/upload/${file.originalname}`,
                    originalname: file.originalname
                }
            };
        } else {
            ctx.body = {
                code: '0001',
                msg: 'upload error'
            };
        }
    },

    // 编辑分类
    editCates: async (ctx, next) => {
        const { body } = ctx.request
        try {
            var append = true, edit = true, remove = true;
            if (body.append.length > 0) {
                try {
                    await cateModel.insertMany(body.append);
                } catch (e) {
                    var append = false
                }
            }
            if (body.edit.length > 0) {
                try {
                    for (var i = 0; i < body.edit.length; i++) {
                        await cateModel.updateMany({ id: body.edit[i].id }, { $set: { label: body.edit[i].label } })
                    }
                } catch (e) {
                    var edit = false
                }
            }
            if (body.remove.length > 0) {
                try {
                    for (var i = 0; i < body.remove.length; i++) {
                        await cateModel.deleteMany({ id: body.edit[i].id })
                    }
                } catch (e) {
                    var remove = false
                }
            }
            if (append && edit && remove) {
                ctx.body = {
                    code: '0000',
                    msg: '修改成功'
                }
            }
        } catch (error) {
            ctx.body = {
                code: '0001',
                msg: '修改失败'
            }
        }
    },
    // 查询分类
    getCates: async (ctx, next) => {
        var catesResult = await cateModel.find({}).sort({ "id": 1 })
        if (!catesResult) {
            ctx.body = {
                code: '0001',
                msg: '没有查询到数据'
            }
        } else {
            console.log(catesResult[catesResult.length - 1].id)
            ctx.body = {
                code: '0000',
                result: {
                    data: catesResult,
                    maxId: catesResult[catesResult.length - 1].id
                }
            }
        }
    },
    // 添加分类
    addCate: async (ctx, next) => {
        var { body } = ctx.request
        var cate = new cateModel({
            ...body
        })
        addResult = await cate.save()

        if (addResult) {
            ctx.body = {
                code: '0000',
                msg: '创建成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '创建失败'
            }
        }
    },
    // 标签列表 
    tagList: async (ctx, next) => {
        var tagResult = await tagModel.find({})
        if (!tagResult) {
            ctx.body = {
                code: '0001',
                msg: '没有查询到数据'
            }
        } else {
            ctx.body = {
                code: '0000',
                result: tagResult
            }
        }
    },
    // 添加标签
    addTag: async (ctx, next) => {
        var { body } = ctx.request
        addResult = await new tagModel(body).save()
        if (addResult) {
            ctx.body = {
                code: '0000',
                msg: '创建成功'
            }
        } else {
            ctx.body = {
                code: '0001',
                msg: '创建失败'
            }
        }
    },
    // 获取分类
    getclassList: async (ctx, next) => {
        console.log(ctx.query.class)
        var key = ctx.query.class
        try {
            // var calssResult =await articleModel.find({categorie:{$in:}})
            var calssResult = await articleModel.aggregate([{ "$unwind": "$categorie" },
            { "$match": { "categorie": key } },
            { "$project": { "id": 1, "title": 1, "createTime": 1, "imageShow": 1, "like": 1 } }]).sort({ 'createTime': -1 })
            if (calssResult) {
                ctx.body = {
                    code: '0000',
                    result: calssResult
                }
            } else {
                ctx.body = {
                    code: '0000',
                    result: '没有匹配的的数据'
                }
            }
        } catch (error) {
            ctx.body = {
                code: '0001',
                result: '查询失败'
            }
        }

    }
}