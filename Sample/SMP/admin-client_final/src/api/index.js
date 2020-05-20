/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求: 能根据接口文档定义接口请求函数
 */
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax'

// const BASE = 'http://localhost:5000'
const BASE = ''
// 登陆
/*
export function reqLogin(username, password) {
  return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax(BASE + '/login', {username, password}, 'POST')

// 获取一级/二级项目的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

// 添加项目
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新项目
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

// 获取一个项目
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

// 获取任务分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

//获取申请分页列表
export  const reqApplication =(pageNum,pageSize) => ajax(BASE + '/manage/applications/list',{pageNum,pageSize})

// 更新任务的状态
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

//更新申请的状态
export const reqApplicationUpdateStatus = (applicationId, status) => ajax(BASE + '/manage/applications/updateStatus', {applicationId, status}, 'POST')

/*
搜索任务分页列表 (根据任务名称/任务描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName,
})


//搜索需求申请列表（根据需求申请项目名）

export const reqSearchApplications =({pageNum,pageSize,searchName,searchType}) => ajax(BASE+'/manege/applications/search',{
    pageNum,
    pageSize,
    [searchType]:searchName,
})
// 搜索任务分页列表 (根据任务描述)
/*export const reqSearchProducts2 = ({pageNum, pageSize, searchName}) => ajax(BASE + '/manage/product/search', {
  pageNum,
  pageSize,
  productDesc: searchName,
})*/

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

// 添加/修改任务
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + ( product._id?'update':'add'), product, 'POST')
// 添加/修改申请
export const reqAddOrUpdateApplications = (application) => ajax(BASE + '/manage/applications'+(application._id?'update':'add'), application, 'POST')



//添加/更新数据明细
export const reqAddOrUpdateDate_details = (data_details)=> ajax(BASE + '/manage/data_details/'+(data_details._id ? 'update' : 'add'),data_details,'POST')

//删除数据明细
export const reqDeleteData_details =(data_detailsId)=> ajax(BASE + '/manage/data_details/delete',{data_detailsId},'POST')
//获取所有数据明细
export const  reqAll_data_details =() => ajax(BASE + '/manage/data_details/list')


// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')
// 添加角色
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update', role, 'POST')


// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除指定用户
export const reqDeleteUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

/*
json请求的接口请求函数
 */
export const reqWeather = (city) => {

  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      console.log('jsonp()', err, data)
      // 如果成功了
      if (!err && data.status==='success') {
        // 取出需要的数据
        const {dayPictureUrl, weather} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        // 如果失败了
        message.error('获取天气信息失败!')
      }

    })
  })
}
