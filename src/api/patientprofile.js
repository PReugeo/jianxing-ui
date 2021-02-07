import request from '@/utils/request'

// 查询PatientProfile列表
export function listPatientProfile(query) {
  return request({
    url: '/api/v1/patientprofile',
    method: 'get',
    params: query
  })
}

// 查询PatientProfile详细
export function getPatientProfile(ID) {
  return request({
    url: '/api/v1/patientprofile/' + ID,
    method: 'get'
  })
}

// 新增PatientProfile
export function addPatientProfile(data) {
  return request({
    url: '/api/v1/patientprofile',
    method: 'post',
    data: data
  })
}

// 修改PatientProfile
export function updatePatientProfile(data) {
  return request({
    url: '/api/v1/patientprofile/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除PatientProfile
export function delPatientProfile(data) {
  return request({
    url: '/api/v1/patientprofile',
    method: 'delete',
    data: data
  })
}

