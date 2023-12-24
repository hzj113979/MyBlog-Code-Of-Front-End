// import some package
import axios from 'axios'
import store from '@/store'
import Qs from 'qs'

// base url
const baseUrl = 'http://localhost:8088/MyBlog'
// create axios object
const httpService = axios.create({
//    url
  baseURL: baseUrl,
  //    time out
  timeout: 3000
})

// add the request interceptor
// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
httpService.interceptors.request.use(function (config) {
    console.log('this is store = ' + window.sessionStorage.getItem('token'))
    // console.log('this is windows store = ' + window.sessionStorage.getItem('token'))
    // get the token from store for header
    config.headers.token = window.sessionStorage.getItem('token')
    return config
//    do something wrong  request.js 工具函数，抛出错误阻碍程序运行。
  }, function (error) {
    return Promise.reject(error)
  }
)
// response 拦截器
// 可以在接口响应后统一处理结果
// use the request in interceptor
httpService.interceptors.response.use(function (response) {
//        return the response data
  return response
}, function (error) {
//    return an error
  alert(error.toString())
  return Promise.reject(error)
})

// get request
export function get (url, params = {}) {
  // Promise传入两个参数：resolve，reject，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数。
  // eslint-disable-next-line promise/param-names
  return new Promise((resovle, reject) => {
    httpService({
      url: url,
      method: 'get',
      params: params
    }).then(response => {
      resovle(response) // resovle the response information
    }).catch(error => {
      reject(error)
    })
  })
}

// post request
export function post (url, params = {}) {
  // eslint-disable-next-line promise/param-names
  return new Promise((resovle, reject) => {
    httpService({
      url: url,
      method: 'post',
      params: params
    }).then(response => {
      resovle(response) // resovle the response information
    }).catch(error => {
      reject(error)
    })
  })
}

// post request
export function post2 (url, params = {}) {
  // eslint-disable-next-line promise/param-names
  return new Promise((resovle, reject) => {
    httpService({
      url: url,
      method: 'post',
      data: params,
      header: { 'Content-type': 'application/json' }
    }).then(response => {
      resovle(response) // resovle the response information
    }).catch(error => {
      reject(error)
    })
  })
}

// post request
export function put (url, params = {}) {
  // eslint-disable-next-line promise/param-names
  return new Promise((resovle, reject) => {
    httpService({
      url: url,
      method: 'put',
      data: params
      // header: { 'Content-type': 'application/json' }
    }).then(response => {
      resovle(response) // resovle the response information
    }).catch(error => {
      reject(error)
    })
  })
}

// DELETE request
export function delete2 (url, params = {}) {
  // eslint-disable-next-line promise/param-names
  return new Promise((resovle, reject) => {
    httpService({
      url: url,
      method: 'delete',
      params,
      paramsSerializer: params => {
        return Qs.stringify(params,  {arrayFormat: 'repeat'})// { indices: false })
      }
      // header: { 'Content-type': 'application/json' }
    }).then(response => {
      resovle(response) // resovle the response information
    }).catch(error => {
      reject(error)
    })
  })
}
// upload file
export function fileUpload (url, parms = {}) {
  return new Promise((resolve, reject) => {
    //    request data
    httpService({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}

// get server url
export function getServeUrl () {
  return baseUrl
}

// default method
export default {
  get,
  post,
  post2,
  delete2,
  put,
  fileUpload,
  getServeUrl
}
