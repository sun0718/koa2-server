// 此文件为路由控制函数
var model = require('../models/index')

let accountModel = model.accountModel

// let Kitten = new accountModel({
//     accountName:'apple333',
//     accountPwd:'apple123' 
// })

// console.log('Kitten----'+ Kitten)

// Kitten.save(function(err,apple){
//     if(err) return console.log(err);
//     console.log('数据保存成功!!!')
// });

module.exports = {
    index: async (ctx, next) => {
        var hello = '';
        await accountModel.find({ accountName: 'apple333' },(err,data) => {
            console.log(data[0].accountName)
            hello = data[0].accountName
        })
        console.log(hello)
        await ctx.render('index', {
            title: `Hello Koa 2!${hello}`
        })
    }
}