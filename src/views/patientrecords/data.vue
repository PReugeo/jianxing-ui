<template>
  <el-container>
  <el-header>Header</el-header>
  <el-main>Main</el-main>
</el-container>
</template>

<script>
import { 
    getPatientRecords, 
    updatePatientRecords, 
    delPatientRecords 
} from '@/api/patientrecords'
import { getPatientProfile } from '@/api/patientprofile'

import router from '@/router'

export default {
  name: 'Data',
  data() {
    return {
      loading: false,
      // 类型数据字典
      typeOptions: [],
      patientprofileList: [],
      genderOptions: [],
      // 关系表类型
      createByOptions: [],
      updateByOptions: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        mobile: undefined,
        createBy: undefined
      },
      // 表单参数
      form: {},
      profile: {},
    }
  },
  created() {
      this.getProfile(this.$route.params.patientId)
      this.getRecords(this.$route.params.id)
  },
  methods: {
      getProfile(id) {
          getPatientProfile(id).then(response => {
              this.profile = response.data
          })
      },
      getRecords(id) {
          getPatientRecords(id).then(response => {
              this.form = response.data
          })
      }
  }
}
</script>
