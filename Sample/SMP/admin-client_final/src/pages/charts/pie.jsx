import React, {Component} from 'react'
import {Card} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*
后台管理的饼图路由组件
 */
export default class Pie extends Component {

  getOption = () => {
    return {
      title : {
        text: '样本数据量',
        subtext: '纯属虚构',
        x:'center'
      },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['智慧工厂','智慧工地','智慧地铁','正大农牧']
      },
      series : [
        {
          name: '数据来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '60%'],
          data:[
            {value:3, name:'智慧工厂 2.2TB'},
            {value:3.5, name:'智慧工地 2.5TB'},
            {value:1.5, name:'智慧地铁 1.1TB'},
              {value:16.4, name:'未使用 16.4TB'},
            {value:2, name:'正大农牧 1.8TB'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

  }

  getOption2 = () => {
    return {
      backgroundColor: '#2c343c',

      title: {
        text: '数据库占比',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series : [
        {
          name:'数据来源',
          type:'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            {value:335, name:'智慧工厂 16.52%'},
            {value:310, name:'智慧工地 15.28%'},
            {value:274, name:'智慧地铁 13.51%'},
            {value:235, name:'正大农牧 11.59%'},
            {value:874, name:'未使用 43.1%'}
          ].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <Card>
          <ReactEcharts option={this.getOption()} style={{height: 300}}/>
        </Card>
        <Card>
          <ReactEcharts option={this.getOption2()} style={{height: 300}}/>
        </Card>
      </div>
    )
  }
}
