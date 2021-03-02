import request from '@/utils/request'

// 查询PatientPic列表
export function listPatientPic(query) {
    return request({
        url: '/api/v1/patientpic',
        method: 'get',
        params: query
    })
}

// 查询PatientPic详细
export function getPatientPic (ID) {
    return request({
        url: '/api/v1/patientpic/' + ID,
        method: 'get'
    })
}


// 新增PatientPic
export function addPatientPic(data) {
    return request({
        url: '/api/v1/patientpic',
        method: 'post',
        data: data
    })
}

// 修改PatientPic
export function updatePatientPic(data) {
    return request({
        url: '/api/v1/patientpic/'+data.ID,
        method: 'put',
        data: data
    })
}

// 删除PatientPic
export function delPatientPic(data) {
    return request({
        url: '/api/v1/patientpic',
        method: 'delete',
        data: data
    })
}

