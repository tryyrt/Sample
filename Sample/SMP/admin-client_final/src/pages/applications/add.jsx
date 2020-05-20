import React, {PureComponent} from 'react'
import {
  Card,
  Icon,
  Form,
  Input,
  Button,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategorys, reqAddOrUpdateApplications} from '../../api'



const {Item} = Form
const { TextArea } = Input

/*
application的添加和更新的子路由组件
 */
class ApplicationAddUpdate extends PureComponent {

  state = {
    options: [],
  }

  constructor (props) {
    super(props)

    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新
    const {isUpdate, applications} = this
    const {pCategoryId} = applications
    if(isUpdate && pCategoryId!=='0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      // 找到当前申请对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      // 关联对应的一级option上
      targetOption.children = childOptions
    }


    // 更新options状态
    this.setState({
      options
    })
  }

  /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)   // {status: 0, data: categorys}
    if (result.status===0) {
      const categorys = result.data
      // 如果是一级分类列表
      if (parentId==='0') {
        this.initOptions(categorys)
      } else { // 二级列表
        return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  }


  /*
  验证耗时的自定义验证函数
   */
  validateProject_distance = (rule, value, callback) => {
    console.log(value, typeof value)
    if (value*1 > 0) {
      callback() // 验证通过
    } else {
      callback('耗时必须大于0') // 验证没通过
    }
  }

  /*
  用加载下一级列表的回调函数
   */
  loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0]
    // 显示loading
    targetOption.loading = true

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 隐藏loading
    targetOption.loading = false
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { // 当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    })
  }

  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. 收集数据, 并封装成application对象
        const {name, user_name, sample_type,annotation_type,need_num,project_distance,data_path,project_background,use_model,other_info,categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

         //const detail = this.editor.current.getDetail()

        const application = {name, user_name, sample_type,annotation_type,need_num,project_distance,data_path,project_background,use_model,other_info, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          application._id = this.application._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateApplications(application)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}申请成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}申请失败!`)
        }
      }
    })
  }

  componentDidMount () {
    this.getCategorys('0')
  }

  componentWillMount () {
    // 取出携带的state
    const application = this.props.location.state  // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!application
    // 保存商品(如果没有, 保存是{})
    this.application = application || {}
  }

  render() {

    const {isUpdate, application} = this
    const { pCategoryId, categoryId} = application
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if(isUpdate) {
      // 商品是一个一级分类的商品
      if(pCategoryId==='0') {
        categoryIds.push(categoryId)
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 },  // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    }

    // 头部左侧标题
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改申请' : '添加申请'}</span>
      </span>
    )

    const {getFieldDecorator} = this.props.form

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="申请名称">
            {
              getFieldDecorator('name', {
                initialValue: application.name,
                rules: [
                  {required: true, message: '必须输入申请名称'}
                ]
              })(<Input placeholder='请输入申请名称'/>)
            }
          </Item>
          <Item label="申请人">
            {
              getFieldDecorator('user_name', {
                initialValue: application.user_name,
                rules: [
                  {required: true, message: '必须输入申请人'}
                ]
              })(<TextArea placeholder="请输入申请人"  />)
            }

          </Item>
          <Item label="样本类型">
            {
              getFieldDecorator('sample_type', {
                initialValue: application.sample_type,
                rules: [
                  {required: true, message: '必须输入样本类型'}
                ]
              })(<TextArea placeholder="请输入样本类型"  />)
            }
          </Item>
          <Item label="标注类型">
            {
              getFieldDecorator('annotation_type', {
                initialValue: application.annotation_type,
                rules: [
                  {required: true, message: '必须输入标注类型'}
                ]
              })(<TextArea placeholder="请输入标注类型"  />)
            }
          </Item>
          <Item label="需求量">
            {
              getFieldDecorator('need_num', {
                initialValue: application.need_num,
                rules: [
                  {required: true, message: '必须输入需求量'}
                ]
              })(<TextArea placeholder="请输入需求量"  />)
            }
          </Item>
          <Item label="项目周期">

            {
              getFieldDecorator('project_distance', {
                initialValue: application.project_distance,
                rules: [
                  {required: true, message: '必须输入项目周期'},
                  {validator: this.validateProject_distance}
                ]
              })(<Input type='number' placeholder='请输入项目周期' addonAfter='天'/>)
            }
          </Item>
          <Item label="数据路径">
            {
              getFieldDecorator('data_path', {
                initialValue: application.data_path,
                rules: [
                  {required: true, message: '必须输入数据路径'}
                ]
              })(<TextArea placeholder="请输入数据路径"  />)
            }
          </Item>
          <Item label="项目背景">
            {
              getFieldDecorator('project_background', {
                initialValue: application.project_background,
                rules: [
                  {required: true, message: '必须输入项目背景'}
                ]
              })(<TextArea placeholder="请输入项目背景"  />)
            }
          </Item>
          <Item label="应用模型">
            {
              getFieldDecorator('use_model', {
                initialValue: application.use_model,
                rules: [
                  {required: true, message: '必须输入应用模型'}
                ]
              })(<TextArea placeholder="请输入应用模型"  />)
            }
          </Item>
          <Item label="备注">
            {
              getFieldDecorator('other_info', {
                initialValue: application.other_info,
                rules: [
                  {required: true, message: '必须输入备注'}
                ]
              })(<TextArea placeholder="请输入备注"  />)
            }
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(ApplicationAddUpdate)



/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
