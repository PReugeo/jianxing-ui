import request from '@/utils/request'

// 查询ClinicChairs列表
export function listClinicChairs(query) {
  return request({
    url: '/api/v1/clinicchairs',
    method: 'get',
    params: query
  })
}

// 查询ClinicChairs详细
export function getClinicChairs(ID) {
  return request({
    url: '/api/v1/clinicchairs/' + ID,
    method: 'get'
  })
}

// 新增ClinicChairs
export function addClinicChairs(data) {
  return request({
    url: '/api/v1/clinicchairs',
    method: 'post',
    data: data
  })
}

// 修改ClinicChairs
export function updateClinicChairs(data) {
  return request({
    url: '/api/v1/clinicchairs/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除ClinicChairs
export function delClinicChairs(data) {
  return request({
    url: '/api/v1/clinicchairs',
    method: 'delete',
    data: data
  })
}

