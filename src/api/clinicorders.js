import request from '@/utils/request'

// 查询ClinicOrders列表
export function listClinicOrders(query) {
  return request({
    url: '/api/v1/clinicorders',
    method: 'get',
    params: query
  })
}

// 查询ClinicOrders详细
export function getClinicOrders(ID) {
  return request({
    url: '/api/v1/clinicorders/' + ID,
    method: 'get'
  })
}

// 新增ClinicOrders
export function addClinicOrders(data) {
  return request({
    url: '/api/v1/clinicorders',
    method: 'post',
    data: data
  })
}

// 修改ClinicOrders
export function updateClinicOrders(data) {
  return request({
    url: '/api/v1/clinicorders/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除ClinicOrders
export function delClinicOrders(data) {
  return request({
    url: '/api/v1/clinicorders',
    method: 'delete',
    data: data
  })
}

