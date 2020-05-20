import React, {Component} from 'react'
import {
  Card,
  Icon,
  List
} from 'antd'

import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api'

const Item = List.Item


/*
Product的详情子路由组件
 */
export default class ProductDetail extends Component {

  state = {
    cName1: '', // 一级项目名称
    cName2: '', // 二级项目名称
  }

  async componentDidMount () {

    // 得到当前任务的项目ID
    const {pCategoryId, categoryId} = this.props.location.state.product
    if(pCategoryId==='0') { // 一级项目下的任务
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else { // 二级项目下的任务
      /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级项目列表
      const result2 = await reqCategory(categoryId) // 获取二级项目
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }

  }

  render() {

    // 读取携带过来的state数据
    const {name, desc, price, detail, imgs} = this.props.location.state.product
    const {cName1, cName2} = this.state

    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{marginRight: 10, fontSize: 20}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>

        <span>任务详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className="left">任务名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">任务描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">任务预算时间:</span>
            <span>{price}天</span>
          </Item>
          <Item>
            <span className="left">所属项目:</span>
            <span>{cName1} {cName2 ? ' --> '+cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">任务图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className="product-img"
                    alt="img"
                  />
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">任务详情:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>
            </span>
          </Item>

        </List>
      </Card>
    )
  }
}
