<template>
    <div>
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="Your Tasks" name="self">
                    <el-row :gutter="20" class="search">
                        <el-col :span="20">
                            <el-form :inline="true" :model="formInline_Self" class="demo-form-inline">
                                <el-form-item label="Query Mode">
                                    <el-select
                                        v-model="formInline_Self.searchType"
                                        clearable
                                        placeholder="Please select query mode"
                                        class="marginRight"
                                        prop="searchType"
                                        @clear="getTaskList_Self()"
                                        @change="pageReflash_Self()"
                                    >
                                        <el-option label="Method" value="生成方法"></el-option>
                                        <el-option label="Task Name" value="任务名称"></el-option>
                                        <el-option label="Task id" value="任务id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="formInline_Self.searchType == '生成方法'" label="Method">
                                    <el-select
                                        v-model="generate_func_self"
                                        placeholder="Please select method"
                                        class="marginRight"
                                        prop="searchType"
                                        @change="
                                            pageReflash_Self();
                                            SearchTask_Self();
                                        "
                                    >
                                        <el-option
                                            v-for="item in generate_func_list"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    label="Query Content"
                                    v-show="formInline_Self.searchType != '生成方法' && formInline_Self.searchType != ''"
                                >
                                    <el-input
                                        placeholder="Please enter the query content"
                                        v-model="formInline_Self.searchTaskInfo"
                                        clearable
                                        @clear="handleSelectClear"
                                    >
                                        <el-button
                                            slot="append"
                                            @click="
                                                isFuzzySearch(0);
                                                pageReflash_Self();
                                                SearchTask_Self();
                                            "
                                            size="mini"
                                            ><i class="el-icon-search el-icon--right"></i>Precise</el-button
                                        >
                                        <el-button
                                            v-if="formInline_Self.searchType != '任务id'"
                                            slot="append"
                                            @click="
                                                isFuzzySearch(1);
                                                pageReflash_Self();
                                                SearchTask_Self();
                                            "
                                            size="mini"
                                            ><i class="el-icon-search el-icon--right"></i>Fuzzy</el-button
                                        >
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>

                    <v-table
                        :taskList="this.taskList_Self"
                        :is_root="'0'"
                        :show_point_preview="1"
                        @getList="handleGetList"
                        @delete="removeTaskById"
                        @MethodDetail="MethodDetail"
                        @methodDialogClose="methodDialogClose"
                        @showEditDialog="showEditDialog"
                        @editDialogClosed="editDialogClosed"
                        @originalfileDownload="originalfileDownloadTemp"
                        @generatefileDownload="generatefileDownloadTemp"
                        @point_cloud_preview="point_cloud_preview"
                    ></v-table>

                    <el-pagination
                        @size-change="handleSizeChange_Self"
                        @current-change="handleCurrentChange_Self"
                        :current-page.sync="queryInfo_Self.page"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="total_Self"
                    >
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="All user tasks" name="all" v-if="this.userRight === '超级管理员'">
                    <el-row :gutter="20" class="search">
                        <el-col :span="20">
                            <el-form :inline="true" :model="formInline_All" class="demo-form-inline">
                                <el-form-item label="Query Mode">
                                    <el-select
                                        v-model="formInline_All.searchType"
                                        placeholder="Please select query mode"
                                        class="marginRight"
                                        prop="searchType"
                                        clearable
                                        @clear="
                                            getTaskList_All();
                                            clearSecondSelect_All();
                                        "
                                        @change="pageReflash_All()"
                                    >
                                        <el-option label="Method" value="生成方法"></el-option>
                                        <el-option label="Task Name" value="任务名称"></el-option>
                                        <el-option label="Task id" value="任务id"></el-option>
                                        <el-option label="User id" value="用户id"></el-option>
                                        <el-option label="User Name" value="用户名"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="formInline_All.searchType == '生成方法'" label="Method">
                                    <el-select
                                        v-model="generate_func_all"
                                        placeholder="Please select method"
                                        class="marginRight"
                                        prop="searchType"
                                        @change="
                                            pageReflash_All();
                                            getTaskList_All();
                                        "
                                    >
                                        <el-option
                                            v-for="item in generate_func_list"
                                            :key="item.name"
                                            :label="item.name"
                                            :value="item.id"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                    v-show="formInline_All.searchType != '生成方法' && formInline_All.searchType != ''"
                                    label="Query Content"
                                >
                                    <el-input
                                        placeholder="Please enter the query content"
                                        v-model="formInline_All.searchTaskInfo"
                                        clearable
                                        @clear="getTaskList_All"
                                    >
                                        <el-button
                                            slot="append"
                                            @click="
                                                isFuzzySearch(0);
                                                getTaskList_All();
                                                pageReflash_All();
                                            "
                                            size="mini"
                                            ><i class="el-icon-search el-icon--right"></i>Precise</el-button
                                        >
                                        <el-button
                                            v-if="
                                                formInline_All.searchType != '任务id' &&
                                                    formInline_All.searchType != '用户id' &&
                                                    formInline_All.searchType != '用户名'
                                            "
                                            slot="append"
                                            @click="
                                                isFuzzySearch(1);
                                                getTaskList_All();
                                                pageReflash_All();
                                            "
                                            size="mini"
                                            ><i class="el-icon-search el-icon--right"></i>Fuzzy</el-button
                                        >
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <v-table
                        :taskList="this.taskList_All"
                        :is_root="'1'"
                        :show_point_preview="1"
                        @getList="handleGetList"
                        @delete="removeTaskById"
                        @MethodDetail="MethodDetail"
                        @methodDialogClose="methodDialogClose"
                        @showEditDialog="showEditDialog"
                        @editDialogClosed="editDialogClosed"
                        @originalfileDownload="originalfileDownloadTemp"
                        @generatefileDownload="generatefileDownloadTemp"
                        @point_cloud_preview="point_cloud_preview"
                    ></v-table>
                    <el-pagination
                        @size-change="handleSizeChange_All"
                        @current-change="handleCurrentChange_All"
                        :current-page.sync="queryInfo_All.page"
                        :page-size="10"
                        layout="prev, pager, next"
                        :total="total_All"
                    >
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="编辑任务信息" :visible.sync="editDialogSelfVisible" width="50%" @closed="editDialogClosed">
            <el-form :model="editForm_Self" :rules="rulesList" ref="editFormRef" label-width="120px" style="width: 90%">
                <el-form-item label="任务id">
                    <el-input v-model="editForm_Self.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="任务名" prop="name">
                    <el-input v-model="editForm_Self.name"></el-input>
                </el-form-item>
                <el-form-item label="紧急等级">
                    <!-- <el-input type="text" v-model="editForm_Self.urgency_level"></el-input> -->
                    <el-slider v-model="editForm_Self.urgency_level" :min="1" :max="5" :step="1" :marks="mark_group.marks1_5"> </el-slider>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'FGSM-激光雷达'" label="扰动幅度" prop="epsilon">
                    <!-- <el-input type="text" v-model="editForm_Self.epsilon"></el-input> -->
                    <div class="block" style="float: left; margin-right: 5px; width: 100%">
                        <!-- <el-input type="text" v-model="form.epsilon"></el-input> -->
                        <el-form-item
                            v-for="(domain, index) in editForm_Self.epsilon"
                            :label="'幅度' + (index + 1)"
                            :key="domain.key"
                            label-width="50px"
                        >
                            <el-slider
                                v-model="domain.value"
                                show-input
                                :min="0.001"
                                :max="2"
                                :step="0.001"
                                :marks="mark_group.marks0001_2"
                            >
                            </el-slider
                            ><el-button @click.prevent="removeDomain(domain)" style="margin-left: 20px">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addDomain()">新增幅度</el-button>
                            <el-button @click="resetForm('form')">重置</el-button>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达'" label="单步扰动幅度">
                    <!-- <el-input type="text" v-model="editForm_Self.ite_epsilon"></el-input> -->
                    <el-slider
                        v-model="editForm_Self.ite_epsilon"
                        show-input
                        :min="0.001"
                        :max="1"
                        :step="0.001"
                        :marks="mark_group.marks0001_1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达'" label="单步扰动幅度">
                    <!-- <el-input type="text" v-model="editForm_Self.ite_epsilon"></el-input> -->
                    <el-slider
                        v-model="editForm_Self.ite_epsilon"
                        show-input
                        :min="0.001"
                        :max="2"
                        :step="0.001"
                        :marks="mark_group.marks0001_2"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item
                    v-if="
                        this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达' ||
                            this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达'
                    "
                    label="扰动次数上限"
                >
                    <!-- <el-input type="text" v-model="editForm_Self.ite_limit"></el-input> -->
                    <!-- :marks="mark_group.marks1_1000" -->
                    <el-slider
                        v-if="this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达'"
                        v-model="editForm_Self.ite_limit"
                        show-input
                        :min="1"
                        :max="1000"
                        :step="1"
                        :marks="mark_group.marks1_1000"
                    >
                    </el-slider>
                    <!-- :marks="mark_group.marks1_15000" -->
                    <el-slider
                        v-if="this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达'"
                        v-model="editForm_Self.ite_limit"
                        show-input
                        :min="1"
                        :max="15000"
                        :step="1"
                        :marks="mark_group.marks1_15000"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="是否旋转">
                    <el-switch v-model="editForm_Self.whether_to_rotate" active-text="是" inactive-text="否"> </el-switch>
                </el-form-item>
                <el-form-item
                    style="margin-right: 5px;"
                    v-if="this.editForm_Self.augmentation_method_name === 'FGSM-激光雷达'"
                    label="单文件生成数量及参数"
                    prop="generate_per_file_and_params"
                >
                    <!-- <el-input type="number" v-model="editForm_Self.generate_per_file_and_params"></el-input> -->
                    <el-slider
                        v-model="editForm_Self.generate_per_file_and_params"
                        show-input
                        :min="1"
                        :max="100"
                        :step="1"
                        :marks="mark_group.marks1_100"
                    ></el-slider>
                </el-form-item>
                <el-form-item
                    style="margin-right: 5px; width: 500px"
                    v-if="
                        this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达' ||
                            this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达'
                    "
                    label="单文件生成数量"
                >
                    <!-- <el-input type="number" v-model="editForm_Self.generate_per_file"></el-input> -->
                    <el-slider
                        v-model="editForm_Self.generate_per_file"
                        show-input
                        :min="1"
                        :max="100"
                        :step="1"
                        :marks="mark_group.marks1_100"
                    ></el-slider>
                </el-form-item>
                <el-form-item label="严格模式">
                    <el-switch v-model="editForm_Self.strict_mode" active-text="是" inactive-text="否"> </el-switch>
                </el-form-item>
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达'"
                    label="边界约束"
                    prop="boundary_constraint"
                >
                    <!-- <el-input type="text" v-model="editForm_Self.boundary_constraint"></el-input> -->
                    <el-slider
                        v-model="editForm_Self.boundary_constraint"
                        show-input
                        :min="1"
                        :max="2"
                        :step="0.001"
                        :marks="mark_group.marks1_2"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="重新上传文件" prop="file">
                    <input type="file" id="filetemp" prop="editForm_Self.file" /><br />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogSelfVisible = false">取 消</el-button>
                <el-button type="primary" @click="editTaskInfo">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 任务详情对话框 -->
        <el-dialog
            title="Task Details"
            :visible.sync="methodDialogSelfVisible"
            width="50%"
            body-style="background-color: rgba(255, 255, 255, 0.6);"
            @close="methodDialogClose"
            destroy-on-close
        >
            <div class="user-info-list">
                Task id:
                <span>{{ methodDetail.id }}</span>
            </div>
            <div class="user-info-list">
                Task Name:
                <span>{{ methodDetail.name }}</span>
            </div>
            <div class="user-info-list">
                Urgency level:
                <span>{{ methodDetail.urgency_level }}</span>
            </div>
            <div class="user-info-list">
                Params:
                <span>{{ methodDetail.params ? methodDetail.params : 'Nothing' }}</span>
            </div>

            <div class="user-info-list">
                Task Status:
                <span>{{ methodDetail.task_status }}</span>
            </div>
            <div class="user-info-list">
                Upload the original file:
                <span>{{ methodDetail.task_have_origin_file ? 'Yes' : 'No' }}</span>
            </div>
            <div class="user-info-list">
                Generated the augmentation file:
                <span>{{ methodDetail.task_have_generate_file ? 'Yes' : 'No' }}</span>
            </div>
            <div class="user-info-list">
                Generated Data:
                <span>{{ methodDetail.generate_data_number ? methodDetail.generate_data_number : 'Nothing' }}</span>
            </div>
            <div class="user-info-list">
                Update time:
                <span>{{ methodDetail.update_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                Start time:
                <span>{{ methodDetail.start_datetime ? methodDetail.start_datetime : '未开始' | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                Completion time:
                <span>{{ methodDetail.fin_datetime ? methodDetail.start_datetime : '未结束' | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                ID of the task creator:
                <span>{{ methodDetail.master_id }}</span>
            </div>
            <div class="user-info-list">
                Username of the task creator:
                <span>{{ methodDetail.master_username }}</span>
            </div>
            <div class="user-info-list">
                Nickname of the task creator:
                <span>{{ methodDetail.master_nickname }}</span>
            </div>
            <div class="user-info-list">
                User group of task Creator:
                <span>{{ methodDetail.master_user_group }}</span>
            </div>
            <!-- <div class="user-info-list">
                任务所有者加入时间:
                <span>{{ methodDetail.master_join_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务所有者最近一次登录时间:
                <span>{{ methodDetail.master_last_login_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务所有者信息更新时间:
                <span>{{ methodDetail.master_update_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                扩增方法id:
                <span>{{ methodDetail.augmentation_method_id }}</span>
            </div>
            <div class="user-info-list">
                扩增方法名称:
                <span>{{ methodDetail.augmentation_method_name }}</span>
            </div>
            <div class="user-info-list">
                扩增方法的细节、介绍等:
                <span>{{ methodDetail.augmentation_method_details }}</span>
            </div>
            <div class="user-info-list">
                扩增类型id:
                <span>{{ methodDetail.augmentation_type_id }}</span>
            </div>
            <div class="user-info-list">
                扩增类型名称:
                <span>{{ methodDetail.augmentation_type_name }}</span>
            </div>
            <div class="user-info-list">
                扩增类型的细节、介绍等:
                <span>{{ methodDetail.augmentation_type_details }}</span>
            </div> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskException" type="warning">Mark task exception</el-button>
                <el-button @click="methodDialogSelfVisible = false">Close</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="Point cloud Preview"
            :visible.sync="previewDialogVisible"
            width="1300px"
            height="630px"
            :before-close="handleClose"
            center
        >
            <div v-loading="this.loading" element-loading-text="Loading" element-loading-spinner="el-icon-loading" style="height: 600px">
                <div class="block" v-if="!loading">
                    <span class="demonstration right">Select the point cloud for comparison</span>
                    <el-cascader
                        v-model="preview_value"
                        :options="preview_options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="previewHandleChange"
                        style="width: 800px"
                    ></el-cascader>
                    <el-button type="primary" style="margin-left: 10px" @click="changeAxios_xz">Exchange XZ </el-button>
                    <el-button type="primary" style="margin-left: 10px" @click="changeAxios_xy">Exchange XY </el-button>
                    <el-button type="primary" style="margin-left: 10px" @click="changeAxios_yz">Exchange YZ </el-button>
                    <el-carousel trigger="click" height="570px">
                        <el-carousel-item v-for="item in 2" :key="item">
                            <div v-if="item == 1" id="preview" class="juzhog"></div>
                            <div v-if="item == 2">
                                <div id="preview_original" class="view1"></div>
                                <div id="preview_generate" class="view1"></div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import 'echarts-gl';
import qs from 'qs';
import fileDownload from 'js-file-download';
import JSZip from 'jszip';
import vTable from './Table.vue';
export default {
    data() {
        const isNotNag_int = (rule, value, callback) => {
            const boolean = new RegExp('^[1-9][0-9]*$').test(value);

            if (value !== '0' && !boolean) {
                callback(new Error('请输入非负整数'));
            } else {
                callback();
            }
        };
        const generate_per_file_and_paramsRule = (rule, value, callback) => {
            if (value < 1) {
                callback(new Error('只能为大于等于1整数'));
            } else {
                callback();
            }
        };
        const isNum = (rule, value, callback) => {
            const age = /^[0-9]*$/;
            if (!age.test(value)) {
                callback(new Error('只能为非负数字'));
            } else {
                callback();
            }
        };
        const isNotNag = (rule, value, callback) => {
            if (value < 0) {
                callback(new Error('只能为非负数'));
            } else {
                callback();
            }
        };
        const epsilonRule = (rule, value, callback) => {
            value = value.replace('[', '');
            value = value.replace(']', '');
            value = value.replace('，', ',');

            var list = value.split(',');
            for (var i in list) {
                if (!typeof parseFloat(list[i]) === 'number' && !isNaN(parseFloat(list[i])) && parseFloat(list[i]) < 0) {
                    callback(new Error('请填写合理的非负数字列表'));
                } else {
                    callback();
                }
            }
        };
        return {
            mark_group: {
                marks1_2: {
                    1: '1',
                    2: {
                        style: {
                            width: '10px'
                        },
                        label: '2'
                    }
                },
                marks0001_2: {
                    0.001: '0.001',
                    2: {
                        style: {
                            width: '10px'
                        },
                        label: '2'
                    }
                },
                marks0001_1: {
                    0.001: '0.001',
                    1: {
                        style: {
                            width: '10px'
                        },
                        label: '1'
                    }
                },
                marks1_100: {
                    1: '1',
                    100: {
                        style: {
                            width: '30px'
                        },
                        label: '100'
                    }
                },
                marks1_1000: {
                    1: '1',
                    1000: {
                        style: {
                            width: '40px'
                        },
                        label: '1000'
                    }
                },
                marks1_15000: {
                    1: '1',
                    15000: {
                        style: {
                            width: '50px'
                        },
                        label: '15000'
                    }
                },
                marks0_5: {
                    0: '0',
                    5: {
                        style: {
                            width: '10px'
                        },
                        label: '5'
                    }
                },
                marks1_5: {
                    1: '1',
                    5: {
                        style: {
                            width: '10px'
                        },
                        label: '5'
                    }
                }
            },
            full_loading_flag: false,
            generate_func_self: '',
            generate_func_all: '',
            generate_func_list: [],
            queryInfo_Self: {
                page: 1
            },
            taskList_Self: [],
            total_Self: 0,
            formInline_Self: {
                searchType: '',
                searchTaskInfo: ''
            },
            editDialogSelfVisible: false,
            editForm_Self: {
                task_id: 0,
                master: this.$store.getters.userId,
                name: '',
                params: '',
                file: {},
                augmentation_method_name: ''
            },
            editFormSelfRules: {
                name: [{ required: true, message: '请输入任务名', trigger: 'blur' }]
            },
            queryInfo_All: {
                page: 1
            },
            taskList_All: [],
            total_All: 0,
            formInline_All: {
                searchType: '',
                searchTaskInfo: ''
            },
            editDialogAllVisible: false,
            editForm_All: {},
            editFormAllRules: {
                name: [{ required: true, message: '请输入任务名', trigger: 'blur' }]
            },
            FuzzySearch: 1,
            activeName: 'self',
            taskList_All: [],
            userRight: '',
            methodDialogSelfVisible: false,
            methodDetail: [],
            mohu: true,
            fileName: '',
            preview_value: [],
            preview_options: [],
            previewDialogVisible: false,
            loading: true,
            original_files_zip: null,
            generate_files_zip: null,
            originalPointCloudData: [],
            generatePointCloudData: [],
            maxAxisValue: -10000,
            minAxisValue: 10000,
            original_is_Zip: false,
            generate_is_Zip: false,
            original_fileContent: '',
            generate_fileContent: '',
            original_blob: null,
            generate_blob: null,
            test_text: 'djshdkjdhkadh',
            change_axios_buttom: false,
            editForm: {},
            rules1: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                epsilon: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: epsilonRule, trigger: 'blur' }
                ],
                generate_per_file_and_params: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                urgency_level: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag_int, trigger: 'blur' }
                ]
            },
            rules2: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                ite_epsilon: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ],
                ite_limit: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                generate_per_file: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                urgency_level: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag_int, trigger: 'blur' }
                ]
            },
            rules3: {
                augmentation_method: [{ required: true, message: '不能为空', trigger: 'change' }],
                ite_epsilon: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ],
                ite_limit: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                generate_per_file: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: generate_per_file_and_paramsRule, trigger: 'blur' },
                    { validator: isNum, trigger: 'blur' }
                ],
                boundary_constraint: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag, trigger: 'blur' }
                ],
                urgency_level: [
                    { required: true, message: '不能为空', trigger: 'blur' },
                    { validator: isNotNag_int, trigger: 'blur' }
                ]
            },
            picture: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        };
    },
    components: {
        vTable
    },
    computed: {
        rulesList: function() {
            if (this.editForm_Self.augmentation_method_name === 'FGSM') {
                return this.rules1;
            } else if (this.editForm_Self.augmentation_method_name === 'JSMA') {
                return this.rules3;
            } else {
                return this.rules2;
            }
        }
    },
    created() {
        this.userRight = window.sessionStorage.getItem('user_group_name');

        this.getTaskList_Self();
    },
    async mounted() {
        this.$store.commit('setUserId', sessionStorage.getItem('userId'));
        let data = await this.$http.get('/augmentation_method/?augmentation_type=1');
        // ?id=1
        console.log('data:', data);
        this.generate_func_list = data.data.data;
        console.log('this.generate_func_list:', this.generate_func_list);
    },
    methods: {
        // >>>>>>>>>el-tab部分>>>>>>>>>>>>>>>.
        handleClick(tab, event) {
            if (tab.index === '1') {
                this.getTaskList_All();
            }
        },
        // >>>>>>>>>>>>>获取任务列表以及查询部分>>>>>>>>>>>>>>>
        // 获取子组件getList指令
        handleSelectClear() {
            this.getTaskList_Self();
            this.generate_func_self = '';
        },
        handleGetList(data) {
            if (!data) {
                this.getTaskList_Self();
            } else {
                this.getTaskList_All();
            }
        },
        async getTaskList_Self() {
            // const { data: data } = await this.$http.get('/task/self/search/' + '?page=' + this.queryInfo_Self.page);
            const { data: data } = await this.$http.get(
                '/task/augmentation_type/search/?augmentation_type=1&page=' + this.queryInfo_Self.page
            );

            if (data.code !== 20000) {
                if (data.code === 40400) {
                    console.log('data:', data);
                    this.taskList_Self = [];
                    this.totalPageNum = 0;
                    this.total_Self = 0;
                    return this.$message.error('本用户未添加任务！');
                }

                return this.$message.error('获取本用户任务列表失败！');
            }

            this.taskList_Self = data.data.details;

            this.totalPageNum = data.data.pages;
            // if (this.queryInfo_Self.page > this.totalPageNum) {
            //     this.queryInfo_Self.page = this.totalPageNum;
            // }
            console.log('this.taskList_Self:', this.taskList_Self);

            this.total_Self = this.totalPageNum * 10;
        },
        async SearchTask_Self() {
            if (this.formInline_Self.searchType === '') {
                return this.$message.error('请输入查询方式！');
            }
            var flag = 0;
            var search_params = '';
            if (this.formInline_Self.searchType === '生成方法') {
                // search_params = '/task/augmentation_method/search/?augmentation_method=' + this.formInline_Self.searchTaskInfo;
                search_params =
                    '/task/augmentation_method/search/?augmentation_method=' +
                    this.generate_func_self +
                    '&page=' +
                    this.queryInfo_Self.page;
                console.log('this.generate_func_self:', this.generate_func_self);
                console.log('this.queryInfo_Self.page:', this.queryInfo_Self.page);
            } else {
                if (this.formInline_Self.searchTaskInfo === '') {
                    return this.$message.error('请输入搜索内容！');
                }

                if (this.formInline_Self.searchType === '任务名称') {
                    console.log('this.queryInfo_Self.page:', this.queryInfo_Self.page);
                    search_params =
                        '/task/name/search/?augmentation_type=1&task_name=' +
                        this.formInline_Self.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch +
                        '&page=' +
                        this.queryInfo_Self.page;
                } else {
                    search_params =
                        '/task/id/search/?augmentation_type=1&task_id=' +
                        this.formInline_Self.searchTaskInfo +
                        '&page=' +
                        this.queryInfo_Self.page;
                    //  +
                    // '&search_type=' +
                    // this.FuzzySearch;
                }
            }
            const { data: data } = await this.$http.get(search_params);
            console.log('data:', data);
            if (data.code !== 20000) {
                this.taskList_Self = [];
                this.total_Self = 0;
                return this.$message.error('未搜索到该任务！');
            }
            if (this.formInline_Self.searchType === '任务id') {
                flag = 1;
                this.taskList_Self = [];
                this.taskList_Self.push(data.data);
            } else {
                this.taskList_Self = data.data.details;
            }
            console.log('data:', data);
            // this.total_Self = this.taskList_Self ? this.taskList_Self.length : 0;
            this.totalPageNum = data.data.pages;
            // if (this.queryInfo_Self.page > this.totalPageNum) {
            //     this.queryInfo_Self.page = this.totalPageNum;
            // }
            this.total_Self = this.totalPageNum * 10;
            this.total_Self = this.total_Self === 10 ? this.taskList_Self.length : this.total_Self;
            if (flag) {
                this.total_Self = this.taskList_Self.length;
            }
        },
        // 获取所有用户任务列表
        async getTaskList_All() {
            console.log('this.generate_func_all:', this.generate_func_all);
            console.log('this.formInline_All.searchType:', this.formInline_All.searchType);
            if (
                this.formInline_All.searchType !== '生成方法' &&
                (this.formInline_All.searchType === '' || this.formInline_All.searchTaskInfo === '')
            ) {
                // const { data: data } = await this.$http.get('task/all/admin/search/' + '?page=' + this.queryInfo_All.page);
                const { data: data } = await this.$http.get(
                    '/task/augmentation_type/admin/search/?augmentation_type=1&page=' + this.queryInfo_All.page
                );
                if (data.code == 40400) {
                    console.log('data:', data);
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('所有用户都未添加任务！');
                }
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取任务列表失败[所有用户]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType === '用户id') {
                console.log('this.formInline_All.searchTaskInfo:', this.formInline_All.searchTaskInfo);
                const { data: data } = await this.$http.get(
                    '/task/augmentation_type/admin/search/' +
                        '?augmentation_type=1&page=' +
                        this.queryInfo_All.page +
                        '&user_id=' +
                        this.formInline_All.searchTaskInfo
                );
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取任务列表失败[用户id]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType === '任务名称') {
                const { data: data } = await this.$http.get(
                    '/task/name/admin/search/' +
                        '?augmentation_type=1&page=' +
                        this.queryInfo_All.page +
                        '&task_name=' +
                        this.formInline_All.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch
                );
                console.log('data:', data);
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取查询列表失败[任务名称]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType === '任务id') {
                const { data: data } = await this.$http.get(
                    '/task/id/admin/search/' +
                        '?augmentation_type=1&page=' +
                        this.queryInfo_All.page +
                        '&task_id=' +
                        this.formInline_All.searchTaskInfo
                );
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取查询列表失败[任务id]！' + '错误原因：' + data.msg);
                }
                console.log('data:', data);
                console.log('this.taskList_All:', this.taskList_All);
                this.taskList_Self = [];
                this.taskList_Self.push(data.data.details);
                this.totalPageNum = data.data.pages;
                // this.total_All = this.taskList_All;
                this.total_All = this.taskList_All.length;
            } else if (this.formInline_All.searchType === '生成类型id') {
                const { data: data } = await this.$http.get(
                    '/task/augmentation_type/admin/search/' +
                        '?page=' +
                        this.queryInfo_All.page +
                        '&augmentation_type=' +
                        this.formInline_All.searchTaskInfo
                );
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取查询列表失败[生成类型]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType == '生成方法') {
                console.log('here,this.generate_func_all22222:', this.generate_func_all);
                const { data: data } = await this.$http.get(
                    '/task/augmentation_method/admin/search/' +
                        '?page=' +
                        this.queryInfo_All.page +
                        '&augmentation_method=' +
                        this.generate_func_all
                );
                console.log('data:', data);
                if (data.code !== 20000) {
                    console.log('data:', data);
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取查询列表失败[生成方法]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType === '用户名') {
                console.log('username:', this.formInline_All.searchTaskInfo);
                const { data: data } = await this.$http.get(
                    '/task/master/admin/search/' +
                        '?augmentation_type=1&page=' +
                        this.queryInfo_All.page +
                        '&username=' +
                        this.formInline_All.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch
                );
                console.log('data:', data);
                if (data.code !== 20000) {
                    return this.$message.error('获取任务列表失败[用户名]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                console.log('this.taskList_All:', this.taskList_All);
                this.total_All = this.totalPageNum * 10;
            }
            // console.log('data:', data);
        },
        async generate_change(type) {
            if (type == '本用户') {
                let search_params = '/task/augmentation_method/search/?augmentation_method=' + this.generate_func_self;
                console.log('this.generate_func_self:', this.generate_func_self);
                const { data: data } = await this.$http.get(search_params);
                if (data.code !== 20000) {
                    this.taskList_Self = [];
                    this.total_Self = 0;
                    return this.$message.error('未搜索到该任务！');
                }
                console.log('data:', data);
                this.taskList_Self = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_Self = this.totalPageNum * 10;
                this.total_Self = this.total_Self === 10 ? this.taskList_Self.length : this.total_Self;
                console.log('this.total_Self:', this.total_Self);
                console.log('this.totalPageNum:', this.totalPageNum);
            } else {
                let search_params = '/task/augmentation_method/admin/search/?augmentation_method=' + this.generate_func_all;
                const { data: data } = await this.$http.get(search_params);
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.total_All = 0;
                    return this.$message.error('未搜索到该任务！');
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
                this.total_All = this.total_All ? this.taskList_All.length : 0;
            }
        },
        // 是否启用模糊搜索
        isFuzzySearch(flag) {
            this.FuzzySearch = flag;
            console.log('this.FuzzySearch:', this.FuzzySearch);
        },
        // 清空二级搜索框
        clearSecondSelect_All() {
            this.generate_func_all = '';
            this.formInline_All.searchTaskInfo = '';
        },
        clearSecondSelect_Self() {
            this.generate_func_self = '';
            this.formInline_Self.searchTaskInfo = '';
        },
        // >>>>>>>>>>分页部分>>>>>>>>>>>>>>>>>>>
        handleSizeChange_Self(newSize) {
            this.queryInfo_Self.pagesize = newSize;
            console.log('newSize-this.formInline_Self.searchType:', this.formInline_Self.searchType);
            console.log('newSize-this.queryInfo_Self.page:', this.queryInfo_Self.page);
            this.getTaskList_Self();
        },
        handleCurrentChange_Self(newPage) {
            this.queryInfo_Self.page = newPage;
            console.log('newPage-this.formInline_Self.searchType:', this.formInline_Self.searchType);
            console.log('newPage-this.queryInfo_Self.page:', this.queryInfo_Self.page);

            if (this.formInline_Self.searchTaskInfo === '' && this.generate_func_self === '') {
                this.getTaskList_Self();
            } else {
                this.SearchTask_Self();
            }
        },
        handleSizeChange_All(newSize) {
            this.queryInfo_All.pagesize = newSize;
            console.log('newSize-this.formInline_All.searchType:', this.formInline_All.searchType);
            console.log('newSize-this.queryInfo_All.page:', this.queryInfo_All.page);
            this.getTaskList_All();
        },
        handleCurrentChange_All(newPage) {
            this.queryInfo_All.page = newPage;
            console.log('newPage-this.formInline_All.searchType:', this.formInline_All.searchType);
            console.log('newPage-this.queryInfo_All.page:', this.queryInfo_All.page);
            this.getTaskList_All();
            // if (this.formInline_All.searchTaskInfo === '' && this.generate_func_all === '') {
            //     this.getTaskList_All();
            // } else {
            //     this.SearchTask_All();
            // }
            // this.queryInfo_All.page = newPage;
            // this.getTaskList_All();
        },
        pageReflash_All() {
            this.queryInfo_All.page = 1;
        },
        pageReflash_Self() {
            this.queryInfo_Self.page = 1;
        },
        // >>>>>>>>>>>>>下载文件部分>>>>>>>>>>>>>>
        originalfileDownloadTemp(data) {
            var task_id = data['task_id'];
            var flag = data['flag'];
            this.originalfileDownload(task_id, flag);
        },
        async originalfileDownload(task_id, flag) {
            const loading = this.full_loading_flag
                ? ''
                : this.$loading({
                      lock: true,
                      text: 'Loading',
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                  });
            this.original_fileContent = '';
            const data = await this.$http.get('/task/file/?task_id=' + task_id + '&file_type=0&format=json', {
                responseType: 'blob',
                headers: { 'Content-Type': 'application/json; application/octet-stream' }
            });

            console.log('data:', data);

            var file_name1 = data.headers['content-disposition'].replaceAll('/', '\\').split('\\');
            this.fileName = file_name1[file_name1.length - 1];
            this.fileName = this.fileName.slice(0, this.fileName.length - 1);
            var dot = this.fileName.lastIndexOf('.');
            this.original_is_Zip = false;
            if (dot !== -1 && this.fileName.substr(dot) === '.zip') {
                this.original_is_Zip = true;
            } else {
                this.original_blob = data.data;
            }
            if (!this.full_loading_flag) {
                loading.close();
            }
            if (!flag) {
                fileDownload(data.data, this.fileName);
            }
            return data;
        },
        generatefileDownloadTemp(data) {
            var task_id = data['task_id'];
            var flag = data['flag'];
            this.generatefileDownload(task_id, flag);
        },
        async generatefileDownload(task_id, flag) {
            const loading = this.full_loading_flag
                ? ''
                : this.$loading({
                      lock: true,
                      text: 'Loading',
                      spinner: 'el-icon-loading',
                      background: 'rgba(0, 0, 0, 0.7)'
                  });
            const data = await this.$http.get('/task/file/?task_id=' + task_id + '&file_type=1&format=json', {
                responseType: 'blob',
                headers: { 'Content-Type': 'application/json; application/octet-stream' }
            });
            var file_name1 = data.headers['content-disposition'].replaceAll('/', '\\').split('\\');
            this.fileName = file_name1[file_name1.length - 1];
            this.fileName = this.fileName.slice(0, this.fileName.length - 1);

            var dot = this.fileName.lastIndexOf('.');
            this.generate_is_Zip = false;
            if (dot !== -1 && this.fileName.substr(dot) === '.zip') {
                this.generate_is_Zip = true;
            } else {
                this.generate_blob = data.data;
            }
            if (!this.full_loading_flag) {
                loading.close();
            }
            if (!flag) {
                fileDownload(data.data, this.fileName);
            }
            return data;
        },
        // >>>>>>>>>>>>操作按钮部分>>>>>>>>>>>>>
        async removeTaskById(task_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除');
            }
            const { data: data } = await this.$http.delete('/task/?task_id=' + task_id);
            if (data.code !== 20000) {
                return this.$message.error('删除任务失败！' + '错误原因：' + data.msg);
            }
            this.$message.success('删除任务成功！');
            if (this.activeName === 'self') {
                this.queryInfo_Self.page = 1;
                if (this.formInline_Self.searchTaskInfo === '' && this.generate_func_self === '') {
                    this.getTaskList_Self();
                } else {
                    this.SearchTask_Self();
                }
            } else {
                this.queryInfo_All.page = 1;
                if (this.formInline_All.searchTaskInfo === '' && this.generate_func_all === '') {
                    this.getTaskList_All();
                } else {
                    this.SearchTask_All();
                }
            }
        },
        resetForm(formName) {
            console.log('formName:', formName);
            this.editForm_Self.epsilon = [
                {
                    value: 0
                }
            ];
        },
        removeDomain(item) {
            if (this.editForm_Self.epsilon.length == 1) {
                this.$message.error('扰动幅度不可为空!');
            } else {
                var item_index = this.editForm_Self.epsilon.indexOf(item);
                if (item_index !== -1) {
                    this.editForm_Self.epsilon.splice(item_index, 1);
                }
            }
        },
        addDomain() {
            this.editForm_Self.epsilon.push({
                value: 0,
                key: Date.now()
            });
        },
        async showEditDialog(row) {
            this.editForm_Self = JSON.parse(JSON.stringify(row));
            console.log('this.editForm_Self:', this.editForm_Self);
            this.editForm_Self.params = JSON.parse(row.params);
            for (var i in this.editForm_Self.params) {
                this.$set(this.editForm_Self, i, this.editForm_Self.params[i]);
            }
            this.editForm_Self.urgency_level = this.editForm_Self.urgency_level;
            if (this.editForm_Self.augmentation_method_name === 'FGSM-激光雷达') {
                this.editForm_Self.generate_per_file_and_params = parseInt(this.editForm_Self.generate_per_file_and_params);
            } else if (
                this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达' ||
                this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达'
            ) {
                this.editForm_Self.generate_per_file = parseInt(this.editForm_Self.generate_per_file);
                this.editForm_Self.ite_epsilon = parseFloat(this.editForm_Self.ite_epsilon);
                this.editForm_Self.boundary_constraint = parseFloat(this.editForm_Self.boundary_constraint);
                this.editForm_Self.ite_limit = parseInt(this.editForm_Self.ite_limit);
            }

            this.editForm_Self.whether_to_rotate = this.editForm_Self.whether_to_rotate === '1' ? true : false;
            this.editForm_Self.strict_mode = this.editForm_Self.strict_mode === '1' ? true : false;

            if (this.editForm_Self.augmentation_method_name === 'FGSM-激光雷达') {
                console.log('this.editForm_Self.epsilon:', this.editForm_Self.epsilon);
                var temp_array = this.editForm_Self.epsilon
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                console.log('temp_array:', temp_array);
                var temp = [];
                for (var i in temp_array) {
                    var temp_item = {};
                    temp_item.value = parseFloat(temp_array[i]);
                    temp.push(temp_item);
                }
                console.log('temp:', temp);
                this.editForm_Self.epsilon = temp;
                // this.editForm_Self.epsilon = this.editForm_Self.epsilon;
            }

            this.editDialogSelfVisible = true;
        },
        editDialogClosed() {
            this.editForm_Self = {
                task_id: 0,
                master: this.$store.getters.userId,
                name: '',
                params: '',
                file: {},
                augmentation_method_name: ''
            };
        },
        async editTaskInfo() {
            this.editForm_Self.master = this.$store.state.userId;
            // if (this.editForm_Self.epsilon) {
            //     this.editForm_Self.epsilon = this.editForm_Self.epsilon.replace('，', ',');
            // }

            var adddata = new FormData();
            adddata.append('task_id', this.editForm_Self.id);
            adddata.append('name', this.editForm_Self.name);
            adddata.append('master', this.editForm_Self.master);

            adddata.append('urgency_level', this.editForm_Self.urgency_level + '');
            var temp_params = {};

            if (this.editForm_Self.augmentation_method_name === 'FGSM-激光雷达') {
                console.log('here');
                var temp = [];
                for (var x in this.editForm_Self.epsilon) {
                    console.log('this.editForm_Self.epsilon[x]["value"]:', this.editForm_Self.epsilon[x]['value']);
                    temp.push(this.editForm_Self.epsilon[x]['value']);
                }
                temp_params.epsilon = '[' + temp.toString() + ']';
                console.log('temp_params.epsilon:', temp_params.epsilon);
                temp_params = {
                    epsilon: temp_params.epsilon,
                    whether_to_rotate: this.editForm_Self.whether_to_rotate,
                    generate_per_file_and_params: this.editForm_Self.generate_per_file_and_params + '',
                    strict_mode: this.editForm_Selfstrict_mode
                };
            } else if (this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-激光雷达') {
                temp_params = {
                    ite_epsilon: this.editForm_Self.ite_epsilon + '',
                    ite_limit: this.editForm_Self.ite_limit + '',
                    whether_to_rotate: this.editForm_Self.whether_to_rotate,
                    generate_per_file: this.editForm_Self.generate_per_file + '',
                    strict_mode: this.editForm_Self.strict_mode
                };
            } else if (this.editForm_Self.augmentation_method_name === 'JSMA-激光雷达') {
                temp_params = {
                    ite_epsilon: this.editForm_Self.ite_epsilon + '',
                    ite_limit: this.editForm_Self.ite_limit + '',
                    whether_to_rotate: this.editForm_Self.whether_to_rotate,
                    generate_per_file: this.editForm_Self.generate_per_file + '',
                    boundary_constraint: this.editForm_Self.boundary_constraint + '',
                    strict_mode: this.editForm_Self.strict_mode
                };
            }
            temp_params.whether_to_rotate = this.editForm_Self.whether_to_rotate ? '1' : '0';
            temp_params.strict_mode = this.editForm_Self.strict_mode ? '1' : '0';

            temp_params = JSON.stringify(temp_params);

            adddata.append('params', temp_params);
            this.editForm_Self.file = document.getElementById('filetemp').files[0];
            if (this.editForm_Self.file) {
                adddata.append('file', this.editForm_Self.file);
            }
            for (var [a, b] of adddata.entries()) {
                console.log(a, b);
            }
            const { data: data } = await this.$http({
                url: '/task/',
                data: adddata,
                method: 'put'
            });
            if (data.code !== 20000) {
                return this.$message.error('修改任务失败！' + '错误原因：' + data.msg);
            }
            this.$message.success('修改任务成功！');
            this.editDialogSelfVisible = false;
            this.$refs.editFormRef.resetFields();
            this.editForm_Self.augmentation_type = '';
            this.editForm_Self.augmentation_method = '';
            this.editForm_Self.file = {};
            this.getTaskList_Self();
            this.getTaskList_All();
        },
        async getdata(reader, self) {
            return (reader.onload = await function() {
                self.fileContent = this.result;
            });
        },
        // 标记任务异常
        taskException() {
            this.$confirm('是否确定将该任务标记成异常状态？')
                .then(async _ => {
                    var adddata = new FormData();
                    adddata.append('task_id', this.methodDetail.id);
                    const { data: data } = await this.$http({
                        url: '/task/exception/',
                        data: adddata,
                        method: 'post'
                    });
                    if (data.code !== 20000) {
                        return this.$message.error('添加生成任务失败！' + '错误原因：' + data.msg);
                    }
                    this.$message.success('标记成异常成功！');
                    if (this.activeName === 'self') {
                        if (this.formInline_Self.searchTaskInfo === '' && this.generate_func_self === '') {
                            this.getTaskList_Self();
                        } else {
                            this.SearchTask_Self();
                        }
                    } else {
                        if (this.formInline_All.searchTaskInfo === '' && this.generate_func_all === '') {
                            this.getTaskList_All();
                        } else {
                            this.SearchTask_All();
                        }
                    }
                })
                .catch(_ => {});
        },
        //任务详情对话框
        async MethodDetail(id) {
            // id = data
            console.log('this.methodDetail:', this.methodDetail);
            this.methodDialogSelfVisible = true;
            const { data: data } = await this.$http.get('/task/' + '?task_id=' + id);
            console.log('data:', data);
            if (data.code !== 20000) {
                return this.$message.error('获取本用户任务详情失败！' + '错误原因：' + data.msg);
            }

            this.methodDetail = data.data;
        },
        methodDialogClose() {
            console.log('this.methodDetail:', this.methodDetail);
            this.methodDetail = [];
        },
        // >>>>>>>>>>点云预览部分>>>>>>>>>>>>>>>
        // point_cloud_preview-previewHandleChange-make_format_data-get_preview
        async point_cloud_preview(task_id) {
            this.full_loading_flag = true;
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            console.log('loading:', loading);
            console.log('this.$loading.lock:', this.$loading.lock);
            // this.previewDialogVisible = true;
            var preview_options = [];
            var original_res = await this.originalfileDownload(task_id, 1);

            if (this.original_is_Zip) {
                let original_files_zip = new window.File([original_res.data], this.fileName, { type: 'zip' });

                let original_files = new JSZip();
                var orignal_names = [];
                this.original_files_zip = original_files_zip;
                let me = this;
                await original_files.loadAsync(this.original_files_zip).then(function(zip) {
                    for (var i in original_files.files) {
                        var temp_object = {};
                        orignal_names.push(i);
                        temp_object['value'] = i;
                        temp_object['label'] = i;
                        temp_object['children'] = [];
                        preview_options.push(temp_object);
                    }

                    me.original_files_zip = original_files_zip;
                });
            } else {
                var temp_object = {};
                temp_object['value'] = this.fileName;
                temp_object['label'] = this.fileName;
                temp_object['children'] = [];
                preview_options.push(temp_object);
            }
            var generate_res = await this.generatefileDownload(task_id, 1);
            if (this.generate_is_Zip) {
                let generate_files_zip = new window.File([generate_res.data], this.fileName, { type: 'zip' });
                var generate_files = new JSZip();
                var generate_names = [];
                var original_is_Zip = this.original_is_Zip;
                await generate_files.loadAsync(generate_files_zip).then(function(generate_files_zip) {
                    for (var i in generate_files.files) {
                        generate_names.push(i);
                    }

                    if (original_is_Zip) {
                        for (var i in orignal_names) {
                            for (var j in generate_names) {
                                if (generate_names[j].search(orignal_names[i]) != -1) {
                                    var temp_object = {};
                                    temp_object['value'] = generate_names[j];
                                    temp_object['label'] = generate_names[j];

                                    preview_options[i].children.push(temp_object);
                                }
                            }
                        }
                    } else {
                        for (var j in generate_names) {
                            var temp_object = {};
                            temp_object['value'] = generate_names[j];
                            temp_object['label'] = generate_names[j];
                            preview_options[0].children.push(temp_object);
                        }
                    }
                });
                this.generate_files_zip = generate_files_zip;
            } else {
                var temp_object = {};
                temp_object['value'] = this.fileName;
                temp_object['label'] = this.fileName;
                preview_options[0].children.push(temp_object);
            }
            loading.close();
            this.full_loading_flag = false;
            this.previewDialogVisible = true;
            this.$message.success('已获取文件列表，请选择需预览的文件！');
            this.preview_options = preview_options;

            this.loading = false;
        },
        make_format_data(points_name, pointscloud, flag) {
            var format_data = null;
            var dot = points_name.lastIndexOf('.');
            if (dot === -1) {
                format_data = pointscloud.replaceAll('\r\n', '\n').split('\n');
                // format_data = pointscloud.split('\r\n');
                format_data.forEach(item => {
                    let arr = item.split(' ');
                    for (var k in arr) {
                        if (parseFloat(arr[k]) > this.maxAxisValue) {
                            this.maxAxisValue = parseFloat(arr[k]);
                        }
                        if (parseFloat(arr[k]) < this.minAxisValue) {
                            this.minAxisValue = parseFloat(arr[k]);
                        }
                    }
                    if ((arr.length === 3 || arr[3] === '') && !flag) {
                        if (arr.length === 3) {
                            arr.push('0');
                        } else if (arr[3] === '') {
                            arr[3] = '0';
                        }
                    } else if ((arr.length === 3 || arr[3] === '') && flag) {
                        if (arr.length === 3) {
                            arr.push('50');
                        } else if (arr[3] === '') {
                            arr[3] = '50';
                        }
                    }
                    if (!flag) {
                        this.originalPointCloudData.push(arr);
                    } else {
                        this.generatePointCloudData.push(arr);
                    }
                });

                return;
            }
            var data_type = points_name.substr(dot);
            if (data_type === '.ply') {
                format_data = pointscloud.replaceAll('\r\n', '\n').split('\n');
                // format_data = pointscloud.split('\r\n');
                var end_header_index = -1;
                for (var i in format_data) {
                    if (format_data[i] === 'end_header') {
                        end_header_index = i;
                    }
                }

                format_data = format_data.splice(parseInt(end_header_index) + 1, format_data.length - parseInt(end_header_index) - 1);
                format_data.forEach(item => {
                    let arr = item.split(' ');
                    for (var k in arr) {
                        if (parseFloat(arr[k]) > this.maxAxisValue) {
                            this.maxAxisValue = parseFloat(arr[k]);
                        }
                        if (parseFloat(arr[k]) < this.minAxisValue) {
                            this.minAxisValue = parseFloat(arr[k]);
                        }
                    }
                    if ((arr.length === 3 || arr[3] === '') && !flag) {
                        if (arr.length === 3) {
                            arr.push('0');
                        } else if (arr[3] === '') {
                            arr[3] = '0';
                        }
                    } else if ((arr.length === 3 || arr[3] === '') && flag) {
                        if (arr.length === 3) {
                            arr.push('50');
                        } else if (arr[3] === '') {
                            arr[3] = '50';
                        }
                    }
                    if (!flag) {
                        this.originalPointCloudData.push(arr);
                    } else {
                        this.generatePointCloudData.push(arr);
                    }
                });
            } else if (data_type === '.txt') {
            } else if (data_type === '.bin') {
            }
        },
        get_preview() {
            var myChart = echarts.init(document.getElementById('preview'));
            this.option = {
                title: {
                    text: '点云生成预览'
                },
                tooltip: {
                    show: false,
                    showCcontant: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                legend: {
                    type: 'plain',
                    data: ['original_data', 'generate_data'],
                    top: '10%'
                },
                grid3D: {
                    containLabel: true,
                    viewControl: {
                        projection: 'orthographic'
                    }
                },
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: 50,
                    min: -0,
                    range: [-200, 200],
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        name: 'original_data',
                        type: 'scatter3D',
                        data: this.originalPointCloudData,
                        encode: {
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        name: 'generate_data',
                        type: 'scatter3D',
                        data: this.generatePointCloudData,
                        encode: {
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            };
            myChart.setOption(this.option);
            var myChart_original = echarts.init(document.getElementById('preview_original'));
            this.option_original = {
                title: {
                    text: '原始图'
                },
                tooltip: {
                    show: false,
                    showCcontant: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid3D: {
                    containLabel: true,
                    viewControl: {
                        projection: 'orthographic'
                    }
                },
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: 50,
                    min: -0,
                    range: [-200, 200],
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        name: 'original_data',
                        type: 'scatter3D',
                        data: this.originalPointCloudData,
                        encode: {
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            };
            myChart_original.setOption(this.option_original);
            var myChart_generate = echarts.init(document.getElementById('preview_generate'));
            this.option_generate = {
                title: {
                    text: '生成图'
                },
                tooltip: {
                    show: true,
                    showCcontant: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid3D: {
                    containLabel: true,
                    viewControl: {
                        projection: 'orthographic'
                    }
                },
                xAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                yAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                zAxis3D: {
                    type: 'value',
                    max: this.maxAxisValue.toFixed(3),
                    min: this.minAxisValue.toFixed(3)
                },
                visualMap: {
                    show: false,
                    calculable: true,
                    max: 50,
                    min: -0,
                    range: [-200, 200],
                    inRange: {
                        symbolSize: 2,
                        color: [
                            '#313695',
                            '#4575b4',
                            '#74add1',
                            '#abd9e9',
                            '#e0f3f8',
                            '#ffffbf',
                            '#fee090',
                            '#fdae61',
                            '#f46d43',
                            '#d73027',
                            '#a50026'
                        ]
                    }
                },
                series: [
                    {
                        name: 'generate_data',
                        type: 'scatter3D',
                        data: this.generatePointCloudData,
                        encode: {
                            tooltip: [0, 1, 2, 3, 4]
                        }
                    }
                ]
            };
            myChart_generate.setOption(this.option_generate);
        },
        async previewHandleChange() {
            this.originalPointCloudData = [];
            this.generatePointCloudData = [];
            var original_points_name = this.preview_value[0];
            var generate_points_name = this.preview_value[1];
            var original_pointscloud = null;
            var generate_pointscloud = null;
            if (this.original_is_Zip) {
                var original_files = new JSZip();
                await original_files.loadAsync(this.original_files_zip).then(async function(file) {
                    await original_files
                        .file(original_points_name)
                        .async('string')
                        .then(function(content) {
                            original_pointscloud = content;
                        });
                });
                this.make_format_data(original_points_name, original_pointscloud, 0);
                var generate_files = new JSZip();
                await generate_files.loadAsync(this.generate_files_zip).then(async function(generate_files_zip) {
                    await generate_files
                        .file(generate_points_name)
                        .async('string')
                        .then(function(content) {
                            generate_pointscloud = content;
                        });
                });
                this.make_format_data(generate_points_name, generate_pointscloud, 1);
            } else {
                var reader = new FileReader();
                reader.readAsText(this.original_blob);
                let me = this;

                reader.onload = async function() {
                    var original_content = this.result;

                    me.make_format_data(me.preview_options[0].value, original_content, 0);

                    if (me.generate_is_Zip) {
                        var generate_files = new JSZip();
                        await generate_files.loadAsync(me.generate_files_zip).then(async function(generate_files_zip) {
                            await generate_files
                                .file(generate_points_name)
                                .async('string')
                                .then(function(content) {
                                    generate_pointscloud = content;
                                });
                        });
                        me.make_format_data(generate_points_name, generate_pointscloud, 1);

                        me.get_preview();
                    } else {
                        var reader2 = new FileReader();
                        reader2.readAsText(this.generate_blob);

                        reader2.onload = async function() {
                            var generate_content = this.result;
                            me.make_format_data(me.preview_options[0].children.value, generate_content, 1);
                        };
                    }
                };
            }
            console.log('this.originalPointCloudData:', this.originalPointCloudData);
            console.log('this.generatePointCloudData:', this.generatePointCloudData);
            // this.generatePointCloudData = [];
            this.get_preview();
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.previewDialogVisible = false;
                    this.fileName = '';
                    this.preview_value = [];
                    this.preview_options = [];
                    this.previewDialogVisible = false;
                    this.loading = true;
                    this.original_files_zip = null;
                    this.generate_files_zip = null;
                    this.originalPointCloudData = [];
                    this.generatePointCloudData = [];
                    this.maxAxisValue = -10000;
                    this.minAxisValue = 10000;
                })
                .catch(_ => {});
        },
        changeAxios_xz() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][0], this.originalPointCloudData[i][2]] = [
                    this.originalPointCloudData[i][2],
                    this.originalPointCloudData[i][0]
                ];
            }

            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][0], this.generatePointCloudData[i][2]] = [
                    this.generatePointCloudData[i][2],
                    this.generatePointCloudData[i][0]
                ];
            }
            this.get_preview();
        },
        changeAxios_yz() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][1], this.originalPointCloudData[i][2]] = [
                    this.originalPointCloudData[i][2],
                    this.originalPointCloudData[i][1]
                ];
            }

            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][1], this.generatePointCloudData[i][2]] = [
                    this.generatePointCloudData[i][2],
                    this.generatePointCloudData[i][1]
                ];
            }
            this.get_preview();
        },
        changeAxios_xy() {
            for (var i in this.originalPointCloudData) {
                [this.originalPointCloudData[i][0], this.originalPointCloudData[i][1]] = [
                    this.originalPointCloudData[i][1],
                    this.originalPointCloudData[i][0]
                ];
            }

            for (var i in this.generatePointCloudData) {
                [this.generatePointCloudData[i][0], this.generatePointCloudData[i][1]] = [
                    this.generatePointCloudData[i][1],
                    this.generatePointCloudData[i][0]
                ];
            }
            this.get_preview();
        },
        // >>>>>>>>>>表格空白部分填充>>>>>>>>>>>>>>>>
        isBlank_num(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = '-- --';
            if (item === 0 || item === false || item) {
                value = item;
            }
            return value;
        },
        isBlank_start(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = '未开始';
            if (item === 0 || item === false || item) {
                value = item;
            }
            if (typeof value == 'string') value = value.split('+')[0].split('.')[0];
            return value;
        },
        isBlank_end(scope) {
            let key = scope.column.property,
                item = scope.row[key],
                value = '未结束';
            if (item === 0 || item === false || item) {
                value = item;
            }
            if (typeof value == 'string') value = value.split('+')[0].split('.')[0];
            return value;
        }
    }
};
</script>
<style scoped>
.juzhog {
    width: 600px;
    height: 530px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -265px;
    background-color: #fff;
}
.search {
    margin-bottom: 10px !important;
}
.right {
    margin-right: 5px !important;
}
.right10 {
    margin-right: 10px !important;
}
.user-info-list {
    padding-left: 10px;
    background-color: rgba(255, 255, 255, 0.4);
    font-size: 14px;
    color: #000;
    line-height: 25px;
}
.el-input__inner {
    width: 600px !important;
}
.view1 {
    width: 600px;
    height: 530px;
    margin: 0 10px 0 0;
    background-color: #fff;
    float: left;
}
.el-dialog {
    display: flex;
    flex-direction: column;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
    flex: 1;
    overflow: auto;
}
/* .inlineBlock {
    display: inline-block;
} */
</style>
