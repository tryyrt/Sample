/*
能操作Application集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

//2.字义Schema（描述文档结构）
const applicationSchema = new mongoose.Schema({
    categoryId: {type: String, required: true}, // 所属分类的id
    pCategoryId: {type: String, required: true}, // 所属分类的父分类id
    name:{type:String,required:true},   //名称
    user_name: {type:String,required:true}, //申请人名
    sample_type:{type:String,required:true}, //样本类型
    annotation_type: {type:String,required:true}, //标注类型
    need_num: {type:String,required:true},  //需求量
    project_distance: {type:Number,required:true},  //项目周期
    status:{type:Number,default:1}, //状态
    data_path: {type:String},   //数据路径
    project_background: {type:String},  //项目背景
    use_model: {type:String},   //应用模型
    other_info: {type:String}   //备注

})

//3.定义Model（与集合对应，可以操作集合）
const ApplicationModel =mongoose.model('applications',applicationSchema)

//4.向外暴露Model
module.exports =ApplicationModel
