import request from '@/utils/request'

// 查询PatientBeginProcess列表
export function listPatientBeginProcess(query) {
    return request({
        url: '/api/v1/patientbeginprocess',
        method: 'get',
        params: query
    })
}

// 查询PatientBeginProcess详细
export function getPatientBeginProcess (ID) {
    return request({
        url: '/api/v1/patientbeginprocess/' + ID,
        method: 'get'
    })
}


// 新增PatientBeginProcess
export function addPatientBeginProcess(data) {
    return request({
        url: '/api/v1/patientbeginprocess',
        method: 'post',
        data: data
    })
}

// 修改PatientBeginProcess
export function updatePatientBeginProcess(data) {
    return request({
        url: '/api/v1/patientbeginprocess/'+data.ID,
        method: 'put',
        data: data
    })
}

// 删除PatientBeginProcess
export function delPatientBeginProcess(data) {
    return request({
        url: '/api/v1/patientbeginprocess',
        method: 'delete',
        data: data
    })
}

