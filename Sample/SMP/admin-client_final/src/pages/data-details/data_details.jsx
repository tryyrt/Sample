import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import LinkButton from "../../components/link-button/index"
import {reqAddOrUpdateDate_details,reqAll_data_details, reqDeleteData_details} from "../../api/index"
import DatadetailsForm from "../data-details/data_details-form"

export default class Data_details extends Component{
    state ={
    all_data_details: [],
        isShow:false,
    }
    initColums = () =>{
        this.colums = [
            {
                title:'项目名',
                dataIndex:'dd_project_name'
            },
            {
                title:'任务名',
                dataIndex:'dd_task_name'
            },
            {
                title:'任务简述',
                dataIndex:'dd_task_describe'
            },
            {
                title:'路径',
                dataIndex:'dd_path'
            },
            {
                title:'标签',
                dataIndex:'dd_label'
            },
            {
                title:'操作',
                render:(data_details) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(data_details)}>修改</LinkButton>
                        <LinkButton onClick={() =>this.deleteData_details(data_details)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    showAdd = () =>{
        this.data_details = null //去除之前保存的记录
        this.setState({isShow: true})
    }

    showUpdate = (data_details) =>{
        this.data_details = data_details  //保存记录
        this.setState({isShow:true})
    }

    //删除指定数据明细记录
    deleteData_details = (data_details) => {
        Modal.confirm({
            title:'确认删除吗？',
            onOk:async () =>{
                const result =await reqDeleteData_details(data_details._id)
                if(result.status===0){
                    message.success('删除记录数据明细记录成功！')
                    this.getAll_data_details()
                }
            }
        })
    }
    addOrUpdateData_details = async  ()=>{
        this.setState({isShow:false})
        //1.收集数据
        const data_details = this.form.getFieldsValue()
        this.form.resetFields()
        if (this.data_details){
            data_details._id = this.data_details._id
        }
        //2.提交添加的请求
        const result = await  reqAddOrUpdateDate_details(data_details)

        //3.更新列表显示
        if (result.status===0){
            message.success(`${this.data_details? '修改' : '添加'}数据明细成功`)
            this.getAll_data_details()
        }

    }

    getAll_data_details = async () => {
        const  result = await  reqAll_data_details()
        if(result.status===0){
            const {all_data_details} = result.data
            this.setState(all_data_details)
        }
    }
    componentWillMount() {
        this.initColums()
    }
    componentDidMount() {
        this.getAll_data_details()
    }

    render() {
        const {all_data_details,isShow} = this.state
        const data_details =this.data_details || {}
        const title =<Button type='primary' onClick={this.showAdd}>新建记录</Button>

        return(
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={all_data_details}
                    columns={this.colums}
                    pagination={{defaultPageSize: 20}}
                />
                <Modal
                title={data_details._id? '修改记录': '添加记录'}
                visible={isShow}
                onOk={this.addOrUpdateData_details}
                onCancel={() =>{
                    this.form.resetFields()
                    this.setState({isShow:false})
                }}
                >
                <DatadetailsForm
                setForm={form => this.form = form}
                data_details = {data_details}
                />
                </Modal>

            </Card>
        )
    }

}
