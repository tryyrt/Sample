/*
用来定义路由的路由器模块
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')
const ApplicationModel =require('../models/ApplicationModel')
const  DataDetailsModel = require('../models/DataDetailsModel')

// 得到路由器对象
const router = express.Router()
// console.log('router', router)

// 指定需要过滤的属性
const filter = {password: 0, __v: 0}


// 登陆
router.post('/login', (req, res) => {
  const {username, password} = req.body
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        if (user.role_id) {
          RoleModel.findOne({_id: user.role_id})
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({status: 0, data: user})
            })
        } else {
          user._doc.role = {menus: []}
          // 返回登陆成功信息(包含user)
          res.send({status: 0, data: user})
        }

      } else {// 登陆失败
        res.send({status: 1, msg: '用户名或密码不正确!'})
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({status: 1, msg: '登陆异常, 请重新尝试'})
    })
})

// 添加用户
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const {username, password} = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({username})
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({status: 1, msg: '此用户已存在'})
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return UserModel.create({...req.body, password: md5(password || 'atguigu')})
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({status: 1, msg: '添加用户异常, 请重新尝试'})
    })
})


// 更新用户
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      // 返回
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('更新用户异常', error)
      res.send({status: 1, msg: '更新用户异常, 请重新尝试'})
    })
})

// 删除用户
router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

// 获取用户信息的路由(根据cookie中的userid)
/*router.get('/user', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({status: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter)
    .then(user => {
      if (user) {
        res.send({status: 0, data: user})
      } else {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        res.send({status: 1, msg: '请先登陆'})
      }
    })
    .catch(error => {
      console.error('获取用户异常', error)
      res.send({status: 1, msg: '获取用户异常, 请重新尝试'})
    })
})*/

// 获取所有用户列表
router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      console.error('获取用户列表异常', error)
      res.send({status: 1, msg: '获取用户列表异常, 请重新尝试'})
    })
})


// 添加项目
router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('添加项目异常', error)
      res.send({status: 1, msg: '添加项目异常, 请重新尝试'})
    })
})

// 获取项目列表
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('获取项目列表异常', error)
      res.send({status: 1, msg: '获取项目列表异常, 请重新尝试'})
    })
})

// 更新项目名称
router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新项目名称异常', error)
      res.send({status: 1, msg: '更新项目名称异常, 请重新尝试'})
    })
})

// 根据项目ID获取项目
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('获取项目信息异常', error)
      res.send({status: 1, msg: '获取项目信息异常, 请重新尝试'})
    })
})


// 添加任务
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({status: 0, data: product})
    })
    .catch(error => {
      console.error('添加任务异常', error)
      res.send({status: 1, msg: '添加任务异常, 请重新尝试'})
    })
})

// 获取任务分页列表
router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('获取任务列表异常', error)
      res.send({status: 1, msg: '获取任务列表异常, 请重新尝试'})
    })
})

// 搜索任务列表
router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('搜索任务列表异常', error)
      res.send({status: 1, msg: '搜索任务列表异常, 请重新尝试'})
    })
})

// 更新任务
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新任务异常', error)
      res.send({status: 1, msg: '更新任务名称异常, 请重新尝试'})
    })
})

// 更新任务状态
router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新任务状态异常', error)
      res.send({status: 1, msg: '更新任务状态异常, 请重新尝试'})
    })
})



//添加申请
router.post('/manage/applications/add',(req,res)=>{
    const application =req.body
    ApplicationModel.create(application)
        .then(application => {
            res.send({status:0,data:application})
        })
        .catch(error =>{
            console.error('添加申请异常',error)
            res.send({status:1,msg:'添加申请异常,请重新尝试'})
        })
})

//获取申请分页列表
router.get('/manage/applications/list', (req, res) => {
    const {pageNum, pageSize} = req.query
    ApplicationModel.find({})
        .then(applications => {
            res.send({status: 0, data: pageFilter(applications, pageNum, pageSize)})
        })
        .catch(error => {
            console.error('获取申请列表异常', error)
            res.send({status: 1, msg: '获取申请列表异常, 请重新尝试'})
        })
})



