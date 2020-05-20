const  mongoose = require('mongoose')

const  dataDetailsSchema = new  mongoose.Schema({
    dd_project_name: {type:String,required:true},   //项目名
    dd_task_name: {type:String},      //任务名
    dd_task_describe: {type:String},        //任务描述
    dd_path: {type:String},     //路径
    dd_label: {type:String}     //标签

})

const DataDetailsModel = mongoose.model('data_details',dataDetailsSchema)

module.exports = DataDetailsModel
