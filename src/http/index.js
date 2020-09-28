import axios from 'axios'
import Vue from 'vue'
import config from '@config/index'
import { removeCurPlatStore, removeHealthToken } from '@utils/changeToken'
import loading from './loading'
import Cookies from 'js-cookie'
import store from '@store'
import { Toast } from 'vant'

let {
  url
} = config

// 创建axios实例
const $request = axios.create({
  baseURL: url,
  withCredentials: true,
  timeout: 30000
})

const noLoadingApi = [
  '/healthyInfo/selectAllByPage'
]
const noLoading = (url) => {
  return noLoadingApi.some(item => {
    return url.indexOf(item) !== -1
  })
}

// 请求拦截器
$request.interceptors.request.use(config => {
  // 如果某个请求不需要 loading 呢，那么可以定义个API数组看config.url是否在这个数组中。在请求拦截和响应拦截时判断下该请求是否需要loading，需要 loading 再去调用loading.start()方法即可
  // 自定义header信息（比如token）
  let token
  if (Cookies.get('healthCheckToken')) {
    token = Cookies.get('healthCheckToken')
  } else if (Cookies.get('healthReportToken')) {
    token = Cookies.get('healthReportToken')
  } else if (store.state.app.plat) {
    token = store.state[store.state.app.plat].ncpToken
  }
  config.headers.common['token'] = token
  // !noLoading(config.url) && loading.start()
  loading.start()
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
$request.interceptors.response.use(response => {
  // !noLoading(response.config.url) && loading.end()
  loading.end()
  // 如果返回的数据是arraybuffer类型的掉过全局拦截验证
  if (response.request.responseType === 'arraybuffer') return response
  if (response.data.code === 4) { // todo code=4代表登陆超时
    let curPlat = store.state.app.plat
    removeCurPlatStore(curPlat) // 清除当前端下store数据
    removeHealthToken()// 清除企业平台
    sessionStorage.clear()
    Toast({
      message: response.data.message || '登陆超时',
      forbidClick: true,
      duration: 600
    })
    setTimeout(() => {
      let plat = store.state.app.plat.toUpperCase()
      if (plat) {
        store.commit(`${plat}_NCP_TOKEN`, '')
        store.commit('SET_TIMEOUT', true)
      }
    }, 600)
  } else if (response.data.code !== 1) {
    Toast(response.data.message || '系统错误, 请稍后重试~')
  }
  return response
}, (error) => {
  // 公共错误判断
  // if (error.response) {
  //   switch (error.response.status) {
  //     case 404:
  //       console.log('找不到页面'); break
  //     case 500:
  //       console.log('服务器错误'); break
  //     default: break
  //   }
  // }
  // 结束loading
  // !noLoading(config.url) && loading.end()
  loading.end()
  // !noLoading(error.config.url) && loading.end()
  return Promise.reject(error)
})

// 切换页面时候,取消上个页面的请求的方法
Vue.$httpRequestList = []
const cancelToken = () => {
  return new axios.CancelToken(cancel => {
    // cancel就是取消请求的方法
    Vue.$httpRequestList.push({
      cancel
    })
  })
}

const getData = (url, data = {}, method = 'GET', headers, baseURL, responseType = 'json') => {
  method = method.toUpperCase()
  const obj = {
    url,
    method,
    headers,
    baseURL,
    cancelToken: cancelToken(),
    responseType
  }
  if (method === 'GET' || method === 'DELETE') {
    // get请求防止IE缓存
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      data.t = new Date().getTime()
    }
    obj.params = data
  } else {
    obj.data = data
  }
  return $request(obj)
}

export default getData
