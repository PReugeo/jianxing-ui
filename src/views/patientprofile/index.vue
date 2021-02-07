
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
            prop="name"
          ><el-input
            v-model="queryParams.name"
            placeholder="请输入患者姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="mobile"
          ><el-input
            v-model="queryParams.mobile"
            placeholder="请输入联系电话"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item
            label="创建人"
            prop="createBy"
          ><el-select v-model="form.createBy" placeholder="请选择">
            <el-option
              v-for="dict in createByOptions"
              :key="dict.key"
              :label="dict.value"
              :value="dict.key"
            />
          </el-select>
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
              v-permisaction="['admin:patientprofile:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:patientprofile:edit']"
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
              v-permisaction="['admin:patientprofile:remove']"
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
          :data="patientprofileList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
            label="患者姓名"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="年龄"
            align="center"
            prop="age"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="出生日期"
            align="center"
            prop="bitrhday"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.bitrhday, '{y}-{m}-{d}') }}
            </template>
          </el-table-column>
          <el-table-column
            label="联系电话"
            align="center"
            prop="mobile"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="创建人"
            align="center"
            prop="CreateBy"
            :formatter="createByFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ createByFormat(scope.row) }}
            </template> </el-table-column><el-table-column
            label="修改人"
            align="center"
            prop="UpdateBy"
            :formatter="updateByFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ updateByFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:patientprofile:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                v-permisaction="['admin:patientprofile:remove']"
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
            <el-form-item label="患者姓名" prop="name">
              <el-input v-model="form.name" placeholder="患者姓名" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="年龄" />
            </el-form-item>
            <el-form-item label="患者性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio
                  v-for="dict in genderOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="省，市，地区" prop="region">
              <el-input v-model="form.region" placeholder="省，市，地区" />
            </el-form-item>
            <el-form-item label="民族/国籍" prop="nationality">
              <el-input v-model="form.nationality" placeholder="民族/国籍" />
            </el-form-item>
            <el-form-item label="出生日期" prop="bitrhday">
              <el-input v-model="form.bitrhday" placeholder="出生日期" />
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile" placeholder="联系电话" />
            </el-form-item>
            <el-form-item label="联系地址" prop="address">
              <el-input v-model="form.address" placeholder="联系地址" />
            </el-form-item>
            <el-form-item label="职业" prop="occupation">
              <el-input v-model="form.occupation" placeholder="职业" />
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="form.email" placeholder="电子邮箱" />
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
  addPatientProfile,
  delPatientProfile,
  getPatientProfile,
  listPatientProfile,
  updatePatientProfile
} from '@/api/patientprofile'
import { listUser } from '@/api/system/sysuser'

import FileChoose from '@/components/FileChoose'

export default {
  name: 'PatientProfile',
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
      // 表单校验
      rules: {
        name: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        createBy: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_user_sex').then((response) => {
      this.genderOptions = response.data
    })

    this.getSysUserItems()

    // this.getSysUserItems();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listPatientProfile(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.patientprofileList = response.data.list
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
        name: undefined,
        age: undefined,
        gender: undefined,
        region: undefined,
        nationality: undefined,
        bitrhday: undefined,
        mobile: undefined,
        address: undefined,
        occupation: undefined,
        email: undefined
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
    genderFormat(row) {
      return this.selectDictLabel(this.genderOptions, row.gender)
    },
    createByFormat(row) {
      return this.selectItemsLabel(this.createByOptions, row.CreateBy)
    },
    updateByFormat(row) {
      return this.selectItemsLabel(this.updateByOptions, row.UpdateBy)
    },
    // 关系
    getSysUserItems() {
      this.getItems(listUser, undefined).then((res) => {
        this.createByOptions = this.setItems(res, 'userId', 'username')
        this.updateByOptions = this.setItems(res, 'userId', 'username')
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
      this.title = '添加患者基本信息表'
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
      getPatientProfile(ID).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改患者基本信息表'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updatePatientProfile(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addPatientProfile(this.form).then((response) => {
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
          return delPatientProfile({ ids: Ids })
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
