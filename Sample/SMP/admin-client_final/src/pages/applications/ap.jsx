import React, {Component} from 'react'
import {Switch,Route, Redirect} from 'react-router-dom'
import ApplicationsAddUpdate from './add'
import Detail from './detail'

import Ap_home from "./ap_home";

/*
需求表路由
 */
export default class Ap extends Component {
  render() {
    return (
      <Switch>
          <Route path='/applications' component={Ap_home} />{/*路径完全匹配*/}
          <Route path='/applications/add' component={ApplicationsAddUpdate}/>
          <Route path='applications/detail' component={Detail}/>
          <Redirect to='/applications'/>
      </Switch>
    )
  }
}
