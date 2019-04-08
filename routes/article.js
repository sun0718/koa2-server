const router = require('koa-router')()
const path = require('path')
const multer = require('koa-multer')
const routerFun = require('../controller/article')


console.log(path.resolve(__dirname, '../upload'))
//文件上传配置
let storage = multer.diskStorage({
    // destination: process.env.NODE_ENV == 'development' ? path.resolve(__dirname, '../../upload') :  path.resolve(__dirname, './upload'),
    // destination: path.resolve(__dirname, '../upload'),
    destination: 'upload',
    filename: (ctx, file, cb) => {
        // var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        // cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        cb(null, file.originalname);
    }
});

//过滤上传的后缀为txt的文件
let fileFilter = (ctx, file, cb) => {
    if (file.originalname.split('.').splice(-1) == 'txt') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}
//文件上传加载配置
let upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/postArticle', routerFun.postArticle)
//后台列表
router.get('/postList', routerFun.postList)
router.post('/uploadImage', upload.single('file'), routerFun.uploadImage)
//前端列表
router.get('/getPosts', routerFun.postList)
router.get('/getPost/:id', routerFun.getBlog)

// 编辑cate&tags
router.post('/editCates', routerFun.editCates)
router.post('/addCate', routerFun.addCate)
router.get('/getCates', routerFun.getCates)

router.get('/tagList', routerFun.tagList)
router.post('/addTag', routerFun.addTag)

module.exports = router