import request from '@/utils/request'

// 查询ClinicDoctorWorks列表
export function listClinicDoctorWorks(query) {
  return request({
    url: '/api/v1/clinicdoctorworks',
    method: 'get',
    params: query
  })
}

// 查询ClinicDoctorWorks详细
export function getClinicDoctorWorks(ID) {
  return request({
    url: '/api/v1/clinicdoctorworks/' + ID,
    method: 'get'
  })
}

// 新增ClinicDoctorWorks
export function addClinicDoctorWorks(data) {
  return request({
    url: '/api/v1/clinicdoctorworks',
    method: 'post',
    data: data
  })
}

// 修改ClinicDoctorWorks
export function updateClinicDoctorWorks(data) {
  return request({
    url: '/api/v1/clinicdoctorworks/' + data.ID,
    method: 'put',
    data: data
  })
}

// 删除ClinicDoctorWorks
export function delClinicDoctorWorks(data) {
  return request({
    url: '/api/v1/clinicdoctorworks',
    method: 'delete',
    data: data
  })
}

