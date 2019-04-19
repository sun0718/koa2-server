const router = require('koa-router')()
const path = require('path')
const multer = require('koa-multer')
const routerFun = require('../controller/article')

var maxFilesSize = 100 * 1000 * 1000 // 100MB
//文件上传配置
let storage = multer.diskStorage({
    destination: process.env.NODE_ENV == 'development' ? path.resolve(__dirname, '../../upload') :  '/home/upload',
    filename: (ctx, file, cb) => {
        // var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        // cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
        cb(null, file.originalname.replace(/\s+/,''));
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
let upload = multer({ storage: storage, fileFilter: fileFilter,limits:{fieldSize:maxFilesSize} });

router.post('/postArticle', routerFun.postArticle)
router.get('/postArticle/:id', routerFun.getBlog)
//后台列表
router.get('/postList', routerFun.postList)
router.post('/uploadImage', upload.single('file'), routerFun.uploadImage)
router.post('/updateBlog',routerFun.updateBlog)
router.delete('/deleteBlog/:id',routerFun.deleteBlog)
//前端列表
router.get('/getPosts', routerFun.postList)
router.get('/getPost/:id', routerFun.getBlog)

// 编辑cate&tags
router.post('/editCates', routerFun.editCates)
router.post('/addCate', routerFun.addCate)
router.get('/getCates', routerFun.getCates)

router.get('/tagList', routerFun.tagList)
router.post('/addTag', routerFun.addTag)

router.get('/getclassList', routerFun.getclassList)

module.exports = router