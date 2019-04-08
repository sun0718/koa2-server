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
        let blogs = await articleModel.find()
        let idNum = await articleModel.find().countDocuments() + 1
        let blog
        let addResult
        if (blogs.length !== 0) {
            blog = new articleModel({
                id: idNum + 1,
                ...body
            })
        } else {
            blog = new articleModel({
                id: 1,
                ...body
            })
        }

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
        const id = ctx.query.id
        await articleModel.findByIdAndRemove(id).exec((err) => {
            if (err) {
                ctx.body = {
                    code: '0001',
                    msg: '删除失败'
                }
            } else {
                ctx.body = {
                    code: '0000',
                    msg: '删除成功'
                }
            }
        })
    },
    // 列表    
    postList: async (ctx, next) => {
        let currentPage = parseInt(ctx.query && ctx.query.currentPage) || 1
        let pagesize = parseInt(ctx.query && ctx.query.pagesize) || 10
        let ad = ctx.query.getAd
        let adLen = 0
        let overHead = []
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
                })
                adLen = 3 - overHead.length
            }
            let allPost = await articleModel.find({ overHead: 0 }, {
                categorie: 1,
                title: 1,
                id: 1,
                _id: 0,
                createTime: 1,
                like: 1,
                imageShow: 1,
                preface: 1
            }).skip(--currentPage * pagesize).limit(pagesize + adLen).sort('createTime')
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
                ctx.body = {
                    code: '0000',
                    data: result
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
        let result = await Blog.update(
            { id: ctx.params.id },
            {
                $set: ctx.request.body
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
        let go = ctx.request.body.goTop ? false : true
        let result = await articleModel.update(
            { id: ctx.params.id },
            {
                $set: { overHead: go }
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
        if (ctx.req.file) {
            ctx.body = {
                code: '0000',
                msg: 'upload success',
                result: {
                    filename: file.filename,
                    path: file.path,
                    originalname: file.originalname
                }
            };
        } else {
            ctx.body = {
                code: '0001',
                file: file,
                msg: 'upload error'
            };
        }
    },

    // 编辑分类
    editCates: async (ctx, next) => {
        const { body } = ctx.request
        try {
            var append=true,edit=true,remove=true;
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
                    var edit =  false
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
            if(append && edit && remove){
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

    addTag: async(ctx,next) => {
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
    }
}