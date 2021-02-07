
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
            label="负责人"
            prop="head"
          ><el-input
            v-model="queryParams.head"
            placeholder="请输入负责人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item
            label="创建人"
            prop="createBy"
          ><el-input
            v-model="queryParams.createBy"
            placeholder="请输入创建人"
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
              v-permisaction="['admin:clinicchairs:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:clinicchairs:edit']"
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
              v-permisaction="['admin:clinicchairs:remove']"
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
          :data="clinicchairsList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
            label="是否在使用"
            align="center"
            prop="useStatus"
            :formatter="useStatusFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ useStatusFormat(scope.row) }}
            </template> </el-table-column><el-table-column
            label="椅子所处位置"
            align="center"
            prop="location"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="订单号"
            align="center"
            prop="orderNumber"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="负责人"
            align="center"
            prop="head"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:clinicchairs:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:clinicchairs:remove']"
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
            <el-form-item label="是否在使用" prop="useStatus">
              <el-radio-group v-model="form.useStatus">
                <el-radio
                  v-for="dict in useStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="椅子所处位置" prop="location">
              <el-input v-model="form.location" placeholder="椅子所处位置" />
            </el-form-item>
            <el-form-item label="订单号" prop="orderNumber">
              <el-input v-model="form.orderNumber" placeholder="订单号" />
            </el-form-item>
            <el-form-item label="负责人" prop="head">
              <el-input v-model="form.head" placeholder="负责人" />
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
  addClinicChairs,
  delClinicChairs,
  getClinicChairs,
  listClinicChairs,
  updateClinicChairs
} from '@/api/clinicchairs'
import FileChoose from '@/components/FileChoose'

export default {
  name: 'ClinicChairs',
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
      clinicchairsList: [],
      useStatusOptions: [],
      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        orderNumber: undefined,
        head: undefined,
        createBy: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNumber: [
          { required: true, message: '订单号不能为空', trigger: 'blur' }
        ],
        head: [{ required: true, message: '负责人不能为空', trigger: 'blur' }],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('clinic_yes_no').then((response) => {
      this.useStatusOptions = response.data
    })
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listClinicChairs(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.clinicchairsList = response.data.list
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
        useStatus: undefined,
        location: undefined,
        orderNumber: undefined,
        head: undefined
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
    useStatusFormat(row) {
      return this.selectDictLabel(this.useStatusOptions, row.useStatus)
    },
    // 关系
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
      this.title = '添加诊所牙椅表'
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
      getClinicChairs(ID).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改诊所牙椅表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updateClinicChairs(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addClinicChairs(this.form).then((response) => {
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
          return delClinicChairs({ ids: Ids })
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
