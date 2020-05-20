import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const Item = Form.Item

// 添加修改数据明细记录的form组件

class DatadetailsForm extends PureComponent{
    static  propTypes ={
        setForm:PropTypes.func.isRequired ,
        data_details:PropTypes.object
    }
    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const {data_details} = this.props
        const {getFieldDecorator} = this.props.form
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        }
        return(
            <Form {...formItemLayout}>
                <Item label='项目名'>
                    {
                    getFieldDecorator('dd_project_name',{
                    initialValue:data_details.dd_project_name,
                    })(<Input placeholder='请输入项目名'/>)
                    }
                    </Item>
                <Item label='任务名'>
                    {
                    getFieldDecorator('dd_task_name',{
                    initialValue:data_details.dd_task_name,
                    })(<Input placeholder='请输入任务名'/>)
                    }
                    </Item>
                <Item label='任务简述'>
                    {
                    getFieldDecorator('dd_task_describe',{
                    initialValue:data_details.dd_task_describe,
                    })(<Input placeholder='请输入任务简述'/>)
                    }
                    </Item>
                <Item label='路径'>
                    {
                    getFieldDecorator('dd_path',{
                    initialValue:data_details.dd_path,
                    })(<Input placeholder='请输入路径'/>)
                    }
                    </Item>
                <Item label='标签'>
                    {
                    getFieldDecorator('dd_label',{
                    initialValue:data_details.dd_label,
                    })(<Input placeholder='请输入标签'/>)
                    }
                    </Item>

            </Form>
        )
    }

}

export default Form.create()(DatadetailsForm)
