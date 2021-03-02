import request from '@/utils/request'

// 查询PatientRecords列表
export function listPatientRecords(query) {
    return request({
        url: '/api/v1/patientrecords',
        method: 'get',
        params: query
    })
}

// 查询PatientRecords详细
export function getPatientRecords (ID) {
    return request({
        url: '/api/v1/patientrecords/' + ID,
        method: 'get'
    })
}


// 新增PatientRecords
export function addPatientRecords(data) {
    return request({
        url: '/api/v1/patientrecords',
        method: 'post',
        data: data
    })
}

// 修改PatientRecords
export function updatePatientRecords(data) {
    return request({
        url: '/api/v1/patientrecords/'+data.ID,
        method: 'put',
        data: data
    })
}

// 删除PatientRecords
export function delPatientRecords(data) {
    return request({
        url: '/api/v1/patientrecords',
        method: 'delete',
        data: data
    })
}

