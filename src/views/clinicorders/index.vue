
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
          <el-form-item
            label="患者手机号"
            prop="patientMobile"
          ><el-input
            v-model="queryParams.patientMobile"
            placeholder="请输入患者手机号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item
            label="预约医生"
            prop="orderDoctor"
          ><el-input
            v-model="queryParams.orderDoctor"
            placeholder="请输入预约医生"
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
              v-permisaction="['admin:clinicorders:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:clinicorders:edit']"
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
              v-permisaction="['admin:clinicorders:remove']"
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
          :data="clinicordersList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
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
            label="患者手机号"
            align="center"
            prop="patientMobile"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="患者年龄"
            align="center"
            prop="patientAge"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="就诊情况"
            align="center"
            prop="type"
            :formatter="typeFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ typeFormat(scope.row) }}
            </template> </el-table-column><el-table-column
            label="预约时间"
            align="center"
            prop="orderTime"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="预约医生"
            align="center"
            prop="orderDoctor"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="预约项目"
            align="center"
            prop="orderProject"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="预约情况"
            align="center"
            prop="orderStatus"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="备注"
            align="center"
            prop="remark"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:clinicorders:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:clinicorders:remove']"
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
            <el-form-item label="订单号" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="订单号" />
            </el-form-item>
            <el-form-item label="患者姓名" prop="patientName">
              <el-input v-model="form.patientName" placeholder="患者姓名" />
            </el-form-item>
            <el-form-item label="患者手机号" prop="patientMobile">
              <el-input v-model="form.patientMobile" placeholder="患者手机号" />
            </el-form-item>
            <el-form-item label="患者年龄" prop="patientAge">
              <el-input v-model="form.patientAge" placeholder="患者年龄" />
            </el-form-item>
            <el-form-item label="就诊情况" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预约时间" prop="orderTime">
              <el-date-picker
                v-model="form.orderTime"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="预约医生" prop="orderDoctor">
              <el-input v-model="form.orderDoctor" placeholder="预约医生" />
            </el-form-item>
            <el-form-item label="预约项目" prop="orderProject">
              <el-input v-model="form.orderProject" placeholder="预约项目" />
            </el-form-item>
            <el-form-item label="预约情况" prop="orderStatus">
              <el-input v-model="form.orderStatus" placeholder="预约情况" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
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
  addClinicOrders,
  delClinicOrders,
  getClinicOrders,
  listClinicOrders,
  updateClinicOrders
} from '@/api/clinicorders'

import { listSysUser } from '@/api/system/sysuser'

import FileChoose from '@/components/FileChoose'

export default {
  name: 'ClinicOrders',
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
      clinicordersList: [],
      // 关系表类型
      createByOptions: [],
      updateByOptions: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        patientName: undefined,
        patientMobile: undefined,
        orderDoctor: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        patientName: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' }
        ],
        patientMobile: [
          { required: true, message: '患者手机号不能为空', trigger: 'blur' }
        ],
        orderDoctor: [
          { required: true, message: '预约医生不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('clinic_order_type').then((response) => {
      this.typeOptions = response.data
    })

    this.getSysUserItems()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listClinicOrders(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.clinicordersList = response.data.list
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
        orderNumber: undefined,
        patientName: undefined,
        patientMobile: undefined,
        patientAge: undefined,
        type: undefined,
        orderTime: undefined,
        orderDoctor: undefined,
        orderProject: undefined,
        orderStatus: undefined,
        remark: undefined
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
    typeFormat(row) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    createByFormat(row) {
      return this.selectItemsLabel(this.createByOptions, row.createBy)
    },
    updateByFormat(row) {
      return this.selectItemsLabel(this.updateByOptions, row.updateBy)
    },
    // 关系
    getSysUserItems() {
      this.getItems(listSysUser, undefined).then((res) => {
        this.createByOptions = this.setItems(res, 'USERID', 'username')
        this.updateByOptions = this.setItems(res, 'USERID', 'username')
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
      this.title = '添加预约订单表'
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
      getClinicOrders(ID).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改预约订单表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateClinicOrders(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addClinicOrders(this.form).then((response) => {
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
          return delClinicOrders({ ids: Ids })
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
