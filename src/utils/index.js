import { global, getPreHostConfig } from '@config'
import Cookies from 'js-cookie'

export const getPreHost = getPreHostConfig
/**
 * @param {String} url
 * @description 从URL中解析参数
 * @todo 优化->有报错情况
 */
export const getParams = url => {
  if (!url) {
    url = window.location.href
  }
  if (!url.includes('?')) {
    return
  }
  const keyValueArr = url.split('?')[1].split('&')
  const paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    if (keyValue[0] && keyValue[1]) {
      paramObj[keyValue[0]] = keyValue[1]
    }
  })
  return paramObj
}

/**
 * @description 动态添加script标签
 * @param {string} url
 * @param {function} callback
 */
export function loadScript (url, callback) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)

  if (script.readyState) {
    // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    // Others
    script.onload = function () {
      callback()
    }
  }
}

/**
 * @description 触发数据统计，目前只引入了百度统计 百度统计文档：https://tongji.baidu.com/web/help/index?from=2
 */
export function trackData () {
  const { _hmt } = window
  if (_hmt) {
    // _hmt.push(['_setAutoPageview', false]);
    _hmt.push(...arguments)
  }
}

/**
 * @description 节流函数
 * @param {func} fn 待执行的函数体
 * @param {number} timeout 控制节流时间
 */
export function throttle (fn, timeout = 300) {
  let canRun = true
  return function () {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, timeout)
  }
}

/**
 * @description 对传入数值进行格式化
 * @param {number} num 待格式化数字
 * @param {number} fix 小数点后的位数
 */
export function fixNum (num, fix = 2) {
  const fixed = typeof num === 'number' ? num : 0
  return fixed.toFixed(fix)
}

/**
 * @description 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
 * @param {string} startDiffTime
 * @todo 指定时间格式
 */
export function GetDateDiff (startDiffTime) {
  return startDiffTime.replace(/-/g, '/')
}

/**
 * @description 设置token
 * @param {string} token
 */
export const setToken = token => {
  Cookies.set(global.TOKEN_KEY, token, { expires: global.cookieExpires || 1 })
}

/**
 * @description 获取token
 * @return {string | boolean}
 */
export const getToken = () => {
  const token = Cookies.get(global.TOKEN_KEY)
  return token || false
}

/**
 * @description 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) {
    return key in obj
  } else {
    const keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @description 获取系统当前时间
 * @param {string} fmt 时间格式 具体看代码
 * @return: string
 */
export const getDate = fmt => {
  let time = ''
  const date = new Date()
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    time = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      time = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return time
}

/**
 * @msg: 获取格式化时间
 * @param {Date} date 时间
 * @param {string} fmt 时间格式
 * @return: string
 * 用法 formatDate(new Date(),'YYYY-MM-DD hh:mm:ss')
 */
export function formatDate (date, fmt) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'M+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'm+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    };
  };
  return fmt
}
/**
 * @description 校验手机号是否正确
 * @param phone 手机号
 * @return boolean
 */
export const verifyPhone = phone => {
  const reg = /^1\d{10}$/
  const _phone = phone.toString().trim()
  return reg.test(_phone)
}

/**
 * @description 深拷贝
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone (jsonObj) {
  let buf
  if (jsonObj instanceof Array) {
    buf = []
    let i = jsonObj.length
    while (i--) {
      buf[i] = objClone(jsonObj[i])
    }
    return buf
  } else if (jsonObj instanceof Object) {
    buf = {}
    for (const k in jsonObj) {
      buf[k] = objClone(jsonObj[k])
    }
    return buf
  } else {
    return jsonObj
  }
}

/**
 * @description 判断对象是否完全相等
 * @param {object} a
 * @param {object} b
 * @return boolean
 */
export const equals = (a, b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b
  }
  if (a.prototype !== b.prototype) return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every(k => equals(a[k], b[k]))
}

/**
 * @description 扁平化数组
 * @param {Array} arr
 * @return Array
 */
export const deepFlatten = arr =>
  [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)))

/**
 * @description 返回字符串的字节长度
 * @param {string} str
 * @return number
 */
export const byteSize = str => new Blob([str]).size

/**
 * @description 获取明天的字符串格式时间
 * @return string
 */
export const tomorrow = () => {
  const t = new Date()
  t.setDate(t.getDate() + 1)
  return t.toISOString().split('T')[0]
}

