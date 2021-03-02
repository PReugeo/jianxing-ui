
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
          <el-form-item label="患者" prop="patientId"
            ><el-select v-model="form.patientId" placeholder="请选择">
              <el-option
                v-for="dict in patientIdOptions"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主治医生" prop="attendingPhysician"
            ><el-input
              v-model="queryParams.attendingPhysician"
              placeholder="请输入主治医生"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="病历号" prop="medicalRecord"
            ><el-input
              v-model="queryParams.medicalRecord"
              placeholder="请输入病历号"
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
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:patientrecords:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['admin:patientrecords:edit']"
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
              v-permisaction="['admin:patientrecords:remove']"
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
          :data="patientrecordsList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          /><el-table-column
            label="患者"
            align="center"
            prop="patientId"
            :formatter="patientIdFormat"
            width="100"
          >
            <template slot-scope="scope">
              <router-link :to="{ name: 'PatientRecordsData', params: { id:scope.row.ID, patientId:scope.row.patientId }}"
              class="link-type">
                {{ patientIdFormat(scope.row) }}
              </router-link>
            </template> </el-table-column
          ><el-table-column
            label="主治医生"
            align="center"
            prop="attendingPhysician"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ doctorIdFormat(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column
            label="病历号"
            align="center"
            prop="medicalRecord"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="检查目的"
            align="center"
            prop="checkPurpose"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ checkPurposeFormat(scope.row) }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="签名日期"
            align="center"
            prop="signDate"
            :show-overflow-tooltip="true"
          /> -->
          <el-table-column
            label="问诊类型"
            align="center"
            prop="interrogationType"
            :formatter="interrogationTypeFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ interrogationTypeFormat(scope.row) }}
            </template> </el-table-column
          ><el-table-column
            label="当前流程"
            align="center"
            prop="currentProcess"
            :show-overflow-tooltip="true"
          /><el-table-column
            label="下一个流程"
            align="center"
            prop="nextProcess"
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
            </template> </el-table-column
          ><el-table-column
            label="修改人"
            align="center"
            prop="UpdateBy"
            :formatter="updateByFormat"
            width="100"
          >
            <template slot-scope="scope">
              {{ updateByFormat(scope.row) }}
            </template> </el-table-column
          ><el-table-column
            label="创建时间"
            align="center"
            prop="CreatedAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.CreatedAt) }}
            </template>
          </el-table-column>

          <el-table-column
            label="更新时间"
            align="center"
            prop="UpdatedAt"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ parseTime(scope.row.UpdatedAt) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['admin:patientrecords:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改
              </el-button>
              <el-button
                v-permisaction="['admin:patientrecords:remove']"
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
            <el-form-item label="患者" prop="patientId">
              <el-input v-model="form.patientId" placeholder="患者" />
            </el-form-item>
            <el-form-item label="主治医生" prop="attendingPhysician">
              <el-input
                v-model="form.attendingPhysician"
                placeholder="主治医生"
              />
            </el-form-item>
            <el-form-item label="病历号" prop="medicalRecord">
              <el-input v-model="form.medicalRecord" placeholder="病历号" />
            </el-form-item>
            <el-form-item label="检查目的" prop="checkPurpose">
              <el-radio-group v-model="form.checkPurpose" placeholder="检查目的" >
                <el-radio
                  v-for="dict in checkPurposeTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="问诊类型" prop="interrogationType">
              <el-radio-group v-model="form.interrogationType">
                <el-radio
                  v-for="dict in interrogationTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="过敏药物" prop="allergyMedication">
              <el-input
                v-model="form.allergyMedication"
                placeholder="过敏药物"
              />
            </el-form-item>
            <el-form-item label="最近使用药物" prop="recentUsedDrugs">
              <el-input
                v-model="form.recentUsedDrugs"
                placeholder="最近使用药物"
              />
            </el-form-item>
            <el-form-item label="检查目的" prop="checkPurpose">
              <el-input v-model="form.checkPurpose" placeholder="检查目的" />
            </el-form-item>
            <el-form-item label="最近看牙日期" prop="recentMedicalDate">
              <el-input
                v-model="form.recentMedicalDate"
                placeholder="最近看牙日期"
              />
            </el-form-item>
            <el-form-item label="麻醉药物过敏" prop="isDrugAllergy">
              <el-radio-group v-model="form.isDrugAllergy">
                <el-radio
                  v-for="dict in isDrugAllergyOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="慢性病" prop="chronicDisease">
              <el-radio-group v-model="form.chronicDisease">
                <el-radio
                  v-for="dict in chronicDiseaseOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="怀孕" prop="isPregnancy">
              <el-radio-group v-model="form.isPregnancy">
                <el-radio
                  v-for="dict in isPregnancyOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="当前流程" prop="currentProcess">
              <el-input v-model="form.currentProcess" placeholder="当前流程" />
            </el-form-item>
            <el-form-item label="下一个流程" prop="nextProcess">
              <el-input v-model="form.nextProcess" placeholder="下一个流程" />
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
  addPatientRecords,
  delPatientRecords,
  getPatientRecords,
  listPatientRecords,
  updatePatientRecords,
} from "@/api/patientrecords";
import { listPatientProfile } from "@/api/patientprofile";

