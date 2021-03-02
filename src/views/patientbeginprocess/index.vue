
<template>
    <BasicLayout>
        <template #wrapper>
            <el-card class="box-card">
                <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
                    <el-form-item label="病历id" prop="patientRecordId"><el-input v-model="queryParams.patientRecordId" placeholder="请输入病历id" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        <el-form-item label="创建人" prop="createBy"><el-input v-model="queryParams.createBy" placeholder="请输入创建人" clearable
                                              size="small" @keyup.enter.native="handleQuery"/>
                            </el-form-item>
                        
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:patientbeginprocess:add']"
                                type="primary"
                                icon="el-icon-plus"
                                size="mini"
                                @click="handleAdd"
                        >新增
                        </el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button
                                v-permisaction="['admin:patientbeginprocess:edit']"
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
                                v-permisaction="['admin:patientbeginprocess:remove']"
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                :disabled="multiple"
                                @click="handleDelete"
                        >删除
                        </el-button>
                    </el-col>
                </el-row>

                <el-table v-loading="loading" :data="patientbeginprocessList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"/><el-table-column label="病历id" align="center" prop="patientRecordId"
                                                 :show-overflow-tooltip="true"/><el-table-column label="X光流程是否完成" align="center" prop="x_rayFlow"
                                                 :formatter="x_rayFlowFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ x_rayFlowFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="X光流程执行人" align="center" prop="x_rayBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="X光执行日期" align="center" prop="x_rayTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="问诊是否完成" align="center" prop="physicianVisits"
                                                 :formatter="physicianVisitsFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ physicianVisitsFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="问诊执行人" align="center" prop="physicianVisitsBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="问诊时间" align="center" prop="physicianVisitsTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="方案制定是否完成" align="center" prop="treatmentOptions"
                                                 :formatter="treatmentOptionsFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ treatmentOptionsFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="方案制定人" align="center" prop="treatmentOptionsBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="方案制定完成时间" align="center" prop="treatmentOptionTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="CT是否完成" align="center" prop="cT"
                                                 :formatter="cTFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ cTFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="CT完成人" align="center" prop="cTBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="CT完成时间" align="center" prop="cTTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="洗牙流程是否完成" align="center" prop="toothwash"
                                                 :formatter="toothwashFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ toothwashFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="洗牙执行人" align="center" prop="toothwashBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="洗牙完成时间" align="center" prop="toothwashTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="牙齿取模是否完成" align="center" prop="teethModulus"
                                                 :formatter="teethModulusFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ teethModulusFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="牙齿取模完成人" align="center" prop="teethModulusBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="牙齿取模时间" align="center" prop="teethModulusTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="牙齿检查是否完成" align="center" prop="teethCheck"
                                                 :formatter="teethCheckFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ teethCheckFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="牙齿检查人" align="center" prop="teethCheckBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="牙齿检查时间" align="center" prop="teethCheckTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="拍照是否完成" align="center" prop="teethPhoto"
                                                 :formatter="teethPhotoFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ teethPhotoFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="拍照执行人" align="center" prop="teethPhotoBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="拍照时间" align="center" prop="teethPhotoTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="拔牙是否完成" align="center" prop="toothExtraction"
                                                 :formatter="toothExtractionFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ toothExtractionFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="拔牙执行人" align="center" prop="toothExtractionBy"
                                                 :show-overflow-tooltip="true"/><el-table-column label="拔牙时间" align="center" prop="toothExtractionTime"
                                                 :show-overflow-tooltip="true"/><el-table-column label="是否已离店" align="center" prop="leave"
                                                 :formatter="leaveFormat" width="100">
                                    <template slot-scope="scope">
                                        {{ leaveFormat(scope.row) }}
                                    </template>
                                </el-table-column><el-table-column label="离开时间" align="center" prop="leaveTime"
                                                 :show-overflow-tooltip="true"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button
                                    v-permisaction="['admin:patientbeginprocess:edit']"
                                    size="mini"
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)"
                            >修改
                            </el-button>
                            <el-button
                                    v-permisaction="['admin:patientbeginprocess:remove']"
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
                        v-show="total>0"
                        :total="total"
                        :page.sync="queryParams.pageIndex"
                        :limit.sync="queryParams.pageSize"
                        @pagination="getList"
                />

                <!-- 添加或修改对话框 -->
                <el-dialog :title="title" :visible.sync="open" width="500px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        
                                    <el-form-item label="病历id" prop="patientRecordId">
                                        <el-input v-model="form.patientRecordId" placeholder="病历id"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="X光流程是否完成" prop="x_rayFlow">
                                        <el-radio-group v-model="form.x_rayFlow">
                                                <el-radio
                                                        v-for="dict in x_rayFlowOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="X光流程执行人" prop="x_rayBy">
                                        <el-input v-model="form.x_rayBy" placeholder="X光流程执行人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="X光执行日期" prop="x_rayTime">
                                        <el-date-picker
                                                    v-model="form.x_rayTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="问诊是否完成" prop="physicianVisits">
                                        <el-radio-group v-model="form.physicianVisits">
                                                <el-radio
                                                        v-for="dict in physicianVisitsOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="问诊执行人" prop="physicianVisitsBy">
                                        <el-input v-model="form.physicianVisitsBy" placeholder="问诊执行人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="问诊时间" prop="physicianVisitsTime">
                                        <el-date-picker
                                                    v-model="form.physicianVisitsTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="方案制定是否完成" prop="treatmentOptions">
                                        <el-radio-group v-model="form.treatmentOptions">
                                                <el-radio
                                                        v-for="dict in treatmentOptionsOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="方案制定人" prop="treatmentOptionsBy">
                                        <el-input v-model="form.treatmentOptionsBy" placeholder="方案制定人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="方案制定完成时间" prop="treatmentOptionTime">
                                        <el-date-picker
                                                    v-model="form.treatmentOptionTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="CT是否完成" prop="cT">
                                        <el-radio-group v-model="form.cT">
                                                <el-radio
                                                        v-for="dict in cTOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="CT完成人" prop="cTBy">
                                        <el-input v-model="form.cTBy" placeholder="CT完成人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="CT完成时间" prop="cTTime">
                                        <el-date-picker
                                                    v-model="form.cTTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="洗牙流程是否完成" prop="toothwash">
                                        <el-radio-group v-model="form.toothwash">
                                                <el-radio
                                                        v-for="dict in toothwashOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="洗牙执行人" prop="toothwashBy">
                                        <el-input v-model="form.toothwashBy" placeholder="洗牙执行人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="洗牙完成时间" prop="toothwashTime">
                                        <el-date-picker
                                                    v-model="form.toothwashTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="牙齿取模是否完成" prop="teethModulus">
                                        <el-radio-group v-model="form.teethModulus">
                                                <el-radio
                                                        v-for="dict in teethModulusOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="牙齿取模完成人" prop="teethModulusBy">
                                        <el-input v-model="form.teethModulusBy" placeholder="牙齿取模完成人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="牙齿取模时间" prop="teethModulusTime">
                                        <el-date-picker
                                                    v-model="form.teethModulusTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="牙齿检查是否完成" prop="teethCheck">
                                        <el-radio-group v-model="form.teethCheck">
                                                <el-radio
                                                        v-for="dict in teethCheckOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="牙齿检查人" prop="teethCheckBy">
                                        <el-input v-model="form.teethCheckBy" placeholder="牙齿检查人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="牙齿检查时间" prop="teethCheckTime">
                                        <el-date-picker
                                                    v-model="form.teethCheckTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="拍照是否完成" prop="teethPhoto">
                                        <el-radio-group v-model="form.teethPhoto">
                                                <el-radio
                                                        v-for="dict in teethPhotoOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="拍照执行人" prop="teethPhotoBy">
                                        <el-input v-model="form.teethPhotoBy" placeholder="拍照执行人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="拍照时间" prop="teethPhotoTime">
                                        <el-date-picker
                                                    v-model="form.teethPhotoTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="拔牙是否完成" prop="toothExtraction">
                                        <el-radio-group v-model="form.toothExtraction">
                                                <el-radio
                                                        v-for="dict in toothExtractionOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="拔牙执行人" prop="toothExtractionBy">
                                        <el-input v-model="form.toothExtractionBy" placeholder="拔牙执行人"
                                                      />
                                    </el-form-item>
                                    <el-form-item label="拔牙时间" prop="toothExtractionTime">
                                        <el-date-picker
                                                    v-model="form.toothExtractionTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="是否已离店" prop="leave">
                                        <el-radio-group v-model="form.leave">
                                                <el-radio
                                                        v-for="dict in leaveOptions"
                                                        :key="dict.dictValue"
                                                        :label="dict.dictValue"
                                                >{{ dict.dictLabel }}</el-radio>
                                            </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="离开时间" prop="leaveTime">
                                        <el-date-picker
                                                    v-model="form.leaveTime"
                                                    type="datetime"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                    </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-dialog>
                <FileChoose ref="fileChoose" :dialog-form-visible="fileOpen" @confirm="getImgList" @close="fileClose" />
            </el-card>
        </template>
    </BasicLayout>