//搜索申请列表
router.get('/manage/applications/search', (req, res) => {
  const {pageNum, pageSize, searchName, applicationName,} = req.query
  let contition = {}
  if (applicationName) {
    contition = {name: new RegExp(`^.*${applicationName}.*$`)}
  }
  ApplicationModel.find(contition)
    .then(applications => {
      res.send({status: 0, data: pageFilter(applications, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('搜索申请列表异常', error)
      res.send({status: 1, msg: '搜索申请列表异常, 请重新尝试'})
    })
})

//更新产品
router.post('/manage/applications/update',(req,res)=>{
    const application = req.body
    ApplicationModel.findOneAndUpdate({id:application._id},application)
        .then(oldApplication =>{
            res.send({status:0})
        })
        .catch(error =>{
            console.error('更新申请异常',error)
            res.send({status: 1,msg:'更新申请异常，请重新尝试！'})
        })
})

//更新申请状态
router.post('/manage/applications/updateStatus', (req, res) => {
  const {applicationId, status} = req.body
  ApplicationModel.findOneAndUpdate({_id: applicationId}, {status})
    .then(oldApplication => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('更新申请状态异常', error)
      res.send({status: 1, msg: '更新申请状态异常, 请重新尝试'})
    })
})

//添加数据明细
router.post('/manage/data_details/add',(req,res)=>{
    const {dd_project_name} = req.body
    DataDetailsModel.findOne({dd_project_name})
        .then(data_details =>{
            if (data_details){
                res.send({status:1,msg:'此项目名已存在'})
                return new Promise(() =>{})
               }else {
                return DataDetailsModel.create({...req.body})
            }
        })
        .then(data_details =>{
            res.send({status:0,data:data_details})
        })
        .catch(error =>{
            console.error('添加数据明细异常',error)
            res.send({status:1,msg:'添加用户异常，请重新尝试！'})
        })
})








//更新数据明细
router.post('/manage/data_details/update',(req,res)=>{
    const data_details = req.body
    DataDetailsModel.findOneAndUpdate({_id:data_details._id},data_details)
        .then(oldData_details=>{
            const data = object.assign(oldData_details,data_details)
            res.send({status:0,data})
        })
        .catch(error =>{
            console.error('更新数据明细异常',error)
            res.send({status:1,msg:'更新数据明细异常，请重新尝试！'})
        })
})


//删除数据明细
router.post('/manage/user/delete',(req,res)=> {
    const {data_detailsId} = req.body
    DataDetailsModel.deleteOne({_id: data_detailsId})
        .then((doc) => {
            res.send({status: 0})
        })
})

//获取所有数据明细纪录列表
router.get('/manage/data_details/list',(req,res)=>{
    DataDetailsModel.find()
        .then(all_data_details =>{
        res.send({status:0,data:all_data_details})
    })
        .catch(error=>{
            console.error('获取所有数据明细纪录列表异常',error)
            res.send({status:1,msg:'获取所有数据明细纪录列表异常,请重新尝试！'})
        })
    })









// 添加角色
router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name: roleName})
    .then(role => {
      res.send({status: 0, data: role})
    })
    .catch(error => {
      console.error('添加角色异常', error)
      res.send({status: 1, msg: '添加角色异常, 请重新尝试'})
    })
})

// 获取角色列表
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({status: 0, data: roles})
    })
    .catch(error => {
      console.error('获取角色列表异常', error)
      res.send({status: 1, msg: '获取角色列表异常, 请重新尝试'})
    })
})

// 更新角色(设置权限)
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('更新角色异常', error)
      res.send({status: 1, msg: '更新角色异常, 请重新尝试'})
    })
})


/*
得到指定数组的分页信息对象
 */
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

require('./file-upload')(router)

module.exports = router