import { listClinicDoctors } from "@/api/clinicdoctors";

import { listUser } from "@/api/system/sysuser";

import FileChoose from "@/components/FileChoose";

export default {
  name: "PatientRecords",
  components: {
    FileChoose,
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
      title: "",
      // 是否显示弹出层
      open: false,
      isEdit: false,
      fileOpen: false,
      fileIndex: undefined,
      // 类型数据字典
      typeOptions: [],
      patientrecordsList: [],
      isDrugAllergyOptions: [],
      chronicDiseaseOptions: [],
      isPregnancyOptions: [],
      interrogationTypeOptions: [],
      checkPurposeTypeOptions: [],
      // 关系表类型
      patientIdOptions: [],
      doctorIdOptions: [],
      createByOptions: [],
      updateByOptions: [],

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        patientId: undefined,
        attendingPhysician: undefined,
        medicalRecord: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        patientId: [
          { required: true, message: "患者不能为空", trigger: "blur" },
        ],
        attendingPhysician: [
          { required: true, message: "主治医生不能为空", trigger: "blur" },
        ],
        medicalRecord: [
          { required: true, message: "病历号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getPatientProfileItems();
    this.getDoctorItems();

    this.getDicts("clinic_yes_no").then((response) => {
      this.isDrugAllergyOptions = response.data;
    });

    this.getDicts("patient_chronic_disease").then((response) => {
      this.chronicDiseaseOptions = response.data;
    });

    this.getDicts("clinic_yes_no").then((response) => {
      this.isPregnancyOptions = response.data;
    });

    this.getDicts("clinic_order_type").then((response) => {
      this.interrogationTypeOptions = response.data;
    });

    this.getDicts("patient_clinic_purpose").then((response) => {
      this.checkPurposeTypeOptions = response.data;
    });

    this.getSysUserItems();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      listPatientRecords(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.patientrecordsList = response.data.list;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ID: undefined,
        patientId: undefined,
        attendingPhysician: undefined,
        medicalRecord: undefined,
        allergyMedication: undefined,
        recentUsedDrugs: undefined,
        checkPurpose: undefined,
        recentMedicalDate: undefined,
        isDrugAllergy: undefined,
        chronicDisease: undefined,
        isPregnancy: undefined,
        signPic: undefined,
        signDate: undefined,
        interrogationType: undefined,
        physicianVisitsRes: undefined,
        treatmentOptionsRes: undefined,
        contraindications: undefined,
        currentProcess: undefined,
        nextProcess: undefined,
      };
      this.resetForm("form");
    },
    getImgList: function () {
      this.form[this.fileIndex] = this.$refs[
        "fileChoose"
      ].resultList[0].fullUrl;
    },
    fileClose: function () {
      this.fileOpen = false;
    },
    patientIdFormat(row) {
      return this.selectItemsLabel(this.patientIdOptions, row.patientId);
    },
    doctorIdFormat(row) {
      return this.selectItemsLabel(
        this.doctorIdOptions,
        row.attendingPhysician
      );
    },
    isDrugAllergyFormat(row) {
      return this.selectDictLabel(this.isDrugAllergyOptions, row.isDrugAllergy);
    },
    chronicDiseaseFormat(row) {
      return this.selectDictLabel(
        this.chronicDiseaseOptions,
        row.chronicDisease
      );
    },
    isPregnancyFormat(row) {
      return this.selectDictLabel(this.isPregnancyOptions, row.isPregnancy);
    },
    interrogationTypeFormat(row) {
      return this.selectDictLabel(
        this.interrogationTypeOptions,
        row.interrogationType
      );
    },
    checkPurposeFormat(row) {
      return this.selectDictLabel(
        this.checkPurposeTypeOptions,
        row.checkPurpose
      );
    },
    createByFormat(row) {
      return this.selectItemsLabel(this.createByOptions, row.CreateBy);
    },
    updateByFormat(row) {
      return this.selectItemsLabel(this.updateByOptions, row.UpdateBy);
    },
    // 关系
    getPatientProfileItems() {
      this.getItems(listPatientProfile, undefined).then((res) => {
        this.patientIdOptions = this.setItems(res, "ID", "name");
      });
    },
    getDoctorItems() {
      this.getItems(listClinicDoctors, undefined).then((res) => {
        this.doctorIdOptions = this.setItems(res, "ID", "name");
      });
    },
    getSysUserItems() {
      this.getItems(listUser, undefined).then((res) => {
        this.createByOptions = this.setItems(res, "userId", "username");
        this.updateByOptions = this.setItems(res, "userId", "username");
      });
    },
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加患者病历表";
      this.isEdit = false;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.ID);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ID = row.ID || this.ids;
      getPatientRecords(ID).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改患者病历表";
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.ID !== undefined) {
            updatePatientRecords(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPatientRecords(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.ID && [row.ID]) || this.ids;

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delPatientRecords({ ids: Ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
