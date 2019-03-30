// 权限控制
const config = require('config')

const jwt = require('jsonwebtoken')

// 此文件为路由控制函数
var model = require('../models/index')

let articleModel = model.articleModel

module.exports = {
    // 发布文章 
    postArticle: async (ctx, next) => {
        let { body } = ctx.request;
        let blogs = await articleModel.find()
        let idNum = await articleModel.find().countDocuments() +1
        let blog
        let addResult
        if (blogs.length !== 0) {
            blog = new articleModel({
                id: idNum+1 ,
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
        const  id = ctx.query.id
        await articleModel.findByIdAndRemove(id).exec((err)=>{
            if (err) {
                ctx.body ={
                    code: '0001',
                    msg: '删除失败'
                }
            }else{
                ctx.body = {
                    code: '0000',
                    msg:'删除成功'
                }
            }
        })
    },
    // 列表    
    postList: async (ctx, next) => {
        let currentPage = parseInt(ctx.query && ctx.query.currentPage) || 1
        let pagesize = parseInt(ctx.query && ctx.query.pagesize) || 10
        try {
            let allPost = await articleModel.find({}, {
                categorie : 1,
                title:1,
                id:1,
                createTime:1,
                like:1,
                imageShow:1
            }).skip(--currentPage * pagesize).limit(pagesize).sort('createTime')
            console.log(allPost)
            ctx.status = 200
            ctx.body = {
                code: '0000',
                result: {
                    list: allPost ? allPost : [],
                    count: await articleModel.countDocuments()
                },
                msg: '列表查询成功'
            }
        } catch (error) {
            ctx.body = {
                code: ' ',
                msg: '列表查询失败'
            }
        }

    },
    // 博客详情
    getBlog : async (ctx, next) => {
        var id = ctx.query.id
        try {
            var result = await articleModel.findById(id)
            if (result) {
                ctx.body = {
                    code: '0000',
                    data: result
                }
            } else {
                ctx.body = {
                    code: '0001',
                    data:{},
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
        let result = await Blog.update(
            { id: ctx.params.id },
            {
              $set: {goTop:go}
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
    }
}