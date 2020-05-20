import React, {Component} from 'react'
import {
  Card,
  Icon,
  List
} from 'antd'

import LinkButton from '../../components/link-button'
import {reqCategory} from '../../api'

const Item =List.Item
export default class Detail extends Component {

  state = {
    cName1: '', // 一级项目名称
    cName2: '', // 二级项目名称
  }

  async componentDidMount () {

    // 得到当前申请的项目ID
    const {pCategoryId, categoryId} = this.props.location.state.application
    if(pCategoryId==='0') { // 一级项目下的申请
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // 二级项目下的申请
      }

  }

  render() {

    // 读取携带过来的state数据
    const {name, user_name, sample_type,annotation_type,need_num,project_distance,data_path,project_background,use_model,other_info} = this.props.location.state.application

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => {this.props.history.goBack()}}
          />
        </LinkButton>

        <span>需求详情</span>
      </span>
    )
    return (
      <Card title={title} className='applications-detail'>
        <List>
          <Item>
            <span className="left">需求名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">申请人:</span>
            <span>{user_name}</span>
          </Item>
          <Item>
            <span className="left">样本类型:</span>
            <span>{sample_type}</span>
          </Item>
          <Item>
            <span className="left">标注类型:</span>
            <span>{annotation_type}</span>
          </Item>
          <Item>
            <span className="left">需求量:</span>
            <span>{need_num}</span>
          </Item>
          <Item>
            <span className="left">项目周期:</span>
            <span>{project_distance}天</span>
          </Item>
          <Item>
            <span className="left">数据路径:</span>
            <span>{data_path}</span>
          </Item>
          <Item>
            <span className="left">项目背景:</span>
            <span>{project_background}</span>
          </Item>
          <Item>
            <span className="left">应用模型:</span>
            <span>{use_model}</span>
          </Item>
          <Item>
            <span className="left">备注:</span>
            <span>{other_info}</span>
          </Item>
        </List>
      </Card>
    )
  }
}
