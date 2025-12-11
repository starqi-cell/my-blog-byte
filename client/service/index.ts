// src/service/index.ts
// 统一请求出口文件


import { BASE_URL, TIME_OUT } from './config'
import AppRequest from './request'

const appRequest = new AppRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      return config
    }
  }
})

export default appRequest
