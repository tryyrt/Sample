const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的path
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: '查询',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: '项目查询',
        key: '/category',
        icon: 'bars'
      },
      {
        title: '任务查询',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: '图形图表',
    key: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: '各项目耗时图表',
        key: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: '数据储备图表',
        key: '/charts/line',
        icon: 'line-chart'
      },
      {
        title: '样本数据量图表',
        key: '/charts/pie',
        icon: 'pie-chart'
      },
    ]
  },
  {
      title:'需求申请',
      key: '/applications',
      icon:'file-done'
   },
  {
      title:'报工系统',
      key: '/reporting-system/rs_home',
      icon:'carry-out'

   },
  {
      title:'数据明细',
      key: '/data-details/data_details',
      icon:'bars'

   },
  {
    title: '系统管理',
    icon: 'windows',
    children: [
          {
            title: '用户管理',
            key: '/user',
            icon: 'user'
          },
          {
            title: '角色管理',
            key: '/role',
            icon: 'safety',
          },
    ]
  },
]

export default menuList

