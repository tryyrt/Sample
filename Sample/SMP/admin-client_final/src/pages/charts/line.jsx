import React, {Component} from 'react'
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的折线图路由组件
 */
export default class Line extends Component {

  state = {
    Audio: [15,22,37,39],
    Video: [8,11,15,21],
    Picture: [10,25,44,75]
  }

  update = () => {
    this.setState(state => ({
      Audio: state.Audio.map(Audio => Audio + 1),
      Video:state.Video.map(Video => Video + 1),
      Picture: state.Picture.reduce((pre, Picture) => {
        pre.push(Picture-1)
        return pre
      }, []),
    }))
  }

  /*
  返回折线图的配置对象
   */
  getOption = (Audio, Video,Picture) => {
    return {
            title: {
        text: '数据储备量(单位:GB)'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['Video', 'Audio', 'Picture']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2016', '2017', '2018', '2019']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Video',
            type: 'line',
            data: Video
        },
        {
            name: 'Audio',
            type: 'line',
            data: Audio
        },
        {
            name: 'Picture',
            type: 'line',
            data: Picture
        }
    ]
    }
  }

  render() {
    const {Audio,Video, Picture} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>

        <Card>
          <ReactEcharts option={this.getOption(Audio, Video,Picture)} />
        </Card>
      </div>

    )
  }
}
