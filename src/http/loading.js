/**
 * @description 合并多个请求loading
 * @description axios 提供了请求拦截和响应拦截的接口，每次请求都会调用start方法，每次响应都会调用end方法
 * @description start end要干的事儿就是将同一时刻的请求合并。声明一个变量reqNum，每次调用start方法 reqNum + 1。调用end()方法，reqNum - 1。reqNum为 0 时，结束 loading
 */

let reqNum = 0
let loading;
// import {
//   Loading
// } from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
import store from '@store/index'

export default {
  start () {
    if (reqNum === 0) {
      // console.log('开始loading')
      store.commit('SET_LOADING', true)
      // loading = Loading.service({
      //   fullscreen: true,
      //   background: 'white',
      //   text: '疯狂加载中'
      // });
      // document.getElementsByClassName('el-loading-text')[0].style.color = '#FD9238'
      // document.getElementsByClassName('path')[0].style.stroke = '#FD9238'
    }
    reqNum++
  },
  close () {
    if (reqNum <= 0) return
    reqNum--
    if (reqNum === 0) {
      // console.log('结束loading')
      store.commit('SET_LOADING', false)
      // loading.close()
    }
  },
  end () {
    // 延迟 300ms 再调用 close 方法, 合并300ms内的请求
    setTimeout(this.close, 300)
  }
}
