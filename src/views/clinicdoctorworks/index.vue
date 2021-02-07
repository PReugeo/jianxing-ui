
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-form-item
            label="医生工号"
            prop="docorId"
          ><el-select v-model="form.docorId" placeholder="请选择">
            <el-option
              v-for="dict in docorIdOptions"
              :key="dict.key"
              :label="dict.value"
              :value="dict.key"
            />
          </el-select>
          </el-form-item>
          <el-form-item
            label="订单号"
            prop="orderNumber"
          ><el-input
            v-model="queryParams.orderNumber"
            placeholder="请输入订单号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item
            label="患者姓名"
            prop="patientName"
          ><el-input
            v-model="queryParams.patientName"
            placeholder="请输入患者姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
            >搜索</el-button>
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
            >重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:clinicdoctorworks:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:clinicdoctorworks:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:clinicdoctorworks:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="clinicdoctorworksList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
            label="医生工号"
            align="center"
            prop="docorId"
            :formatter="docorIdFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ docorIdFormat(scope.row) }}
            </template> </el-table-column><el-table-column
            label="订单号"
            align="center"
            prop="orderNumber"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="患者姓名"
            align="center"
            prop="patientName"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="治疗项目"
            align="center"
            prop="treatmentItems"
            :formatter="treatmentItemsFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ treatmentItemsFormat(scope.row) }}
            </template> </el-table-column><el-table-column
            label="是否已经开始"
            align="center"
            prop="isWork"
            :formatter="isWorkFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ isWorkFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="工作开始时间"
            align="center"
            prop="timeStart"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.timeStart) }}
            </template>
          </el-table-column>

          <el-table-column
            label="工作结束时间"
            align="center"
            prop="timeEnd"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.timeEnd) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:clinicdoctorworks:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:clinicdoctorworks:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="医生工号" prop="docorId">
              <el-input v-model="form.docorId" placeholder="医生工号" />
            </el-form-item>
            <el-form-item label="订单号" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="订单号" />
            </el-form-item>
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="form.patientName" placeholder="患者姓名" />
            </el-form-item>
            <el-form-item label="治疗项目" prop="treatmentItems">
              <el-select v-model="form.treatmentItems" placeholder="请选择">
                <el-option
                  v-for="dict in treatmentItemsOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否已经开始" prop="isWork">
              <el-radio-group v-model="form.isWork">
                <el-radio
                  v-for="dict in isWorkOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="工作开始时间" prop="timeStart">
              <el-date-picker
                v-model="form.timeStart"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="工作结束时间" prop="timeEnd">
              <el-date-picker
                v-model="form.timeEnd"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <FileChoose
          ref="fileChoose"
          :dialog-form-visible="fileOpen"
          @confirm="getImgList"
          @close="fileClose"
        />
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addClinicDoctorWorks,
  delClinicDoctorWorks,
  getClinicDoctorWorks,
  listClinicDoctorWorks,
  updateClinicDoctorWorks
} from '@/api/clinicdoctorworks'
import { listClinicDoctors } from '@/api/clinicdoctors'

import { listUser } from '@/api/system/sysuser'

import FileChoose from '@/components/FileChoose'

export default {
  name: 'ClinicDoctorWorks',
  components: {
    FileChoose
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      // 类型数据字典
      typeOptions: [],
      clinicdoctorworksList: [],
      treatmentItemsOptions: [],
      isWorkOptions: [],
      // 关系表类型
      docorIdOptions: [],
      createByOptions: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        docorId: undefined,
        orderNumber: undefined,
        patientName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        docorId: [
          { required: true, message: '医生工号不能为空', trigger: 'blur' }
        ],
        orderNumber: [
          { required: true, message: '订单号不能为空', trigger: 'blur' }
        ],
        patientName: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getClinicDoctorsItems()

    this.getDicts('clinic_treatment_type').then((response) => {
      this.treatmentItemsOptions = response.data
    })

    this.getDicts('clinic_yes_no').then((response) => {
      this.isWorkOptions = response.data
    })

    this.getSysUserItems()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listClinicDoctorWorks(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.clinicdoctorworksList = response.data.list
        this.total = response.data.count
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        ID: undefined,
        docorId: undefined,
        orderNumber: undefined,
        patientName: undefined,
        treatmentItems: undefined,
        isWork: undefined,
        timeStart: undefined,
        timeEnd: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs[
        'fileChoose'
      ].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    docorIdFormat(row) {
      return this.selectItemsLabel(this.docorIdOptions, row.docorId)
    },
    treatmentItemsFormat(row) {
      return this.selectDictLabel(
        this.treatmentItemsOptions,
        row.treatmentItems
      )
    },
    isWorkFormat(row) {
      return this.selectDictLabel(this.isWorkOptions, row.isWork)
    },
    createByFormat(row) {
      return this.selectItemsLabel(this.createByOptions, row.createBy)
    },
    // 关系
    getClinicDoctorsItems() {
      this.getItems(listClinicDoctors, undefined).then((res) => {
        this.docorIdOptions = this.setItems(res, 'ID', 'name')
      })
    },
    getSysUserItems() {
      this.getItems(listUser, undefined).then((res) => {
        this.createByOptions = this.setItems(res, 'USERID', 'username')
      })
    },
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加医生工作信息表'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.ID)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const ID = row.ID || this.ids
      getClinicDoctorWorks(ID).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改医生工作信息表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateClinicDoctorWorks(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addClinicDoctorWorks(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.ID && [row.ID]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return delClinicDoctorWorks({ ids: Ids })
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    }
  }
}
</script>
