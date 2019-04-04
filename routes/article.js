const router = require('koa-router')()
const path = require('path')
const multer=require('koa-multer')
const routerFun = require('../controller/article')

console.log(process.env.NODE_ENV)

//文件上传配置
let storage = multer.diskStorage({
    destination: process.env.NODE_ENV == 'development'? path.resolve(__dirname,'../../../Upload') : '/home/Upload',
    filename: (ctx, file, cb)=>{
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
//过滤上传的后缀为txt的文件
let fileFilter = (ctx, file ,cb)=>{
    if (file.originalname.split('.').splice(-1) == 'txt'){
        cb(null, false); 
    }else {
        cb(null, true); 
    }
}
//文件上传加载配置
let upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/postArticle', routerFun.postArticle)
//后台列表
router.get('/postList', routerFun.postList)
//前端列表
router.get('/post', routerFun.postList)
router.get('/postArticle/:id', routerFun.getBlog)
router.get('/postArticle/:id', routerFun.getBlog)
router.post('/uploadImage', upload.single('file'), routerFun.uploadImage)

module.exports = router