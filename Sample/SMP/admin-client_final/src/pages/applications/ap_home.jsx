import React,{Component} from 'react'
import {
  Card,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqApplication, reqSearchApplications, reqApplicationUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'


/*
Application 的子路由组件
 */

export  default  class Ap_home extends  Component{
    state = {
        total: 0,  //需求申请的总数量
        application: [], //需求申请的数组
        loading: false, //是否正在加载中
        searchName: '', //搜索的关键字
        searchType: 'applicationName', //根据那个字段进行搜索
    }
    /*
    初始化table列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title:'需求申请项目名',
                dataIndex:'name',
            },
            {
                title:'申请人',
                dataIndex:'user_name',
            },
            {
                title:'样本类型',
                dataIndex:'sample_type',
            },
            {
                title:'标注类型',
                dataIndex:'annotation_type',
            },
            {
                title:'需求量',
                dataIndex:'need_num',
            },
            {
                title:'项目周期',
                dataIndex:'project_distance',
                render:(project_distance) =>project_distance + '天' //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status',
                render: (application) => {
                    const {status, _id} = application
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                      <Button
                          type='primary'
                          onClick={() => this.updateStatus(_id, newStatus)}
                      >
                        {status === 1 ?  '待审核' : '已通过'}
                      </Button>
                            {/*<span>{status===1 ? '在标注' : '已交付'}</span>*/}
                    </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (application) => {
                  return (
                    <span>
                      {/*将product对象使用state传递给目标路由组件*/}
                      <LinkButton onClick={() => this.props.history.push('/applications/detail', {application})}>详情</LinkButton>
                      <LinkButton onClick={() => this.props.history.push('/applications/add', application)}>修改</LinkButton>
                    </span>
                  )
                }
            },
        ]
    }

    /*
    获取指定页码的列表数据显示
     */
    getApplication = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum，让其他方法可以看到
        this.setState({loading:true})  //显示loading

        const {searchName,searchType} = this.setState //搜索关键字有值时，要做分页
        let result
        if(searchName){
            result =await reqSearchApplications({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
            } else {
                //一般分页请求
                result = await reqApplication(pageNum,PAGE_SIZE)
            }
            this.setState({loading:false}) //隐藏loading
            if(result.status === 0){
                const {total,list} = result.data
                this.setState({
                    total,
                    application:list
                })
            }
        }
    /*
    更新指定需求申请的状态
     */
    updateStatus = async (applicationId,status) => {
        const result = await  reqApplicationUpdateStatus(applicationId,status)
        if(result.status===0){
            message.success('更新任务成功')
            this.getApplication(this.pageNum)
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getApplication(1)
    }
    render(){
        const {application,total,loading,searchName,searchType} = this.state   //取出状态数据

        const title = (
            <span>
                <span
                    value={searchType}
                    style={{width: 150}}
                    onChange={value => this.setState({searchType:value})}
                >
                    按名称搜索
                </span>
                <Input
                placeholder={'项目名关键字'}
                style={{width: 150,margin: '0 15px'}}
                value={searchName}
                onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={() => {this.getApplication(1)}}>搜索</Button>
            </span>
        )
        const  extra = (
            <Button type='primary' onClick={() => {this.props.history.push('/applications/add')}}>
                <Icon type='plus'/>
                发起申请
            </Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table
                bordered
                rowKey='_id'
                loading={loading}
                dataSource={application}
                columns={this.columns}
                pagination={{
                    current:this.pageNum,
                    total,
                    defaultPageSize:PAGE_SIZE,
                    showQuickJumper:true,
                    onChange:this.getApplication
                }}
                />

            </Card>
        )
    }
}
