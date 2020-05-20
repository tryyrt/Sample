import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的柱状图路由组件
 */
export default class Bar extends Component {

  state = {
    stores: [200,150,120,140], // 项目数
  }

  update = () => {
    this.setState(state => ({
      stores: state.stores.reduce((pre, store) => {
        pre.push(store-1)
        return pre
      }, []),
    }))
  }

  /*
  返回柱状图的配置对象
   */
  getOption = (stores) => {
    return {
      title: {
        text: '项目耗时（单位：天）',
        subtext: '实时数据'
      },
      tooltip: {
          trigger:'axis',
          axisPointer:{
              type:'shadow'
          }
      },
      legend: {
        data:['已好时']
      },
      xAxis: {
          type:'value',
          boundaryGap:[0,0.01]
      },
      yAxis: {
          type: 'category',
          data: ['智慧工地', '正大农牧', '智慧地铁', '智慧工厂']
      },
      series: [{
            name: '已耗时',
            type: 'bar',
            data: stores
      }]
    }
  }

  render() {
    const {stores} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>

        <Card>
          <ReactEcharts option={this.getOption(stores)} />
        </Card>

      </div>
    )
  }
}