</template>

<script>
    import {addPatientBeginProcess, delPatientBeginProcess, getPatientBeginProcess, listPatientBeginProcess, updatePatientBeginProcess} from '@/api/patientbeginprocess'
    import FileChoose from '@/components/FileChoose'

    export default {
        name: 'PatientBeginProcess',
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
                patientbeginprocessList: [],
                x_rayFlowOptions: [],physicianVisitsOptions: [],treatmentOptionsOptions: [],cTOptions: [],toothwashOptions: [],teethModulusOptions: [],teethCheckOptions: [],teethPhotoOptions: [],toothExtractionOptions: [],leaveOptions: [],
                // 关系表类型
                
                // 查询参数
                queryParams: {
                    pageIndex: 1,
                    pageSize: 10,
                    patientRecordId:undefined,
                    createBy:undefined,
                    
                },
                // 表单参数
                form: {
                },
                // 表单校验
                rules: {patientRecordId:
                [
                    {required: true, message: '病历id不能为空', trigger: 'blur'}
                ],
                createBy:
                [
                    {required: true, message: '创建人不能为空', trigger: 'blur'}
                ],
                }
        }
        },
        created() {
            this.getList()
            this.getDicts('clinic_yes_no').then(response => {
                this.x_rayFlowOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.physicianVisitsOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.treatmentOptionsOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.cTOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.toothwashOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.teethModulusOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.teethCheckOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.teethPhotoOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.toothExtractionOptions = response.data
            })

            this.getDicts('clinic_yes_no').then(response => {
                this.leaveOptions = response.data
            })

            },
        methods: {
            /** 查询参数列表 */
            getList() {
                this.loading = true
                listPatientBeginProcess(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.patientbeginprocessList = response.data.list
                        this.total = response.data.count
                        this.loading = false
                    }
                )
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
                patientRecordId: undefined,
                x_rayFlow: undefined,
                x_rayBy: undefined,
                x_rayTime: undefined,
                physicianVisits: undefined,
                physicianVisitsBy: undefined,
                physicianVisitsTime: undefined,
                treatmentOptions: undefined,
                treatmentOptionsBy: undefined,
                treatmentOptionTime: undefined,
                cT: undefined,
                cTBy: undefined,
                cTTime: undefined,
                toothwash: undefined,
                toothwashBy: undefined,
                toothwashTime: undefined,
                teethModulus: undefined,
                teethModulusBy: undefined,
                teethModulusTime: undefined,
                teethCheck: undefined,
                teethCheckBy: undefined,
                teethCheckTime: undefined,
                teethPhoto: undefined,
                teethPhotoBy: undefined,
                teethPhotoTime: undefined,
                toothExtraction: undefined,
                toothExtractionBy: undefined,
                toothExtractionTime: undefined,
                leave: undefined,
                leaveTime: undefined,
            }
                this.resetForm('form')
            },
            getImgList: function() {
              this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
            },
            fileClose: function() {
              this.fileOpen = false
            },
            x_rayFlowFormat(row) {
                return this.selectDictLabel(this.x_rayFlowOptions, row.x_rayFlow)
            },
            physicianVisitsFormat(row) {
                return this.selectDictLabel(this.physicianVisitsOptions, row.physicianVisits)
            },
            treatmentOptionsFormat(row) {
                return this.selectDictLabel(this.treatmentOptionsOptions, row.treatmentOptions)
            },
            cTFormat(row) {
                return this.selectDictLabel(this.cTOptions, row.cT)
            },
            toothwashFormat(row) {
                return this.selectDictLabel(this.toothwashOptions, row.toothwash)
            },
            teethModulusFormat(row) {
                return this.selectDictLabel(this.teethModulusOptions, row.teethModulus)
            },
            teethCheckFormat(row) {
                return this.selectDictLabel(this.teethCheckOptions, row.teethCheck)
            },
            teethPhotoFormat(row) {
                return this.selectDictLabel(this.teethPhotoOptions, row.teethPhoto)
            },
            toothExtractionFormat(row) {
                return this.selectDictLabel(this.toothExtractionOptions, row.toothExtraction)
            },
            leaveFormat(row) {
                return this.selectDictLabel(this.leaveOptions, row.leave)
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
                this.title = '添加患者初诊流程记录表'
                this.isEdit = false
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.ID)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset()
                const ID =
                row.ID || this.ids
                getPatientBeginProcess(ID).then(response => {
                    this.form = response.data
                    this.open = true
                    this.title = '修改患者初诊流程记录表'
                    this.isEdit = true
                })
            },
            /** 提交按钮 */
            submitForm: function () {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.form.ID !== undefined) {
                            updatePatientBeginProcess(this.form).then(response => {
                                if (response.code === 200) {
                                    this.msgSuccess('修改成功')
                                    this.open = false
                                    this.getList()
                                } else {
                                    this.msgError(response.msg)
                                }
                            })
                        } else {
                            addPatientBeginProcess(this.form).then(response => {
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
                }).then(function () {
                      return delPatientBeginProcess( { 'ids': Ids })
                }).then(() => {
                    this.getList()
                    this.msgSuccess('删除成功')
                }).catch(function () {
                })
            }
        }
    }
</script>
