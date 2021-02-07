import request from '@/utils/request'

// 查询ClinicDoctors列表
export function listClinicDoctors(query) {
  return request({
    url: '/api/v1/clinicdoctors',
    method: 'get',
    params: query
  })
}

// 查询ClinicDoctors详细
export function getClinicDoctors(ID) {
  return request({
    url: '/api/v1/clinicdoctors/' + ID,
    method: 'get'
  })
}

// 新增ClinicDoctors
export function addClinicDoctors(data) {
  return request({
    url: '/api/v1/clinicdoctors',
    method: 'post',
    data: data
  })
}

// 修改ClinicDoctors
export function updateClinicDoctors(data) {
  return request({
    url: '/api/v1/clinicdoctors/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除ClinicDoctors
export function delClinicDoctors(data) {
  return request({
    url: '/api/v1/clinicdoctors',
    method: 'delete',
    data: data
  })
}