/**
 * @description 生成指定范围的随机整数
 * @param {number} min
 * @param {number} max
 * @return number
 */
export const randomIntegerInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

/**
 * @description 生成指定范围的随机小数
 * @param {number} min
 * @param {number} max
 * @return number
 */
export const randomNumberInRange = (min, max) =>
  Math.random() * (max - min) + min

/**
 * @description 四舍五入到指定位数
 * @param {number} n 要处理的数字
 * @param {number} decimals 到小数点后几位
 * @return number
 */
export const round = (n, decimals = 0) =>
  Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)

/**
 * @description 计算数组或多个数字的总和
 * @param {Array} 要求和的数组
 * @return number
 */
export const sum = (...arr) =>
  [...arr].reduce((acc, val) => acc + val, 0)

/**
 * @description 校验指定元素的类名
 * @param {HTMLDOMElement} el
 * @param {string} className
 * @return boolean
 */
export const hasClass = (el, className) => el.classList.contains(className)

/**
 * @description 平滑滚动至顶部
 */
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}

/**
 * @description 滚动到指定元素区域
 */
export const smoothScroll = element =>
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })

/**
 * @description 根据生日计算年龄
 * @param {String} 要求1992-05-12
 */
export const jsGetAge = (strBirthday = '') => {
  // 增加对空的判断，避免报错
  if (typeof strBirthday !== 'string') return ''
  let returnAge
  const strBirthdayArr = strBirthday.split('-')
  const birthYear = Number(strBirthdayArr[0])
  const birthMonth = Number(strBirthdayArr[1])
  const birthDay = Number(strBirthdayArr[2])
  const d = new Date()
  const nowYear = d.getFullYear()
  const nowMonth = d.getMonth() + 1
  const nowDay = d.getDate()
  if (nowYear === birthYear) {
    returnAge = 0
  } else {
    const ageDiff = nowYear - birthYear
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) { // 当前月份是生日月份
        const dayDiff = nowDay - birthDay
        if (dayDiff < 0) { // 还没有过生日
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        const monthDiff = nowMonth - birthMonth
        if (monthDiff < 0) { // 还没有过生日
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else { // 生日大于当前日期
      returnAge = -1
    }
  }
  return returnAge
}

// 设置 REM
export const setRem = () => {
  const minWidth = 320
  const maxWidth = 640
  let W = document.documentElement.clientWidth
  W = W > maxWidth ? maxWidth : W < minWidth ? minWidth : W
  document.documentElement.style.fontSize = W / 3.75 + 'px'

  window.onresize = function () {
    let W = document.documentElement.clientWidth
    W = W > maxWidth ? maxWidth : W < minWidth ? minWidth : W
    document.documentElement.style.fontSize = W / 3.75 + 'px'
  }
}

// 判断是否是iphone端的微信
export const isIphoneWeixin = () => {
  const u = navigator.userAgent;
  // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  const user = window.navigator.userAgent.toLowerCase()
  const weixin = /micromessenger/.test(user) || /alipayclient/.test(user) || /qq/.test(user)
  return isiOS && weixin
}

/**
 * 优雅处理await
 * @param {Promise} promise
 */
export const to = promise => promise.then(
  res => [null, res]
).catch(err => [err, null])
/**
 * 遍历对象初始化值，state使用
 * @params state 要遍历的对象
*/
export const initObj = (state) => {
  for (const prop in state) {
    // console.log('清空：',prop)
    if (Array.isArray(state[prop])) {
      state[prop] = []
    } else {
      const type = typeof state[prop]
      state[prop] = type === 'object' ? {} : ''
    }
  }
}
/**
 * 电话号码隐私
 * @param {number} mobile 要处理的手机号
 * @param {boolean} mode 是否分段显示
 * @return stirng
*/
export const formatMobile = (mobile, mode) => {
  if (mobile) {
    mobile = mobile.replace(/[\s]/g, '')
    let length = 3
    length = (mobile.length - 3) > 0 ? mobile.length - 3 : 0
    length = length > 4 ? 4 : length
    let placeholder = '*'.repeat(length)
    let str = mobile.substr(0, 3) + placeholder + mobile.substring(7)
    if (mode) {
      return str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substring(7)
    } else {
      return str
    }
  } else {
    return mobile || ''
  }
}
