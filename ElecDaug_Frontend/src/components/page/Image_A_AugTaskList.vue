<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-picture-outline"></i> SAR雷达对抗 </el-breadcrumb-item>
                <el-breadcrumb-item>生成任务查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-card>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="本用户" name="self">
                    <el-row :gutter="20" class="search">
                        <el-col :span="20">
                            <el-form :inline="true" :model="formInline_Self" class="demo-form-inline">
                                <el-form-item label="查询方式">
                                    <el-select
                                        v-model="formInline_Self.searchType"
                                        clearable
                                        placeholder="请选择查询方式"
                                        class="marginRight"
                                        prop="searchType"
                                        @clear="getTaskList_Self()"
                                        @change="pageReflash_Self()"
                                    >
                                        <el-option label="生成方法" value="生成方法"></el-option>
                                        <el-option label="任务名称" value="任务名称"></el-option>
                                        <el-option label="任务id" value="任务id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="formInline_Self.searchType == '生成方法'" label="生成方法">
                                    <el-select
                                        v-model="generate_func_self"
                                        placeholder="请选择生成方法"
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
                                    label="查询内容"
                                    v-show="formInline_Self.searchType != '生成方法' && formInline_Self.searchType != ''"
                                >
                                    <el-input
                                        placeholder="请输入内容"
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
                                            ><i class="el-icon-search el-icon--right"></i>精确</el-button
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
                                            ><i class="el-icon-search el-icon--right"></i>模糊</el-button
                                        >
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>

                    <v-table
                        :taskList="this.taskList_Self"
                        :is_root="'0'"
                        :show_image_preview="1"
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
                        layout=" prev, pager, next"
                        :total="total_Self"
                    >
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="所有用户" name="all" v-if="this.userRight === '超级管理员'">
                    <el-row :gutter="20" class="search">
                        <el-col :span="20">
                            <el-form :inline="true" :model="formInline_All" class="demo-form-inline">
                                <el-form-item label="查询方式">
                                    <el-select
                                        v-model="formInline_All.searchType"
                                        placeholder="请选择查询方式"
                                        class="marginRight"
                                        prop="searchType"
                                        clearable
                                        @clear="
                                            getTaskList_All();
                                            clearSecondSelect_All();
                                        "
                                        @change="pageReflash_All()"
                                    >
                                        <el-option label="生成方法" value="生成方法"></el-option>
                                        <el-option label="任务名称" value="任务名称"></el-option>
                                        <el-option label="任务id" value="任务id"></el-option>
                                        <el-option label="用户id" value="用户id"></el-option>
                                        <el-option label="用户名" value="用户名"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item v-show="formInline_All.searchType == '生成方法'" label="生成方法">
                                    <el-select
                                        v-model="generate_func_all"
                                        placeholder="请选择生成方法"
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
                                    label="查询内容"
                                >
                                    <el-input
                                        placeholder="请输入内容"
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
                                            ><i class="el-icon-search el-icon--right"></i>精确</el-button
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
                                            ><i class="el-icon-search el-icon--right"></i>模糊</el-button
                                        >
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <v-table
                        :taskList="this.taskList_All"
                        :is_root="'1'"
                        :show_image_preview="1"
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
                        layout=" prev, pager, next"
                        :total="total_All"
                    >
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog title="编辑任务信息" :visible.sync="editDialogSelfVisible" width="50%" @closed="editDialogClosed">
            <el-form :model="editForm_Self" :rules="rulesList" ref="editFormRef" label-width="110px" style="width: 90%">
                <el-form-item label="任务id">
                    <el-input v-model="editForm_Self.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="任务名">
                    <el-input v-model="editForm_Self.name"></el-input>
                </el-form-item>
                <el-form-item label="紧急等级">
                    <!-- <el-input type="text" v-model="editForm_Self.urgency_level"></el-input> -->
                    <el-slider v-model="editForm_Self.urgency_level" :min="1" :max="5" :step="1" :marks="mark_group.marks1_5"> </el-slider>
                </el-form-item>
                <!-- 4 -->
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'FGSM-合成孔径雷达'" label="扰动幅度" prop="epsilon">
                    <!-- <el-input type="text" v-model="editForm_Self.epsilon"></el-input> -->
                    <el-radio v-model="radio_epsilon_4" label="1">列表</el-radio>
                    <el-radio v-model="radio_epsilon_4" label="2">范围</el-radio>
                    <div style="margin-right: 5px" v-if="radio_epsilon_4 == '1'">
                        <!-- <el-input v-if="radio_epsilon_4 == '1'" type="text" v-model="form.epsilon_4"></el-input> -->
                        <el-form-item v-for="(domain, index) in domain_4" :label="'幅度' + index" :key="domain.key" label-width="50px">
                            <el-slider v-model="domain.value" show-input :min="0.1" :max="255" :step="0.1" :marks="mark_group.mark01_255">
                            </el-slider
                            ><el-button @click.prevent="removeDomain(domain, 4)" style="margin-left: 20px">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addDomain(4)">新增幅度</el-button>
                            <el-button @click="resetForm('form', 4)">重置</el-button>
                        </el-form-item>
                    </div>

                    <el-slider
                        v-if="radio_epsilon_4 == '2'"
                        v-model="range_epsilon_4"
                        range
                        :min="0.1"
                        :max="255"
                        :step="0.1"
                        :marks="mark_group.mark01_255"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'FGSM-合成孔径雷达' && radio_epsilon_4 == '2'"
                    prop="generate_per_file"
                    label="单文件生成数量"
                >
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->

                        <el-slider v-model="editForm_Self.generate_per_file" :min="1" :max="50" show-input> </el-slider>
                    </div>
                </el-form-item>
                <!-- 5 -->
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-合成孔径雷达'"
                    label="扰动幅度"
                    prop="epsilon"
                >
                    <!-- <el-input type="text" v-model="editForm_Self.epsilon"></el-input> -->
                    <el-radio v-model="radio_epsilon_5" label="1">列表</el-radio>
                    <el-radio v-model="radio_epsilon_5" label="2">范围</el-radio>
                    <div style="margin-right: 5px" v-if="radio_epsilon_5 == '1'">
                        <el-form-item v-for="(domain, index) in domain_5" :label="'幅度' + index" :key="domain.key" label-width="50px">
                            <el-slider v-model="domain.value" show-input :min="0.1" :max="255" :step="0.1" :marks="mark_group.mark01_255">
                            </el-slider
                            ><el-button @click.prevent="removeDomain(domain, 5)" style="margin-left: 20px">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addDomain(5)">新增幅度</el-button>
                            <el-button @click="resetForm('form', 5)">重置</el-button>
                        </el-form-item>
                    </div>

                    <el-slider
                        v-if="radio_epsilon_5 == '2'"
                        v-model="range_epsilon_5"
                        range
                        :min="0.1"
                        :max="255"
                        :step="0.1"
                        :marks="mark_group.mark01_255"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-合成孔径雷达' && radio_epsilon_5 == '2'"
                    prop="generate_per_file"
                    label="单文件生成数量"
                >
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <!-- <el-input type="number" v-model="form.generate_per_file_and_params"></el-input> -->

                        <el-slider v-model="editForm_Self.generate_per_file" :min="1" :max="50" show-input> </el-slider>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-合成孔径雷达'" label="迭代次数上限">
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <!-- <el-input type="number" v-model="form.ite_limit"></el-input> -->
                        <el-slider v-model="editForm_Self.ite_limit" :min="1" :max="50" show-input :marks="mark_group.mark1_50">
                        </el-slider>
                    </div>
                </el-form-item>
                <!-- 6 -->
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达'"
                    label="单步扰动幅度"
                    prop="range_epsilon_6"
                >
                    <el-radio v-model="radio_epsilon_6" label="1">列表</el-radio>
                    <el-radio v-model="radio_epsilon_6" label="2">范围</el-radio>

                    <div style="margin-right: 5px" v-if="radio_epsilon_6 == '1'">
                        <el-form-item v-for="(domain, index) in domain_6" :label="'幅度' + index" :key="domain.key" label-width="50px">
                            <el-slider v-model="domain.value" show-input :min="0.1" :max="255" :step="0.1" :marks="mark_group.mark01_255">
                            </el-slider
                            ><el-button @click.prevent="removeDomain(domain, 6)" style="margin-left: 20px">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addDomain(6)">新增幅度</el-button>
                            <el-button @click="resetForm('form', 6)">重置</el-button>
                        </el-form-item>
                    </div>

                    <el-slider
                        v-if="radio_epsilon_6 == '2'"
                        v-model="range_epsilon_6"
                        range
                        :min="0.1"
                        :max="255"
                        :step="0.1"
                        :marks="mark_group.mark01_255"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item
                    v-if="radio_epsilon_6 == '2' && this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达'"
                    label="单文件生成数量"
                    prop="generate_per_file"
                >
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <el-slider v-model="editForm_Self.generate_per_file" :min="1" :max="50" show-input=""> </el-slider>
                    </div>
                </el-form-item>
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达'"
                    label="最多扰动特征数比例"
                    prop="gamma"
                >
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <el-slider v-model="editForm_Self.gamma" :min="1" :max="100" :marks="ite_limit_bili_marks"> </el-slider>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达'" label="定向攻击标签" prop="target">
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <el-cascader v-model="directional_id" :options="directional" :props="{ expandTrigger: 'hover' }"></el-cascader>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达'" label="攻击方向" prop="positive">
                    <el-radio v-model="editForm_Self.positive" label="1">正向</el-radio>
                    <el-radio v-model="editForm_Self.positive" label="0">负向</el-radio>
                </el-form-item>
                <!-- 7 -->
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'SIMBA-合成孔径雷达'" label="扰动幅度" prop="epsilon">
                    <el-radio v-model="radio_epsilon_7" label="1">列表</el-radio>
                    <el-radio v-model="radio_epsilon_7" label="2">范围</el-radio>
                    <div style="margin-right: 5px" v-if="radio_epsilon_7 == '1'">
                        <el-form-item v-for="(domain, index) in domain_7" :label="'幅度' + index" :key="domain.key" label-width="50px">
                            <el-slider v-model="domain.value" show-input :min="0.1" :max="255" :step="0.1" :marks="mark_group.mark01_255">
                            </el-slider
                            ><el-button @click.prevent="removeDomain(domain, 7)" style="margin-left: 20px">删除</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addDomain(7)">新增幅度</el-button>
                            <el-button @click="resetForm('form', 7)">重置</el-button>
                        </el-form-item>
                    </div>

                    <el-slider
                        v-if="radio_epsilon_7 == '2'"
                        v-model="range_epsilon_7"
                        range
                        :min="0.1"
                        :max="255"
                        :step="0.1"
                        :marks="mark_group.mark01_255"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item
                    v-if="this.editForm_Self.augmentation_method_name === 'SIMBA-合成孔径雷达' && radio_epsilon_7 == '2'"
                    prop="generate_per_file"
                    label="单文件生成数量"
                >
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <el-slider v-model="editForm_Self.generate_per_file" :min="1" :max="50" show-input> </el-slider>
                    </div>
                </el-form-item>
                <el-form-item v-if="this.editForm_Self.augmentation_method_name === 'SIMBA-合成孔径雷达'" label="迭代次数" prop="num_iters">
                    <div class="block" style="float: left; margin-right: 20px; width: 100%">
                        <el-slider v-model="editForm_Self.num_iters" :min="1" :max="50" show-input="" :marks="mark_group.mark1_50">
                        </el-slider>
                    </div>
                </el-form-item>

                <el-form-item label="严格模式">
                    <el-switch v-model="editForm_Self.strict_mode" active-text="是" inactive-text="否"> </el-switch>
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
            title="生成任务详情"
            :visible.sync="methodDialogSelfVisible"
            width="50%"
            body-style="background-color: rgba(255, 255, 255, 0.6);"
            @close="methodDialogClose"
            destroy-on-close
        >
            <div class="user-info-list">
                任务id：
                <span>{{ methodDetail.id }}</span>
            </div>
            <div class="user-info-list">
                任务名称：
                <span>{{ methodDetail.name }}</span>
            </div>
            <div class="user-info-list">
                紧急等级：
                <span>{{ methodDetail.urgency_level }}</span>
            </div>
            <div class="user-info-list">
                任务参数：
                <span>{{ methodDetail.params ? methodDetail.params : '暂无' }}</span>
            </div>
            <div class="user-info-list">
                任务状态：
                <span>{{ methodDetail.task_status }}</span>
            </div>
            <div class="user-info-list">
                是否上传原型文件：
                <span>{{ methodDetail.task_have_origin_file ? '是' : '否' }}</span>
            </div>
            <div class="user-info-list">
                是否生成扩增文件：
                <span>{{ methodDetail.task_have_generate_file ? '是' : '否' }}</span>
            </div>
            <div class="user-info-list">
                任务扩增数据数量：
                <span>{{ methodDetail.generate_data_number ? methodDetail.generate_data_number : '暂无' }}</span>
            </div>
            <div class="user-info-list">
                任务数据更新时间：
                <span>{{ methodDetail.update_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务开始时间：
                <span>{{ methodDetail.start_datetime ? methodDetail.start_datetime : '未开始' | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务结束时间：
                <span>{{ methodDetail.fin_datetime ? methodDetail.start_datetime : '未结束' | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务所有者id：
                <span>{{ methodDetail.master_id }}</span>
            </div>
            <div class="user-info-list">
                任务所有者username：
                <span>{{ methodDetail.master_username }}</span>
            </div>
            <div class="user-info-list">
                任务所有者nickname：
                <span>{{ methodDetail.master_nickname }}</span>
            </div>
            <div class="user-info-list">
                任务所有者用户组：
                <span>{{ methodDetail.master_user_group }}</span>
            </div>
            <div class="user-info-list">
                任务所有者加入时间：
                <span>{{ methodDetail.master_join_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务所有者最近一次登录时间：
                <span>{{ methodDetail.master_last_login_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                任务所有者信息更新时间：
                <span>{{ methodDetail.master_update_datetime | dateFormat }}</span>
            </div>
            <div class="user-info-list">
                扩增方法id：
                <span>{{ methodDetail.augmentation_method_id }}</span>
            </div>
            <div class="user-info-list">
                扩增方法名称：
                <span>{{ methodDetail.augmentation_method_name }}</span>
            </div>
            <div class="user-info-list">
                扩增方法的细节、介绍等：
                <span>{{ methodDetail.augmentation_method_details }}</span>
            </div>
            <div class="user-info-list">
                扩增类型id：
                <span>{{ methodDetail.augmentation_type_id }}</span>
            </div>
            <div class="user-info-list">
                扩增类型名称：
                <span>{{ methodDetail.augmentation_type_name }}</span>
            </div>
            <div class="user-info-list">
                扩增类型的细节、介绍等：
                <span>{{ methodDetail.augmentation_type_details }}</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskException" type="warning">标记任务异常</el-button>
                <el-button @click="methodDialogSelfVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="生成图像预览"
            :visible.sync="previewDialogVisible"
            width="1300px"
            height="630px"
            :before-close="handleClose"
            @close="previewClose"
            center
        >
            <div v-loading="this.loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" style="height: 650px">
                <div v-if="!loading">
                    <span class="demonstration right">选择对比图像</span>
                    <el-cascader
                        v-model="preview_value"
                        :options="preview_options"
                        :props="{ expandTrigger: 'hover' }"
                        @change="previewHandleChange"
                        style="width: 800px"
                    ></el-cascader>
                    <div class="demo-image__error" style="margin-top: 30px">
                        <el-row :gutter="30">
                            <el-col :span="1">
                                <div style="width: 100px; height: 500px"></div>
                            </el-col>
                            <el-col :span="11">
                                <el-image style="width: 555px; height: 555px" :src="originalpicture">
                                    <div slot="error" class="image-slot">
                                        <img src="../../assets/defaultImg.png" alt="" class="lidarPic" />
                                    </div>
                                </el-image>
                            </el-col>
                            <el-col :span="11">
                                <el-image style="width: 555px; height: 555px" :src="generatepicture">
                                    <div slot="error" class="image-slot">
                                        <img src="../../assets/defaultImg.png" alt="" class="lidarPic" />
                                    </div>
                                </el-image>
                            </el-col>
                            <el-col :span="1">
                                <div style="width: 100px; height: 500px"></div>
                            </el-col>
                        </el-row>
                    </div>
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
        const isNotNag_int_urg = (rule, value, callback) => {
            const boolean = new RegExp('^[1-9][0-9]*$').test(value);

            if (value !== 0 && !boolean) {
                callback(new Error('请输入非负整数'));
            } else {
                callback();
            }
        };
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
            ite_limit_bili_marks: {
                1: '1%',
                100: {
                    style: {
                        width: '50px'
                    },
                    label: '100%'
                }
            },
            directional: [
                {
                    value: '0',
                    label: '定向',
                    children: [
                        {
                            value: '0',
                            label: '2S1'
                        },
                        {
                            value: '1',
                            label: 'BMP2'
                        },
                        {
                            value: '2',
                            label: 'BRDM_2'
                        },
                        {
                            value: '3',
                            label: 'BTR60'
                        },
                        {
                            value: '4',
                            label: 'BTR70'
                        },
                        {
                            value: '5',
                            label: 'D7'
                        },
                        {
                            value: '6',
                            label: 'T62'
                        },
                        {
                            value: '7',
                            label: 'T72'
                        },
                        {
                            value: '8',
                            label: 'ZIL131'
                        },
                        {
                            value: '9',
                            label: 'ZSU_23_4'
                        }
                    ]
                },
                {
                    value: '10',
                    label: '非定向',
                    children: [
                        {
                            // Guassian_noise
                            value: '10',
                            label: '随机'
                        }
                    ]
                }
            ],
            directional_id: [null, null],
            mark_group: {
                mark1_50: {
                    1: '1',
                    50: {
                        style: {
                            width: '20px'
                        },
                        label: '50'
                    }
                },
                mark0: {
                    0: '0'
                },
                mark01_255: {
                    0.1: '0.1',
                    255: {
                        style: {
                            width: '50px'
                        },
                        label: '255'
                    }
                },
                marks0_5: {
                    0: '0',
                    5: '5'
                },
                marks1_5: {
                    1: '1',
                    5: '5'
                }
            },
            radio_epsilon_4: '1',
            radio_epsilon_5: '1',
            radio_epsilon_6: '1',
            radio_epsilon_7: '1',
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
            domain_4: [
                {
                    value: 0
                }
            ],
            domain_5: [
                {
                    value: 0
                }
            ],
            domain_6: [
                {
                    value: 0
                }
            ],
            domain_7: [
                {
                    value: 0
                }
            ],
            range_epsilon_7: [0.1, 0.1],
            range_epsilon_4: [0.1, 0.1],
            range_epsilon_5: [0.1, 0.1],
            range_epsilon_6: [0.1, 0.1],
            editForm_Self: {
                task_id: 0,
                master: this.$store.getters.userId,
                name: '',
                params: '',
                file: {},
                augmentation_method_name: '',

                epsilon_7: null,
                epsilon_4: null,
                epsilon_5: null,
                epsilon_6: null
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
            // originalpicture: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            // generatepicture: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            originalpicture: null,
            generatepicture: null,
            tempurl: null
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
        let data = await this.$http.get('/augmentation_method/?augmentation_type=3');
        // ?id=1
        console.log('data:', data);
        this.generate_func_list = data.data.data;
        // console.log('this.generate_func_list:', this.generate_func_list);
    },
    methods: {
        resetForm(formName, index) {
            console.log('formName:', formName);
            // this.$refs[formName].resetFields();
            if (index == 4) {
                this.domain_4 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 5) {
                this.domain_5 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 6) {
                this.domain_6 = [
                    {
                        value: 0
                    }
                ];
            } else if (index == 7) {
                this.domain_7 = [
                    {
                        value: 0
                    }
                ];
            }
        },

        removeDomain(item, index) {
            if (index == 4) {
                if (this.domain_4.length == 1) {
                    this.$message.error('扰动幅度不可为空!');
                } else {
                    var item_index = this.domain_4.indexOf(item);
                    if (item_index !== -1) {
                        this.domain_4.splice(item_index, 1);
                    }
                }
            } else if (index == 5) {
                if (this.domain_5.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.domain_5.indexOf(item);
                    if (item_index !== -1) {
                        this.domain_5.splice(item_index, 1);
                    }
                }
            } else if (index == 6) {
                if (this.domain_6.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.domain_6.indexOf(item);
                    if (item_index !== -1) {
                        this.domain_6.splice(item_index, 1);
                    }
                }
            } else if (index == 7) {
                if (this.domain_7.length == 1) {
                    this.$message.error('单步扰动幅度不可为空!');
                } else {
                    var item_index = this.domain_7.indexOf(item);
                    if (item_index !== -1) {
                        this.domain_7.splice(item_index, 1);
                    }
                }
            }
        },
        addDomain(index) {
            if (index == 4) {
                this.domain_4.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 5) {
                this.domain_5.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 6) {
                this.domain_6.push({
                    value: 0,
                    key: Date.now()
                });
            } else if (index == 7) {
                this.domain_7.push({
                    value: 0,
                    key: Date.now()
                });
            }
        },
        previewClose() {
            this.originalpicture = null;
            this.generatepicture = null;
        },
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
                '/task/augmentation_type/search/?augmentation_type=3&page=' + this.queryInfo_Self.page
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
            // console.log('this.taskList_Self:', this.taskList_Self);

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
                    search_params =
                        '/task/name/search/?augmentation_type=3&task_name=' +
                        this.formInline_Self.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch +
                        '&page=' +
                        this.queryInfo_Self.page;
                } else {
                    search_params =
                        '/task/id/search/?augmentation_type=3&task_id=' +
                        this.formInline_Self.searchTaskInfo +
                        '&page=' +
                        this.queryInfo_Self.page;
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
                    '/task/augmentation_type/admin/search/?augmentation_type=3&page=' + this.queryInfo_All.page
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
                const { data: data } = await this.$http.get(
                    '/task/augmentation_type/admin/search/' +
                        '?augmentation_type=3&page=' +
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
                        '?augmentation_type=3&page=' +
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
                        '?augmentation_type=3&page=' +
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
            } else if (this.formInline_All.searchType === '生成方法') {
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
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
                    return this.$message.error('获取查询列表失败[生成方法]！' + '错误原因：' + data.msg);
                }
                this.taskList_All = data.data.details;
                this.totalPageNum = data.data.pages;
                this.total_All = this.totalPageNum * 10;
            } else if (this.formInline_All.searchType === '用户名') {
                const { data: data } = await this.$http.get(
                    '/task/master/admin/search/' +
                        '?augmentation_type=3&page=' +
                        this.queryInfo_All.page +
                        '&username=' +
                        this.formInline_All.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch
                );
                if (data.code !== 20000) {
                    this.taskList_All = [];
                    this.totalPageNum = 0;
                    this.total_All = 0;
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
                contentType: 'application/x-www-form-urlencoded'
            });
            console.log('original_image_data:', data);
            var file_name1 = data.headers['content-disposition'].replaceAll('/', '\\').split('\\');
            this.fileName = file_name1[file_name1.length - 1];
            this.fileName = this.fileName.slice(0, this.fileName.length - 1);
            var dot = this.fileName.lastIndexOf('.');
            this.original_is_Zip = false;
            if (dot !== -1 && this.fileName.substr(dot) === '.zip') {
                this.original_is_Zip = true;
            } else {
                this.original_blob = data.data;
                console.log('this.original_blob:', this.original_blob);
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
        blobToBase64(blob) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.onload = e => {
                    resolve(e.target.result);
                };
                // readAsDataURL
                console.log('blob:', typeof blob);
                fileReader.readAsDataURL(blob);

                fileReader.onerror = () => {
                    reject(new Error('blobToBase64 error'));
                };
            });
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
        async showEditDialog(row) {
            this.editForm_Self = JSON.parse(JSON.stringify(row));
            this.editForm_Self.params = JSON.parse(row.params);
            for (var i in this.editForm_Self.params) {
                this.$set(this.editForm_Self, i, this.editForm_Self.params[i]);
            }
            this.editForm_Self.urgency_level = this.editForm_Self.urgency_level;
            this.editForm_Self.strict_mode = this.editForm_Self.strict_mode === '1' ? true : false;

            if (this.editForm_Self.augmentation_method_name === 'FGSM-合成孔径雷达') {
                if (this.editForm_Self.generate_per_file) {
                    console.log('扰动为范围');
                    this.radio_epsilon_4 = '2';
                    this.range_epsilon_4 = [];
                    this.range_epsilon_4.push(parseFloat(this.editForm_Self.epsilon_lower_limit));
                    this.range_epsilon_4.push(parseFloat(this.editForm_Self.epsilon_upper_limit));
                    this.editForm_Self.generate_per_file = parseInt(this.editForm_Self.generate_per_file);
                    console.log('this.editForm_Self:', this.editForm_Self);
                } else {
                    console.log('扰动为列表');
                    this.radio_epsilon_4 = '1';
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
                    this.domain_4 = temp;
                }
            } else if (this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-合成孔径雷达') {
                this.editForm_Self.ite_limit = parseInt(this.editForm_Self.ite_limit);
                if (this.editForm_Self.generate_per_file) {
                    console.log('扰动为范围');
                    this.radio_epsilon_5 = '2';
                    this.range_epsilon_5 = [];
                    this.range_epsilon_5.push(parseFloat(this.editForm_Self.epsilon_lower_limit));
                    this.range_epsilon_5.push(parseFloat(this.editForm_Self.epsilon_upper_limit));
                    this.editForm_Self.generate_per_file = parseInt(this.editForm_Self.generate_per_file);
                    console.log('this.editForm_Self:', this.editForm_Self);
                } else {
                    console.log('扰动为列表');
                    this.radio_epsilon_5 = '1';
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
                    this.domain_5 = temp;
                }
            } else if (this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达') {
                this.editForm_Self.gamma = parseFloat(this.editForm_Self.gamma) * 100;
                // this.editForm_Self.positive = this.editForm_Self.positive === '1' ? true : false;
                if (this.editForm_Self.target) {
                    this.directional_id = ['0', this.editForm_Self.target];
                } else {
                    this.directional_id = ['10', '10'];
                }
                if (this.editForm_Self.generate_per_file) {
                    console.log('扰动为范围');
                    this.radio_epsilon_6 = '2';
                    this.range_epsilon_6 = [];
                    this.range_epsilon_6.push(parseFloat(this.editForm_Self.epsilon_lower_limit));
                    this.range_epsilon_6.push(parseFloat(this.editForm_Self.epsilon_upper_limit));
                    this.editForm_Self.generate_per_file = parseInt(this.editForm_Self.generate_per_file);
                    console.log('this.editForm_Self:', this.editForm_Self);
                } else {
                    console.log('扰动为列表');
                    this.radio_epsilon_6 = '1';
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
                    this.domain_6 = temp;
                }
            } else if (this.editForm_Self.augmentation_method_name === 'SIMBA-合成孔径雷达') {
                this.editForm_Self.num_iters = parseInt(this.editForm_Self.num_iters);
                if (this.editForm_Self.generate_per_file) {
                    console.log('扰动为范围');
                    this.radio_epsilon_7 = '2';
                    this.range_epsilon_7 = [];
                    this.range_epsilon_7.push(parseFloat(this.editForm_Self.epsilon_lower_limit));
                    this.range_epsilon_7.push(parseFloat(this.editForm_Self.epsilon_upper_limit));
                    this.editForm_Self.generate_per_file = parseInt(this.editForm_Self.generate_per_file);
                    console.log('this.editForm_Self:', this.editForm_Self);
                } else {
                    console.log('扰动为列表');
                    this.radio_epsilon_7 = '1';
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
                    this.domain_7 = temp;
                }
            }

            console.log('this.editForm_Self:', this.editForm_Self);
            // console.log('this.domain_4:', this.domain_4);
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
            this.domain_4 = [
                {
                    value: 0
                }
            ];
            this.domain_5 = [
                {
                    value: 0
                }
            ];
            this.domain_6 = [
                {
                    value: 0
                }
            ];
            this.domain_7 = [
                {
                    value: 0
                }
            ];
            this.range_epsilon_7 = [0.1, 0.1];
            this.range_epsilon_4 = [0.1, 0.1];
            this.range_epsilon_5 = [0.1, 0.1];
            this.range_epsilon_6 = [0.1, 0.1];
            this.radio_epsilon_4 = '1';
            this.radio_epsilon_5 = '1';
            this.radio_epsilon_6 = '1';
            this.radio_epsilon_7 = '1';
        },
        editTaskInfo() {
            this.editForm_Self.master = this.$store.state.userId;
            if (this.editForm_Self.epsilon) {
                this.editForm_Self.epsilon = this.editForm_Self.epsilon.replace('，', ',');
            }
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return;

                var adddata = new FormData();
                adddata.append('task_id', this.editForm_Self.id);
                adddata.append('name', this.editForm_Self.name);
                adddata.append('master', this.editForm_Self.master);

                adddata.append('urgency_level', this.editForm_Self.urgency_level);
                var temp_params = {};
                temp_params.strict_mode = this.editForm_Self.strict_mode ? '1' : '0';
                if (this.editForm_Self.augmentation_method_name === 'FGSM-合成孔径雷达') {
                    if (this.radio_epsilon_4 == '1') {
                        console.log('扰动为列表');
                        var temp = [];
                        for (var x in this.domain_4) {
                            console.log('this.domain_4[x]["value"]:', this.domain_4[x]['value']);
                            temp.push(this.domain_4[x]['value']);
                        }
                        temp_params.epsilon = '[' + temp.toString() + ']';
                    } else {
                        console.log('扰动为范围');
                        temp_params.epsilon_upper_limit = this.range_epsilon_4[1] + '';
                        temp_params.epsilon_lower_limit = this.range_epsilon_4[0] + '';
                        temp_params.generate_per_file = this.editForm_Self.generate_per_file + '';
                    }
                    console.log('temp_params:', temp_params);
                } else if (this.editForm_Self.augmentation_method_name === 'I-FGSM(BIM)-合成孔径雷达') {
                    temp_params.ite_limit = this.editForm_Self.ite_limit + '';
                    if (this.radio_epsilon_5 == '1') {
                        console.log('扰动为列表[发送5]');
                        var temp = [];
                        for (var x in this.domain_5) {
                            console.log('this.domain_5[x]["value"]:', this.domain_5[x]['value']);
                            temp.push(this.domain_5[x]['value']);
                        }
                        temp_params.epsilon = '[' + temp.toString() + ']';
                    } else {
                        console.log('扰动为范围[发送5]');
                        temp_params.epsilon_upper_limit = this.range_epsilon_5[1] + '';
                        temp_params.epsilon_lower_limit = this.range_epsilon_5[0] + '';
                        temp_params.generate_per_file = this.editForm_Self.generate_per_file + '';
                    }
                    console.log('temp_params:', temp_params);
                } else if (this.editForm_Self.augmentation_method_name === 'JSMA-合成孔径雷达') {
                    temp_params.gamma = this.editForm_Self.gamma / 100.0 + '';
                    temp_params.positive = this.editForm_Self.positive;

                    console.log('this.directional_id:', this.directional_id);
                    if (this.directional_id[1] != '10') {
                        temp_params.target = this.directional_id[1];
                    }

                    if (this.radio_epsilon_6 == '1') {
                        console.log('扰动为列表[发送6]');
                        var temp = [];
                        for (var x in this.domain_6) {
                            console.log('this.domain_6[x]["value"]:', this.domain_6[x]['value']);
                            temp.push(this.domain_6[x]['value']);
                        }
                        temp_params.epsilon = '[' + temp.toString() + ']';
                    } else {
                        console.log('扰动为范围[发送6]');
                        temp_params.epsilon_upper_limit = this.range_epsilon_6[1] + '';
                        temp_params.epsilon_lower_limit = this.range_epsilon_6[0] + '';
                        temp_params.generate_per_file = this.editForm_Self.generate_per_file + '';
                    }
                    console.log('temp_params:', temp_params);
                } else if (this.editForm_Self.augmentation_method_name === 'SIMBA-合成孔径雷达') {
                    temp_params.num_iters = this.editForm_Self.num_iters + '';
                    if (this.radio_epsilon_7 == '1') {
                        console.log('扰动为列表[发送7]');
                        var temp = [];
                        console.log('this.domain_7:', this.domain_7);
                        for (var x in this.domain_7) {
                            console.log('this.domain_7[x]["value"]:', this.domain_7[x]['value']);
                            temp.push(this.domain_7[x]['value']);
                        }
                        temp_params.epsilon = '[' + temp.toString() + ']';
                    } else {
                        console.log('扰动为范围[发送7]');
                        temp_params.epsilon_upper_limit = this.range_epsilon_7[1] + '';
                        temp_params.epsilon_lower_limit = this.range_epsilon_7[0] + '';
                        temp_params.generate_per_file = this.editForm_Self.generate_per_file + '';
                    }
                    console.log('temp_params:', temp_params);
                }
                temp_params.strict_mode = this.editForm_Self.strict_mode ? '1' : '0';
                temp_params = JSON.stringify(temp_params);

                adddata.append('params', temp_params);
                this.editForm_Self.file = document.getElementById('filetemp').files[0];
                if (this.editForm_Self.file) {
                    adddata.append('file', this.editForm_Self.file);
                }
                for (var [a, b] of adddata.entries()) {
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
            });
        },
        async getdata(reader, self) {
            return (reader.onload = await function() {
                self.fileContent = this.result;
            });
        },
        // 标记任务异常
        async taskException() {
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
                })
                .catch(_ => {});
        },
        //任务详情对话框
        async MethodDetail(id) {
            // id = data
            console.log('this.methodDetail:', this.methodDetail);
            this.methodDialogSelfVisible = true;
            const { data: data } = await this.$http.get('/task/' + '?task_id=' + id);
            if (data.code !== 20000) {
                return this.$message.error('获取本用户任务详情失败！' + '错误原因：' + data.msg);
            }

            this.methodDetail = data.data;
        },
        methodDialogClose() {
            console.log('this.methodDetail:', this.methodDetail);
            this.methodDetail = [];
        },
        // >>>>>>>>>>图像预览部分>>>>>>>>>>>>>>>

        async point_cloud_preview(task_id) {
            this.full_loading_flag = true;
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // console.log('loading:', loading);
            // console.log('this.$loading.lock:', this.$loading.lock);
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
                    // console.log('generate_files.files:', generate_files.files);
                    for (var i in generate_files.files) {
                        generate_names.push(i);
                    }

                    if (original_is_Zip) {
                        // console.log('orignal_names:', orignal_names);
                        // console.log('generate_names:', generate_names);
                        for (var i in orignal_names) {
                            for (var j in generate_names) {
                                // 原始文件和生成文进行对应
                                // if (generate_names[j].search(orignal_names[i]) != -1) {
                                //     var temp_object = {};
                                //     temp_object['value'] = generate_names[j];
                                //     temp_object['label'] = generate_names[j];
                                //     preview_options[i].children.push(temp_object);
                                // }
                                if (generate_names[j].search(orignal_names[i].split('.')[0]) != -1) {
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
            console.log('preview_options:', preview_options);
            this.loading = false;
        },
        make_format_data(images_name, images, flag) {
            // 灰度图仅支持.jpg或.jpeg形式
            var format_data = null;
            var dot = images_name.lastIndexOf('.');
            var data_type = images_name.substr(dot);
            if (data_type === '.jpg' || data_type === '.jpeg') {
                let me = this;
                // console.log('here');
                if (!flag) {
                    console.log('this.originalpicture:', this.originalpicture);

                    let blob = new Blob([images], { type: 'image/jpeg' });
                    let url = window.URL.createObjectURL(blob);
                    this.originalpicture = url;
                    // console.log('url:', url);
                    // console.log('me.tempurl:', me.tempurl);
                } else {
                    let blob = new Blob([images], { type: 'image/jpeg' });
                    let url = window.URL.createObjectURL(blob);
                    this.generatepicture = url;
                }
            } else {
                this.$message.error('文件格式错误！【灰度图仅支持.jpg或.jpeg形式】');
            }
        },
        get_preview() {},
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
                    // 注意这里可以选择解压文件的格式（string、blob等等）
                    await original_files
                        .file(original_points_name)
                        .async('blob')
                        .then(function(content) {
                            original_pointscloud = content;
                        });
                });
                this.make_format_data(original_points_name, original_pointscloud, 0);
                console.log('original_image:', original_pointscloud);
                var generate_files = new JSZip();
                await generate_files.loadAsync(this.generate_files_zip).then(async function(generate_files_zip) {
                    await generate_files
                        .file(generate_points_name)
                        .async('blob')
                        .then(function(content) {
                            generate_pointscloud = content;
                        });
                });
                this.make_format_data(generate_points_name, generate_pointscloud, 1);
                console.log('generate_image:', generate_pointscloud);
            } else {
                var reader = new FileReader();
                console.log('this.original_blob:', this.original_blob);
                reader.readAsDataURL(this.original_blob);
                let me = this;

                reader.onload = async function() {
                    var original_content = this.result;
                    console.log('original_content:', original_content);
                    me.originalpicture = original_content;
                    // me.make_format_data(me.preview_options[0].value, original_content, 0);

                    if (me.generate_is_Zip) {
                        var generate_files = new JSZip();
                        await generate_files.loadAsync(me.generate_files_zip).then(async function(generate_files_zip) {
                            await generate_files
                                .file(generate_points_name)
                                .async('blob')
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
            // console.log('this.originalPointCloudData:', this.originalPointCloudData);
            // console.log('this.generatePointCloudData:', this.generatePointCloudData);
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
.juzhong {
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
