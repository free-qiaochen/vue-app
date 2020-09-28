// import {
//   getPreHost
// } from '@utils/index'

export const API_ENV = { // 环境一般都包含test（自试）、uat（用户验收测试）、pre（预生产）、prod（生产）环境
  TEST: 'test',
  UAT: 'uat',
  PROD: 'prod',
  PRE: 'pre'
}

const apiPrefix = { // 配置各环境api的baseUrl
  [API_ENV.TEST]: {
    // url: 'http://test-ncp.health.xxx.com/ncp-api/v1'
    url: '/ncp-api/v1',
    eeHostUrl: 'http://test.ee.xxx.com',
    xxxAppH5: 'http://test.im.xxx.com/#/',
    projectPrefix: 'http://uat-ncp.health.xxx.com',
    heSuanUrl: 'https://aqs.health.xxx.com/promo/hesuan'
  },
  [API_ENV.UAT]: {
    // url: 'http://uat-ncp.health.xxx.com/ncp-api/v1',
    url: '/ncp-api/v1',
    eeHostUrl: 'http://uat.ee.xxx.com',
    projectPrefix: 'https://uat-ncp.health.xxx.com',
    eeApi: '//uat.ee.xxx.com/service/v1/',
    xxxAppH5: 'http://newuat2.im.xxx.com/#/',
    // heSuanUrl: 'https://uat-aqs.health.xxx.com/promo/hesuan',
    heSuanUrl: 'https://uat-aqs.health.xxx.com/2c?logicId=3937f2aa26fc4f8fe86c65476d9d3239&ncpFlag=yes',
    fangyiUrl: 'https://uat-aqs.health.xxx.com/2c?logicId=d3e99e85230670d955af5620b46bea50&ncpFlag=yes',
    tijianUrl: 'https://uat-aqs.health.xxx.com/2c?logicId=d3e99e85230670d955af5620b46bea50&ncpFlag=yes'
  },
  [API_ENV.PRE]: {
    url: '/ncp-api/v1',
    eeHostUrl: 'http://pre.ee.xxx.com',
    eeApi: '//pre.ee.xxx.com/service/v1/',
    xxxAppH5: 'http://pre.im.xxx.com/#/',
    projectPrefix: 'http://pre-ncp.health.xxx.com',
  },
  [API_ENV.PROD]: {
    url: '/ncp-api/v1',
    eeHostUrl: 'http://ee.xxx.com',
    projectPrefix: 'https://ncp.health.xxx.com',
    eeApi: 'https://ee.xxx.com/service/v1/',
    xxxAppH5: 'http://m.xxx.com/#/',
    // heSuanUrl: 'https://aqs.health.xxx.com/promo/hesuan',
    fangyiUrl: 'https://aqs.health.xxx.com/2c?logicId=852b988ca64f86163097dbdb63e201bf&ncpFlag=yes',
    tijianUrl: 'https://aqs.health.xxx.com/2c?logicId=a7b9373077b8c8b6f4a78596096c60ff&ncpFlag=yes',
    heSuanUrl: 'https://aqs.health.xxx.com/2c?logicId=3937f2aa26fc4f8fe86c65476d9d3239&ncpFlag=yes'
  }
}

export const global = {
  mock: API_ENV.UAT, // 当前程序使用的环境，最后会由getPreHost函数返回正确的环境
  domain: '.xxx.com', // cookie设置的域
  cookieExpires: 1, // cookie设置的过期时间
  TOKEN_KEY: 'access_token' // cookie设置的键值
}
/**
 * @description 获取当前域名环境
 * @return {API_ENV}
 */
export function getPreHostConfig () {
  const hostname = window.location.hostname
  const searchPreHost = hostname.match(/^[a-z]+(?=\.|-)/g) // 查找以 test uat pre .或- 开头的域名，并保存结果，找不到则为 null
  if (/^localhost|^127\.0\.0\.1|^192\.168\.|^10\.105\./.test(hostname)) {
    return global.mock // 本机开发模拟
  }
  if (!searchPreHost) {
    return API_ENV.PROD
  }
  const hostENV = searchPreHost[0].toUpperCase()
  const preHost = Object.keys(API_ENV).includes(hostENV)
    ? API_ENV[hostENV]
    : API_ENV.PROD

  return preHost
}


export default apiPrefix[getPreHostConfig()] // 返回的是环境api的baseUrl，可自行设置返回
