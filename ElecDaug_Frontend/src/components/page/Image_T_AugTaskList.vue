<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-picture"></i> SAR雷达蜕变 </el-breadcrumb-item>
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
                <el-form-item label="任务名" prop="name">
                    <el-input v-model="editForm_Self.name"></el-input>
                </el-form-item>
                <el-form-item label="紧急等级">
                    <el-slider v-model="editForm_Self.urgency_level" :min="1" :max="5" :step="1" :marks="mark_group.mark1_5"> </el-slider>
                </el-form-item>

                <el-form-item label="变异类型">
                    <el-select v-model="type_value" placeholder="请选择变异类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>

                <el-collapse v-if="type_value == 'first'" v-model="activeName2">
                    <el-collapse-item v-if="type_value == 'first'" title="噪声" name="1">
                        <!-- 高斯噪声  -->
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked0" label="雷达高斯噪声变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked0" label="均值">
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[0].mean"
                                    range
                                    :min="-1.5"
                                    :max="0.5"
                                    :marks="temp_marks"
                                    :step="0.05"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked0">
                                <el-popover placement="right-start" title="均值:" width="200" trigger="hover" content="高斯分布均值">
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked0" label="方差">
                                <!-- <el-input v-model="params_form[0].var"></el-input> -->
                                <el-slider
                                    style="width: 250px"
                                    v-model="params_form[0].var"
                                    range
                                    :min="0"
                                    :max="0.1"
                                    :step="0.001"
                                    :marks="mark_group.mark0_01"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked0">
                                <el-popover
                                    placement="right-start"
                                    title="方差:"
                                    width="200"
                                    trigger="hover"
                                    content="方差，该值越大则噪声越大"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_currency_group.checked0 &&
                                        (params_form[0].mean[0] != params_form[0].mean[1] || params_form[0].var[0] != params_form[0].var[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[0].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                        <!-- 拉普拉斯噪声 -->
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked1" label="雷达拉普拉斯噪声变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked1" label="均值" label-width="55px !important">
                                <!-- <el-input v-model="params_form[1].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[1].mean"
                                    range
                                    :min="-1.5"
                                    :max="0.5"
                                    :marks="temp_marks"
                                    :step="0.05"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked1">
                                <el-popover placement="right-start" title="均值:" width="200" trigger="hover" content="拉普拉斯分布均值">
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked1" label="方差">
                                <!-- <el-input v-model="params_form[1].var"></el-input> -->
                                <el-slider
                                    style="width: 250px"
                                    v-model="params_form[1].var"
                                    range
                                    :min="0"
                                    :max="0.1"
                                    :step="0.001"
                                    :marks="mark_group.mark0_01"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked1">
                                <el-popover
                                    placement="right-start"
                                    title="方差:"
                                    width="200"
                                    trigger="hover"
                                    content="方差，该值越大则噪声越大"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_currency_group.checked1 &&
                                        (params_form[1].mean[0] != params_form[1].mean[1] || params_form[1].var[0] != params_form[1].var[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[1].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked2" label="雷达泊松噪声变异" border></el-checkbox>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked2" label="参数λ" label-width="90px">
                                <!-- <el-input v-model="params_form[2].lam"></el-input> -->

                                <el-slider
                                    v-model="params_form[2].lam"
                                    range
                                    :min="0"
                                    :max="15"
                                    :marks="mark_group.mark0_15"
                                    :step="0.05"
                                    style="width: 500px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked2">
                                <el-popover
                                    placement="right-start"
                                    title="参数λ:"
                                    width="200"
                                    trigger="hover"
                                    content="参数λ是单位时间（或单位面积）内随机事件的平均发生次数"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="checked_currency_group.checked2 && params_form[2].lam[0] != params_form[2].lam[1]"
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[2].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="120px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked3" label="雷达椒盐噪声变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked3" label="噪声像素百分比">
                                <!-- <el-input v-model="params_form[3].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[3].proportion"
                                    range
                                    :min="0"
                                    :max="1"
                                    :marks="mark_group.mark0_1"
                                    :step="0.01"
                                    style="width: 500px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked3">
                                <el-popover
                                    placement="right-start"
                                    title="噪声像素百分比:"
                                    width="200"
                                    trigger="hover"
                                    content="噪声像素百分比为原始像素数量和噪声数量的比值"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="checked_currency_group.checked3 && params_form[3].proportion[0] != params_form[3].proportion[1]"
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[3].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="120px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked4" label="雷达随机噪声变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked4" label="添加噪音数量">
                                <!-- <el-input v-model="params_form[4].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[4].noise_num"
                                    range
                                    :min="0"
                                    :max="16384"
                                    :marks="mark_group.mark0_16384"
                                    :step="1"
                                    style="width: 500px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked4">
                                <el-popover
                                    placement="right-start"
                                    title="添加噪音数量:"
                                    width="200"
                                    trigger="hover"
                                    content="根据噪音数量在图像像素点中随机添加噪音"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked4" label="噪声像素颜色">
                                <!-- <el-input v-model="params_form[4].p2" :inline="true"></el-input> -->

                                <el-radio v-model="params_form[4].noise_random" label="0">指定灰度</el-radio>
                                <el-radio v-model="params_form[4].noise_random" label="1">不指定灰度</el-radio>

                                <el-slider
                                    v-if="params_form[4].noise_random == 0"
                                    v-model="params_form[4].noise_gray_color"
                                    range
                                    :min="0"
                                    :max="255"
                                    :marks="mark_group.mark0_255"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked4">
                                <el-popover
                                    placement="right-start"
                                    title="噪声像素颜色:"
                                    width="200"
                                    trigger="hover"
                                    content="选择噪音颜色范围0~255"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item
                                label-width="120px"
                                v-if="
                                    checked_currency_group.checked4 &&
                                        (this.params_form[4].noise_num[0] != this.params_form[4].noise_num[1] ||
                                            (this.params_form[4].noise_gray_color[0] != this.params_form[4].noise_gray_color[1] &&
                                                this.params_form[4].noise_random[0] == '0'))
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[4].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>

                    <el-collapse-item title="模糊" name="2">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked9" label="雷达双边滤波变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked9" label="模板半径">
                                <el-slider
                                    v-model="params_form[9].radius"
                                    range
                                    :min="0"
                                    :max="500"
                                    :marks="mark_group.mark0_500"
                                    :step="1"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked9">
                                <el-popover
                                    placement="right-start"
                                    title="模板半径:"
                                    width="200"
                                    trigger="hover"
                                    content="模板半径，决定计算时核半径"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked9" label="空间邻近度" label-width="90px">
                                <!-- <el-input v-model="params_form[9].space"></el-input> -->
                                <el-slider
                                    v-model="params_form[9].space"
                                    range
                                    :min="0"
                                    :max="150"
                                    :marks="mark_group.mark0_150"
                                    :step="0.5"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked9">
                                <el-popover
                                    placement="right-start"
                                    title="空间邻近度:"
                                    width="200"
                                    trigger="hover"
                                    content="坐标空间的标注方差，其数值越大，意味着越远的像素会相互影响，从而使更大的区域中足够相似的灰度获得相同值。"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked9" label="灰度相似度" label-width="90px">
                                <!-- <el-input v-model="params_form[9].graysimilarity"></el-input> -->
                                <el-slider
                                    v-model="params_form[9].graysimilarity"
                                    range
                                    :min="0"
                                    :max="10"
                                    :marks="mark_group.mark0_10"
                                    :step="0.1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked9">
                                <el-popover
                                    placement="right-start"
                                    title="灰度相似度:"
                                    width="200"
                                    trigger="hover"
                                    content="该值越大，表明该像素领域内有越宽广的灰度会被混合到一起。"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_currency_group.checked9 &&
                                        (params_form[9].radius[0] != params_form[9].radius[1] ||
                                            params_form[9].space[0] != params_form[9].space[1] ||
                                            params_form[9].graysimilarity[0] != params_form[9].graysimilarity[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[9].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked10" label="雷达均值模糊变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked10" label="模板半径">
                                <!-- <el-input v-model="params_form[10].radius"></el-input> -->
                                <el-slider
                                    v-model="params_form[10].radius"
                                    range
                                    :min="0"
                                    :max="5"
                                    :marks="mark_group.mark0_5"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked10">
                                <el-popover
                                    placement="right-start"
                                    title="模板半径:"
                                    width="200"
                                    trigger="hover"
                                    content="模板半径，决定计算时核半径"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="checked_currency_group.checked10 && params_form[10].radius[0] != params_form[10].radius[1]"
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[10].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <!-- <el-form-item v-if="checked_currency_group.checked10" label="色彩模式">
                                            <el-input v-model="params_form[10].mode"></el-input>
                                        </el-form-item> -->
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked12" label="雷达中值模糊变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked12" label="模板半径">
                                <!-- <el-input v-model="params_form[12].radius"></el-input> -->
                                <el-slider
                                    v-model="params_form[12].radius"
                                    range
                                    :min="0"
                                    :max="5"
                                    :marks="mark_group.mark0_5"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked12">
                                <el-popover
                                    placement="right-start"
                                    title="模板半径:"
                                    width="200"
                                    trigger="hover"
                                    content="模板半径，决定计算时核半径"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="checked_currency_group.checked12 && params_form[12].radius[0] != params_form[12].radius[1]"
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[12].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <!-- <el-form-item v-if="checked_currency_group.checked12" label="色彩模式">
                                            <el-input v-model="params_form[12].mode"></el-input> -->
                            <!-- </el-form-item> -->
                        </el-form>
                    </el-collapse-item>

                    <el-collapse-item title="形状变换" name="3">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked27" label="雷达图像裁剪变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked27" label="左上角x1">
                                <!-- <el-input v-model="params_form[27].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[27].x1"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.1"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked27">
                                <el-popover
                                    placement="right-start"
                                    title="横坐标x1:"
                                    width="200"
                                    trigger="hover"
                                    content="裁剪的左上角横坐标x1"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked27" label="右下角x2">
                                <!-- <el-input v-model="params_form[27].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[27].x2"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.1"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked27">
                                <el-popover
                                    placement="right-start"
                                    title="横坐标x2:"
                                    width="200"
                                    trigger="hover"
                                    content="裁剪的右下角横坐标x2"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked27" label="左上角y1">
                                <!-- <el-input v-model="params_form[27].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[27].y1"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.1"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked27">
                                <el-popover
                                    placement="right-start"
                                    title="纵坐标y1:"
                                    width="200"
                                    trigger="hover"
                                    content="裁剪的左上角纵坐标y1"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked27" label="右下角y2">
                                <!-- <el-input v-model="params_form[27].p1"></el-input> -->
                                <el-slider
                                    v-model="params_form[27].y2"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.1"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked27">
                                <el-popover
                                    placement="right-start"
                                    title="纵坐标y2:"
                                    width="200"
                                    trigger="hover"
                                    content="裁剪的右下角纵坐标y2"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_currency_group.checked27 &&
                                        (params_form[27].x1[0] != params_form[27].x1[1] ||
                                            params_form[27].y1[0] != params_form[27].y1[1] ||
                                            params_form[27].x2[0] != params_form[27].x2[1] ||
                                            params_form[27].y2[0] != params_form[27].y2[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[27].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="100px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked28" label="雷达形状变换变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked28" label="水平缩放因子">
                                <!-- <el-input v-model="params_form[28].wx"></el-input> -->
                                <el-slider
                                    v-model="params_form[28].w"
                                    range
                                    :min="0"
                                    :max="5"
                                    :marks="mark_group.mark0_5"
                                    :step="0.05"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked28">
                                <el-popover
                                    placement="right-start"
                                    title="水平缩放因子:"
                                    width="200"
                                    trigger="hover"
                                    content="水平缩放大小"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_currency_group.checked28" label="垂直缩放因子">
                                <!-- <el-input v-model="params_form[28].hx"></el-input> -->
                                <el-slider
                                    v-model="params_form[28].h"
                                    range
                                    :min="0"
                                    :max="5"
                                    :marks="mark_group.mark0_5"
                                    :step="0.05"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked28">
                                <el-popover
                                    placement="right-start"
                                    title="垂直缩放因子:"
                                    width="200"
                                    trigger="hover"
                                    content="垂直缩放大小"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_currency_group.checked28 &&
                                        (params_form[28].w[0] != params_form[28].w[1] || params_form[28].h[0] != params_form[28].h[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[28].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>

                    <el-collapse-item title="裁剪与填充" name="4">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="100px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_currency_group.checked50" label="雷达裁剪填充变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked50" label="裁剪填充比例">
                                <!-- <el-input v-model="params_form[50].percent"></el-input> -->
                                <el-slider
                                    v-model="params_form[50].percent"
                                    range
                                    :min="-1"
                                    :max="50"
                                    :marks="mark_group.mark0"
                                    :step="0.25"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_currency_group.checked50">
                                <el-popover
                                    placement="right-start"
                                    title="裁剪填充比例:"
                                    width="200"
                                    trigger="hover"
                                    content="按比例裁剪或者填充"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="checked_currency_group.checked50 && params_form[50].percent[0] != params_form[50].percent[1]"
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[50].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-if="type_value == 'second'" v-model="activeName2">
                    <el-collapse-item title="丢包与遮罩" name="5">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked36" label="目标场景丢包变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-radio v-if="checked_field_group.checked36" v-model="radio36" label="1">整图</el-radio>
                                <el-radio v-if="checked_field_group.checked36" v-model="radio36" label="2">区域</el-radio>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked36" label="黑色像素百分比">
                                <!-- <el-input v-model="params_form[36].p"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].p"
                                    range
                                    :min="0"
                                    :max="100"
                                    :marks="mark_group.mark0_100"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked36">
                                <el-popover
                                    placement="right-start"
                                    title="黑色像素百分比:"
                                    width="200"
                                    trigger="hover"
                                    content="转换为黑色像素的图像百分比"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked36 && radio36 == '2'" label="左上角x1">
                                <!-- <el-input v-model="params_form[36].left_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].left_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked36 && radio36 == '2'" label="左上角y1">
                                <!-- <el-input v-model="params_form[36].left_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].left_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked36 && radio36 == '2'" label="右下角x2" label-width="80px">
                                <!-- <el-input v-model="params_form[36].right_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].right_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked36 && radio36 == '2'" label="右下角y2">
                                <!-- <el-input v-model="params_form[36].right_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].right_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked36 &&
                                        (params_form[36].p[0] != params_form[36].p[1] ||
                                            (radio36 == '2' &&
                                                (params_form[36].left_hor[0] != params_form[36].left_hor[1] ||
                                                    params_form[36].left_ver[0] != params_form[36].left_ver[1] ||
                                                    params_form[36].right_hor[0] != params_form[36].right_hor[1] ||
                                                    params_form[36].right_ver[0] != params_form[36].right_ver[1])))
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[36].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked38" label="目标遮罩块丢包变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-radio v-if="checked_field_group.checked38" v-model="radio38" label="1">整图</el-radio>
                                <el-radio v-if="checked_field_group.checked38" v-model="radio38" label="2">区域</el-radio>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38" label="黑色像素百分比">
                                <!-- <el-input v-model="params_form[36].p"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].p"
                                    range
                                    :min="0"
                                    :max="100"
                                    :marks="mark_group.mark0_100"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38">
                                <el-popover
                                    placement="right-start"
                                    title="黑色像素百分比:"
                                    width="200"
                                    trigger="hover"
                                    content="转换为黑色像素的图像百分比"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked38" label="黑色矩形块大小">
                                <!-- <el-input v-model="params_form[36].size"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].size"
                                    range
                                    :min="2"
                                    :max="5"
                                    :marks="mark_group.mark2_5"
                                    :step="1"
                                    style="width: 100px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38">
                                <el-popover
                                    placement="right-start"
                                    title="黑色矩形块大小:"
                                    width="200"
                                    trigger="hover"
                                    content="黑色矩形块的大小（若该参数为一单值，则黑色块为正方形，若该参数为一范围,则黑色块为[范围上界*范围下界]的矩形）"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked38 && radio38 == '2'" label="左上角x1">
                                <!-- <el-input v-model="params_form[36].left_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].left_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38 && radio38 == '2'" label="左上角y1">
                                <!-- <el-input v-model="params_form[36].left_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].left_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38 && radio38 == '2'" label="右下角x2">
                                <!-- <el-input v-model="params_form[36].right_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].right_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked38 && radio38 == '2'" label="右下角y2">
                                <!-- <el-input v-model="params_form[36].right_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].right_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>

                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked38 &&
                                        (params_form[38].p[0] != params_form[38].p[1] ||
                                            params_form[38].size[0] != params_form[38].size[1] ||
                                            (radio38 == '2' &&
                                                (params_form[38].left_hor[0] != params_form[38].left_hor[1] ||
                                                    params_form[38].left_ver[0] != params_form[38].left_ver[1] ||
                                                    params_form[38].right_hor[0] != params_form[38].right_hor[1] ||
                                                    params_form[38].right_ver[0] != params_form[38].right_ver[1])))
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[38].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked43" label="目标场景盐点变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-radio v-if="checked_field_group.checked43" v-model="radio43" label="1">整图</el-radio>
                                <el-radio v-if="checked_field_group.checked43" v-model="radio43" label="2">区域</el-radio>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked43" label="白色像素百分比">
                                <!-- <el-input v-model="params_form[36].p"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].p"
                                    range
                                    :min="0"
                                    :max="100"
                                    :marks="mark_group.mark0_100"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked43">
                                <el-popover
                                    placement="right-start"
                                    title="白色像素百分比:"
                                    width="200"
                                    trigger="hover"
                                    content="转换为白色像素的图像百分比"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked43 && radio43 == '2'" label="左上角x1">
                                <!-- <el-input v-model="params_form[36].left_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].left_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked43 && radio43 == '2'" label="左上角y1">
                                <!-- <el-input v-model="params_form[36].left_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].left_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked43 && radio43 == '2'" label="右下角x2" label-width="90px">
                                <!-- <el-input v-model="params_form[36].right_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].right_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked43 && radio43 == '2'" label="右下角y2">
                                <!-- <el-input v-model="params_form[36].right_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].right_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked43 &&
                                        (params_form[43].p[0] != params_form[43].p[1] ||
                                            (radio43 == '2' &&
                                                (params_form[43].left_hor[0] != params_form[43].left_hor[1] ||
                                                    params_form[43].left_ver[0] != params_form[43].left_ver[1] ||
                                                    params_form[43].right_hor[0] != params_form[43].right_hor[1] ||
                                                    params_form[43].right_ver[0] != params_form[43].right_ver[1])))
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[43].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked44" label="目标场景盐点块变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item>
                                <el-radio v-if="checked_field_group.checked44" v-model="radio44" label="1">整图</el-radio>
                                <el-radio v-if="checked_field_group.checked44" v-model="radio44" label="2">区域</el-radio>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44" label="白色像素百分比">
                                <!-- <el-input v-model="params_form[36].p"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].p"
                                    range
                                    :min="0"
                                    :max="1"
                                    :marks="mark_group.mark0_1"
                                    :step="0.01"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44">
                                <el-popover
                                    placement="right-start"
                                    title="白色像素百分比:"
                                    width="200"
                                    trigger="hover"
                                    content="转换为白色像素的图像百分比"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked44" label="白色矩形块大小">
                                <!-- <el-input v-model="params_form[36].size"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].size"
                                    range
                                    :min="2"
                                    :max="5"
                                    :marks="mark_group.mark2_5"
                                    :step="1"
                                    style="width: 100px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44">
                                <el-popover
                                    placement="right-start"
                                    title="白色矩形块大小:"
                                    width="200"
                                    trigger="hover"
                                    content="白色矩形块的大小（若该参数为一单值，则白色块为正方形，若该参数为一范围,则白色块为[范围上界*范围下界]的矩形）"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked44 && radio44 == '2'" label="左上角x1">
                                <!-- <el-input v-model="params_form[36].left_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].left_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44 && radio44 == '2'" label="左上角y1">
                                <!-- <el-input v-model="params_form[36].left_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].left_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44 && radio44 == '2'" label="右下角x2">
                                <!-- <el-input v-model="params_form[36].right_hor"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].right_hor"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked44 && radio44 == '2'" label="右下角y2">
                                <!-- <el-input v-model="params_form[36].right_ver"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].right_ver"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>

                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked44 &&
                                        (params_form[44].p[0] != params_form[44].p[1] ||
                                            params_form[44].size[0] != params_form[44].size[1] ||
                                            (radio44 == '2' &&
                                                (params_form[44].left_hor[0] != params_form[44].left_hor[1] ||
                                                    params_form[44].left_ver[0] != params_form[44].left_ver[1] ||
                                                    params_form[44].right_hor[0] != params_form[44].right_hor[1] ||
                                                    params_form[44].right_ver[0] != params_form[44].right_ver[1])))
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[44].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>

                    <el-collapse-item title="场景变换" name="6">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked48" label="目标雾化场景变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked48" label="亮度" label-width="40px">
                                <!-- <el-input v-model="params_form[48].A"></el-input> -->
                                <el-slider
                                    v-model="params_form[48].A"
                                    range
                                    :min="0"
                                    :max="255"
                                    :marks="mark_group.mark0_255"
                                    :step="0.5"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked48" label="雾的浓度" label-width="80px">
                                <!-- <el-input v-model="params_form[48].beta"></el-input> -->
                                <el-slider
                                    v-model="params_form[48].beta"
                                    range
                                    :min="0"
                                    :max="0.15"
                                    :marks="mark_group.mark0"
                                    :step="0.001"
                                    style="width: 150px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked48 &&
                                        (params_form[48].A[0] != params_form[48].A[1] || params_form[48].beta[0] != params_form[48].beta[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[48].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="100px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked49" label="目标雪地场景变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked49" label="亮度上限值">
                                <!-- <el-input v-model="params_form[49].lightness"></el-input> -->
                                <el-slider
                                    v-model="params_form[49].lightness"
                                    range
                                    :min="0"
                                    :max="255"
                                    :marks="mark_group.mark0_255"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked49" label="亮度提⾼倍数">
                                <!-- <el-input v-model="params_form[49].inc"></el-input> -->
                                <el-slider
                                    v-model="params_form[49].inc"
                                    range
                                    :min="0"
                                    :max="255"
                                    :marks="mark_group.mark0_255"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked49 &&
                                        (params_form[49].lightness[0] != params_form[49].lightness[1] ||
                                            params_form[49].inc[0] != params_form[49].inc[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[49].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>

                    <el-collapse-item title="传输异常" name="7">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked52" label="目标传输异常变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked52" label="保留位数">
                                <!-- <el-input v-model="params_form[52].n"></el-input> -->
                                <el-slider
                                    v-model="params_form[52].n"
                                    range
                                    :min="1"
                                    :max="7"
                                    :marks="mark_group.mark1_7"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked52">
                                <el-popover
                                    placement="right-start"
                                    title="保留位数:"
                                    width="200"
                                    trigger="hover"
                                    content="需要保留的位数，像素点数值的⾼n位被保留"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="模糊" name="8">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="80px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked11" label="目标运动模糊变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked11" label="模板半径">
                                <!-- <el-input v-model="params_form[11].radius"></el-input> -->
                                <el-slider
                                    v-model="params_form[11].radius"
                                    range
                                    :min="0"
                                    :max="5"
                                    :marks="mark_group.mark0_5"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked11">
                                <el-popover
                                    placement="right-start"
                                    title="模板半径:"
                                    width="200"
                                    trigger="hover"
                                    content="模板半径，决定计算时核半径"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked11" label="运动方向">
                                <!-- <el-input v-model="params_form[11].radius"></el-input> -->
                                <el-slider
                                    v-model="params_form[11].direction"
                                    range
                                    :min="0"
                                    :max="1"
                                    :marks="mark_group.mark0_1"
                                    :step="1"
                                    style="width: 100px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked11 &&
                                        (params_form[11].radius[0] != params_form[11].radius[1] ||
                                            params_form[11].direction[0] != params_form[11].direction[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[11].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>

                            <!-- <el-form-item v-if="checked_currency_group.checked11" label="色彩模式">
                                            <el-input v-model="params_form[11].mode"></el-input>
                                        </el-form-item>
                                        <el-form-item v-if="checked_currency_group.checked11" label="数据类型">
                                            <el-input v-model="params_form[11].dtype"></el-input>
                                        </el-form-item> -->
                        </el-form>
                    </el-collapse-item>
                    <el-collapse-item title="形状变换" name="9">
                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked24" label="目标检测角度变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked24" label="旋转角度">
                                <!-- <el-input v-model="params_form[24].angle"></el-input> -->
                                <el-slider
                                    v-model="params_form[24].angle"
                                    range
                                    :min="0"
                                    :max="360"
                                    :marks="mark_group.mark0_360"
                                    :step="0.5"
                                    style="width: 250px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked24">
                                <el-popover
                                    placement="right-start"
                                    title="旋转角度:"
                                    width="200"
                                    trigger="hover"
                                    content="以图片中心为轴的旋转角度"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked24" label="x">
                                <!-- <el-input v-model="params_form[24].angle"></el-input> -->
                                <el-slider
                                    v-model="params_form[24].x"
                                    range
                                    :min="0"
                                    :max="64"
                                    :marks="mark_group.mark0_64"
                                    :step="0.1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked24" label="y">
                                <!-- <el-input v-model="params_form[24].angle"></el-input> -->
                                <el-slider
                                    v-model="params_form[24].y"
                                    range
                                    :min="0"
                                    :max="64"
                                    :marks="mark_group.mark0_64"
                                    :step="0.1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked24 &&
                                        (params_form[24].angle[0] != params_form[24].angle[1] ||
                                            params_form[24].x[0] != params_form[24].x[1] ||
                                            params_form[24].y[0] != params_form[24].y[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[24].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 300px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>

                        <el-form ref="formRef" :model="editForm_Self" :rules="FormRules" label-width="90px" :inline="true">
                            <el-form-item>
                                <el-checkbox v-model="checked_field_group.checked25" label="目标检测距离变异" border></el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked25" label="X方向位移">
                                <!-- <el-input v-model="params_form[25].x"></el-input> -->
                                <el-slider
                                    v-model="params_form[25].x"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked25">
                                <el-popover
                                    placement="right-start"
                                    title="X方向位移:"
                                    width="200"
                                    trigger="hover"
                                    content="图片向X方向位移距离"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>

                            <el-form-item v-if="checked_field_group.checked25" label="Y方向位移">
                                <!-- <el-input v-model="params_form[25].y"></el-input> -->
                                <el-slider
                                    v-model="params_form[25].y"
                                    range
                                    :min="0"
                                    :max="128"
                                    :marks="mark_group.mark0_128"
                                    :step="0.5"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item v-if="checked_field_group.checked25">
                                <el-popover
                                    placement="right-start"
                                    title="Y方向位移:"
                                    width="200"
                                    trigger="hover"
                                    content="图片向Y方向位移距离"
                                >
                                    <i class="el-icon-info" slot="reference"></i>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                label-width="90px"
                                v-if="
                                    checked_field_group.checked25 &&
                                        (params_form[25].x[0] != params_form[25].x[1] || params_form[25].y[0] != params_form[25].y[1])
                                "
                                label="生成数据量"
                            >
                                <!-- <el-input v-model="params_form[0].mean"></el-input> -->
                                <el-slider
                                    v-model="params_form[25].count"
                                    :min="1"
                                    :max="100"
                                    :marks="mark_group.mark1_100"
                                    :step="1"
                                    style="width: 200px"
                                >
                                </el-slider>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>

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
            @change="previewClose"
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
            radio36: '1',
            radio38: '1',
            radio43: '1',
            radio44: '1',
            FormRules: {
                // // 验证用户名是否合法
                // name: [{ required: true, message: '任务名不可为空', trigger: 'blur' }],
                // // 验证密码是否合法
                // augmentation_method: [{ required: true, message: '生成方法不可为空', trigger: 'blur' }]
            },
            options: [
                {
                    value: 'first',
                    label: '通用变异算子'
                },
                {
                    value: 'second',
                    label: '领域变异算子'
                }
            ],
            type_value: '',
            params_form: [
                // 0
                {
                    mean: [0, 0],
                    var: [0, 0],
                    count: 1
                },
                // 1
                {
                    mean: [0, 0],
                    var: [0, 0],
                    count: 1
                },
                // 2
                {
                    lam: [0, 0],
                    count: 1
                },
                // 3
                {
                    proportion: [0, 0],
                    count: 1
                },
                // 4
                {
                    noise_num: [0, 0],
                    noise_gray_color: [0, 0],
                    noise_random: '0',
                    count: 1
                },
                // 5
                {
                    size: '(4,4)'
                },
                // 6
                {
                    size: '(4,4)'
                },
                // 7
                {
                    size: '(4,4)'
                },
                // 8
                {
                    size: '(4,4)'
                },
                // 9
                {
                    radius: [0, 0],
                    space: [0, 0],
                    graysimilarity: [0, 0],
                    count: 1
                },

                //10
                {
                    radius: [0, 0],
                    count: 1
                },
                // 11
                {
                    radius: [0, 0],
                    direction: [0, 0],
                    count: 1
                },
                // 12
                {
                    radius: [0, 0],
                    count: 1
                },

                {},
                {},
                {},
                {
                    gamma: 0.3
                },
                {},

                {},
                {},
                // 20
                {},
                // 21
                {
                    value: 1
                },
                // 22
                {
                    value: '(1, 1.6)',
                    left_hor: 270,
                    left_ver: 260,
                    right_hor: 1900,
                    right_ver: 1100,
                    count: 1
                },
                {},
                // 24
                {
                    angle: [0, 0],
                    count: 1,
                    x: [0, 0],
                    y: [0, 0]
                },
                // 25
                {
                    x: [0, 0],
                    y: [0, 0],
                    count: 1
                },
                // 26
                {
                    hx: 2,
                    wx: 2
                },
                //27
                {
                    x1: [0, 0],
                    y1: [0, 0],
                    x2: [128, 128],
                    y2: [128, 128],
                    count: 1
                },
                // 28
                {
                    h: [1, 1],
                    w: [1, 1],
                    count: 1
                },

                {},
                // 30
                {},
                {},

                {},
                {},
                {},
                //35
                {
                    p: 5
                },
                // 36
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    count: 1
                },
                // 37
                {
                    p: 0.05,
                    size: 15
                },
                // 38
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    size: [0, 0],
                    count: 1
                },
                // 39
                {
                    p: 3
                },
                // 40
                {
                    p: 0.05,
                    size: '(8,7)'
                },
                // 41
                {
                    p: '(4,9)'
                },
                // 42
                {
                    p: 2,
                    size: 5
                },
                // 43
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    count: 1
                },
                // 44
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    size: [0, 0],
                    count: 1
                },

                {},
                // 46
                {
                    m: 0
                },
                // 47
                {
                    m: 0,
                    left_hor: 'None',
                    left_ver: 'None',
                    right_hor: 0.8,
                    right_ver: 'None'
                },
                // 48
                {
                    A: [0, 0],
                    beta: [0, 0],
                    count: 1
                },
                {
                    lightness: [0, 0],
                    inc: [0, 0],
                    count: 1
                },
                //50
                {
                    percent: [0, 0],
                    count: 1
                },
                // 51
                {
                    p: 1
                },
                // 52
                {
                    n: [0, 0],
                    count: 1
                }
            ],
            checked_currency_group: {
                checked0: false,
                checked1: false,
                checked2: false,
                checked3: false,
                checked4: false,

                checked9: false,
                checked10: false,

                checked12: false,

                checked27: false,
                checked28: false,

                checked50: false
            },
            checked_field_group: {
                checked11: false,
                checked24: false,
                checked25: false,
                checked35: false,
                checked36: false,
                checked37: false,
                checked38: false,
                checked41: false,
                checked42: false,
                checked43: false,
                checked44: false,

                checked48: false,
                checked49: false,

                checked52: false
            },
            temp_marks: {
                0: '0',
                100: {
                    style: {
                        width: '30px'
                    },
                    label: '100'
                }
            },
            mark_group: {
                mark0_64: {
                    0: '0',
                    64: {
                        style: {
                            width: '20px'
                        },
                        label: '64'
                    }
                },
                mark0: {
                    0: '0'
                },
                mark0_5: {
                    0: '0',
                    5: '5'
                },
                mark0_01: {
                    0: '0',
                    0.1: {
                        style: {
                            width: '20px'
                        },
                        label: '0.1'
                    }
                },
                mark0_1: {
                    0: '0',
                    1: '1'
                },
                mark0_16384: {
                    0: '0',
                    16384: {
                        style: {
                            width: '50px'
                        },
                        label: '16384'
                    }
                },
                mark05_1: {
                    0.5: '0.5',
                    1: '1'
                },
                mark1_7: {
                    1: '1',
                    7: '7'
                },
                mark2_5: {
                    2: '2',
                    5: '5'
                },
                mark0_15: {
                    0: '0',
                    15: {
                        style: {
                            width: '20px'
                        },
                        label: '15'
                    }
                },
                mark05_1000: {
                    0.5: '0.5',
                    1000: {
                        style: {
                            width: '40px'
                        },
                        label: '1000'
                    }
                },
                mark0_100: {
                    0: '0',
                    100: {
                        style: {
                            width: '30px'
                        },
                        label: '100'
                    }
                },
                mark0_255: {
                    0: '0',
                    255: {
                        style: {
                            width: '30px'
                        },
                        label: '255'
                    }
                },
                mark0_1000: {
                    0: '0',
                    1000: {
                        style: {
                            width: '40px'
                        },
                        label: '1000'
                    }
                },
                mark0_1000: {
                    0: '0',
                    1000: {
                        style: {
                            width: '40px'
                        },
                        label: '1000'
                    }
                },
                mark0_10: {
                    0: '0',
                    10: {
                        style: {
                            width: '20px'
                        },
                        label: '10'
                    }
                },
                mark0_150: {
                    0: '0',
                    150: {
                        style: {
                            width: '30px'
                        },
                        label: '150'
                    }
                },
                mark0_500: {
                    0: '0',
                    500: {
                        style: {
                            width: '30px'
                        },
                        label: '500'
                    }
                },
                mark0_63: {
                    0: '0',
                    63: {
                        style: {
                            width: '20px'
                        },
                        label: '63'
                    }
                },
                mark0_313: {
                    0: '0',
                    313: {
                        style: {
                            width: '30px'
                        },
                        label: '313'
                    }
                },
                mark0_360: {
                    0: '0',
                    360: {
                        style: {
                            width: '30px'
                        },
                        label: '360'
                    }
                },
                mark1_209: {
                    1: '1',
                    209: {
                        style: {
                            width: '30px'
                        },
                        label: '209'
                    }
                },
                mark0_128: {
                    0: '0',
                    128: {
                        style: {
                            width: '30px'
                        },
                        label: '128'
                    }
                },
                mark1_100: {
                    1: '1',
                    100: {
                        style: {
                            width: '30px'
                        },
                        label: '100'
                    }
                },
                mark1_5: {
                    1: '1',
                    5: '5'
                },
                mark01_255: {
                    0.1: '0.1',
                    255: {
                        style: {
                            width: '30px'
                        },
                        label: '255'
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
            activeName2: 'first',
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
        let data = await this.$http.get('/augmentation_method/?augmentation_type=4');
        // ?id=1
        console.log('data:', data);
        this.generate_func_list = data.data.data;
        // console.log('this.generate_func_list:', this.generate_func_list);
    },
    methods: {
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
                '/task/augmentation_type/search/?augmentation_type=4&page=' + this.queryInfo_Self.page
            );

            if (data.code !== 20000) {
                if (data.code === 40400) {
                    console.log('data:', data);
                    this.taskList_Self = [];
                    this.totalPageNum = 0;
                    this.total_Self = 0;
                    return this.$message.error('本用户未添加任务！');
                }

                return this.$message.error('获取本用户任务列表失败！' + '错误原因：' + data.msg);
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
                        '/task/name/search/?augmentation_type=4&task_name=' +
                        this.formInline_Self.searchTaskInfo +
                        '&search_type=' +
                        this.FuzzySearch +
                        '&page=' +
                        this.queryInfo_Self.page;
                } else {
                    search_params =
                        '/task/id/search/?augmentation_type=4&task_id=' +
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
                    '/task/augmentation_type/admin/search/?augmentation_type=4&page=' + this.queryInfo_All.page
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
                        '?augmentation_type=4&page=' +
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
                        '?augmentation_type=4&page=' +
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
                        '?augmentation_type=4&page=' +
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
                // console.log('WDNMD');
                console.log('username:', this.formInline_All.searchTaskInfo);
                const { data: data } = await this.$http.get(
                    '/task/master/admin/search/' +
                        '?augmentation_type=4&page=' +
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
            // console.log('original_image_data:', data);
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
            // return new Promise((resolve, reject) => {
            //     const fileReader = new FileReader();
            //     fileReader.onload = e => {
            //         resolve(e.target.result);
            //     };
            //     // readAsDataURL
            //     console.log('blob:', typeof blob);
            //     fileReader.readAsDataURL(blob);

            //     fileReader.onerror = () => {
            //         reject(new Error('blobToBase64 error'));
            //     };
            // });
            const fileReader = new FileReader();
            fileReader.onload = e => {
                resolve(e.target.result);
            };
            // readAsDataURL
            console.log('blob:', typeof blob);
            fileReader.readAsDataURL(blob);
            console.log('fileReader:', fileReader);
            fileReader.onerror = () => {
                reject(new Error('blobToBase64 error'));
            };
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

            this.editForm_Self.whether_to_rotate = this.editForm_Self.whether_to_rotate === '1' ? true : false;
            this.editForm_Self.strict_mode = this.editForm_Self.strict_mode === '1' ? true : false;

            console.log('this.editForm_Self:', this.editForm_Self);

            // 噪音
            if (this.editForm_Self.gaussian_noise) {
                // 0高斯噪声
                this.checked_currency_group.checked0 = true;
                this.params_form[0].mean = this.editForm_Self.gaussian_noise.mean
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[0].mean[0] = parseFloat(this.params_form[0].mean[0]);
                this.params_form[0].mean[1] = parseFloat(this.params_form[0].mean[1]);

                this.params_form[0].var = this.editForm_Self.gaussian_noise.var
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[0].var[0] = parseFloat(this.params_form[0].var[0]);
                this.params_form[0].var[1] = parseFloat(this.params_form[0].var[1]);
                this.params_form[0].count = this.editForm_Self.gaussian_noise.count ? parseInt(this.editForm_Self.gaussian_noise.count) : 1;
                console.log('this.params_form[0]:', this.params_form[0]);
            }
            if (this.editForm_Self.laplace_noise) {
                // 1拉普拉斯噪声
                this.checked_currency_group.checked1 = true;
                this.params_form[1].mean = this.editForm_Self.laplace_noise.mean
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[1].mean[0] = parseFloat(this.params_form[1].mean[0]);
                this.params_form[1].mean[1] = parseFloat(this.params_form[1].mean[1]);
                this.params_form[1].var = this.editForm_Self.laplace_noise.var
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[1].var[0] = parseFloat(this.params_form[1].var[0]);
                this.params_form[1].var[1] = parseFloat(this.params_form[1].var[1]);
                this.params_form[1].count = this.editForm_Self.laplace_noise.count ? parseInt(this.editForm_Self.laplace_noise.count) : 1;
                console.log('this.params_form[1]:', this.params_form[1]);
            }
            if (this.editForm_Self.possion_noise) {
                // 2泊松噪声
                this.checked_currency_group.checked2 = true;
                this.params_form[2].lam = this.editForm_Self.possion_noise.lam
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[2].lam[0] = parseFloat(this.params_form[2].lam[0]);
                this.params_form[2].lam[1] = parseFloat(this.params_form[2].lam[1]);

                this.params_form[2].count = this.editForm_Self.possion_noise.count ? parseInt(this.editForm_Self.possion_noise.count) : 1;
                console.log('this.params_form[2]:', this.params_form[2]);
            }
            if (this.editForm_Self.pepper_noise) {
                // 3椒盐噪声
                this.checked_currency_group.checked3 = true;
                this.params_form[3].proportion = this.editForm_Self.pepper_noise.proportion
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[3].proportion[0] = parseFloat(this.params_form[3].proportion[0]);
                this.params_form[3].proportion[1] = parseFloat(this.params_form[3].proportion[1]);

                this.params_form[3].count = this.editForm_Self.pepper_noise.count ? parseInt(this.editForm_Self.pepper_noise.count) : 1;
                console.log('this.params_form[3]:', this.params_form[3]);
            }
            if (this.editForm_Self.random_noise) {
                // 4随机噪声
                this.checked_currency_group.checked4 = true;
                this.params_form[4].noise_num = this.editForm_Self.random_noise.noise_num
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[4].noise_num[0] = parseFloat(this.params_form[4].noise_num[0]);
                this.params_form[4].noise_num[1] = parseFloat(this.params_form[4].noise_num[1]);

                if (this.editForm_Self.random_noise.noise_random) {
                    this.params_form[4].noise_random = '1';
                } else {
                    this.params_form[4].noise_random = '0';
                    this.params_form[4].noise_gray_color = this.editForm_Self.random_noise.noise_gray_color
                        .replace('[', '')
                        .replace(']', '')
                        .split(',');
                    this.params_form[4].noise_gray_color[0] = parseFloat(this.params_form[4].noise_gray_color[0]);
                    this.params_form[4].noise_gray_color[1] = parseFloat(this.params_form[4].noise_gray_color[1]);
                }

                this.params_form[4].count = this.editForm_Self.random_noise.count ? parseInt(this.editForm_Self.random_noise.count) : 1;
                console.log('this.params_form[4]:', this.params_form[4]);
            }

            // 模糊
            if (this.editForm_Self.bilateral_blur) {
                // 9
                this.checked_currency_group.checked9 = true;

                this.params_form[9].radius = this.editForm_Self.bilateral_blur.radius
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[9].radius[0] = parseFloat(this.params_form[9].radius[0]);
                this.params_form[9].radius[1] = parseFloat(this.params_form[9].radius[1]);

                this.params_form[9].space = this.editForm_Self.bilateral_blur.space
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[9].space[0] = parseFloat(this.params_form[9].space[0]);
                this.params_form[9].space[1] = parseFloat(this.params_form[9].space[1]);

                this.params_form[9].graysimilarity = this.editForm_Self.bilateral_blur.graysimilarity
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[9].graysimilarity[0] = parseFloat(this.params_form[9].graysimilarity[0]);
                this.params_form[9].graysimilarity[1] = parseFloat(this.params_form[9].graysimilarity[1]);

                this.params_form[9].count = this.editForm_Self.bilateral_blur.count ? parseInt(this.editForm_Self.bilateral_blur.count) : 1;
                console.log('this.params_form[9]:', this.params_form[9]);
            }
            if (this.editForm_Self.average_blur) {
                // 10
                this.checked_currency_group.checked10 = true;

                this.params_form[10].radius = this.editForm_Self.average_blur.radius
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[10].radius[0] = parseFloat(this.params_form[10].radius[0]);
                this.params_form[10].radius[1] = parseFloat(this.params_form[10].radius[1]);

                this.params_form[10].count = this.editForm_Self.average_blur.count ? parseInt(this.editForm_Self.average_blur.count) : 1;
                console.log('this.params_form[10]:', this.params_form[10]);
            }
            if (this.editForm_Self.median_blur) {
                // 12
                this.checked_currency_group.checked12 = true;

                this.params_form[12].radius = this.editForm_Self.median_blur.radius
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[12].radius[0] = parseFloat(this.params_form[12].radius[0]);
                this.params_form[12].radius[1] = parseFloat(this.params_form[12].radius[1]);

                this.params_form[12].count = this.editForm_Self.median_blur.count ? parseInt(this.editForm_Self.median_blur.count) : 1;
                console.log('this.params_form[12]:', this.params_form[12]);
            }

            // 形状变换
            if (this.editForm_Self.crop) {
                // 27
                this.checked_currency_group.checked27 = true;

                this.params_form[27].x1 = this.editForm_Self.crop.x1
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[27].x1[0] = parseFloat(this.params_form[27].x1[0]);
                this.params_form[27].x1[1] = parseFloat(this.params_form[27].x1[1]);

                this.params_form[27].y1 = this.editForm_Self.crop.y1
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[27].y1[0] = parseFloat(this.params_form[27].y1[0]);
                this.params_form[27].y1[1] = parseFloat(this.params_form[27].y1[1]);

                this.params_form[27].x2 = this.editForm_Self.crop.x2
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[27].x2[0] = parseFloat(this.params_form[27].x2[0]);
                this.params_form[27].x2[1] = parseFloat(this.params_form[27].x2[1]);

                this.params_form[27].y2 = this.editForm_Self.crop.y2
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[27].y2[0] = parseFloat(this.params_form[27].y2[0]);
                this.params_form[27].y2[1] = parseFloat(this.params_form[27].y2[1]);

                this.params_form[27].count = this.editForm_Self.crop.count ? parseInt(this.editForm_Self.crop.count) : 1;
                console.log('this.params_form[27]:', this.params_form[27]);
            }
            if (this.editForm_Self.resize) {
                // 28
                this.checked_currency_group.checked28 = true;

                this.params_form[28].w = this.editForm_Self.resize.w
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[28].w[0] = parseFloat(this.params_form[28].w[0]);
                this.params_form[28].w[1] = parseFloat(this.params_form[28].w[1]);

                this.params_form[28].h = this.editForm_Self.resize.h
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[28].h[0] = parseFloat(this.params_form[28].h[0]);
                this.params_form[28].h[1] = parseFloat(this.params_form[28].h[1]);

                this.params_form[28].count = this.editForm_Self.resize.count ? parseInt(this.editForm_Self.resize.count) : 1;
                console.log('this.params_form[28]:', this.params_form[28]);
            }

            // 裁剪与填充
            if (this.editForm_Self.crop_and_pad) {
                // 50
                this.checked_currency_group.checked50 = true;

                this.params_form[50].percent[0] = this.editForm_Self.crop_and_pad.percent_a;
                this.params_form[50].percent[1] = this.editForm_Self.crop_and_pad.percent_b;
                this.params_form[50].percent[0] = parseFloat(this.params_form[50].percent[0]);
                this.params_form[50].percent[1] = parseFloat(this.params_form[50].percent[1]);

                this.params_form[50].count = this.editForm_Self.crop_and_pad.count ? parseInt(this.editForm_Self.crop_and_pad.count) : 1;
                console.log('this.params_form[50]:', this.params_form[50]);
            }

            // 丢包与遮罩
            // dropout
            if (this.editForm_Self.dropout) {
                // 36
                this.checked_field_group.checked36 = true;

                this.params_form[36].p = this.editForm_Self.dropout.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].p[0] = parseFloat(this.params_form[36].p[0]);
                this.params_form[36].p[1] = parseFloat(this.params_form[36].p[1]);

                this.params_form[36].count = this.editForm_Self.dropout.count ? parseInt(this.editForm_Self.dropout.count) : 1;
                this.radio36 = '1';
                console.log('this.params_form[36]:', this.params_form[36]);
            }
            // dropout_part
            if (this.editForm_Self.dropout_part) {
                // 36
                this.checked_field_group.checked36 = true;

                this.params_form[36].p = this.editForm_Self.dropout_part.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].p[0] = parseFloat(this.params_form[36].p[0]);
                this.params_form[36].p[1] = parseFloat(this.params_form[36].p[1]);

                this.params_form[36].left_hor = this.editForm_Self.dropout_part.left_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].left_hor[0] = parseFloat(this.params_form[36].left_hor[0]);
                this.params_form[36].left_hor[1] = parseFloat(this.params_form[36].left_hor[1]);

                this.params_form[36].left_ver = this.editForm_Self.dropout_part.left_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].left_ver[0] = parseFloat(this.params_form[36].left_ver[0]);
                this.params_form[36].left_ver[1] = parseFloat(this.params_form[36].left_ver[1]);

                this.params_form[36].right_hor = this.editForm_Self.dropout_part.right_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].right_hor[0] = parseFloat(this.params_form[36].right_hor[0]);
                this.params_form[36].right_hor[1] = parseFloat(this.params_form[36].right_hor[1]);

                this.params_form[36].right_ver = this.editForm_Self.dropout_part.right_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[36].right_ver[0] = parseFloat(this.params_form[36].right_ver[0]);
                this.params_form[36].right_ver[1] = parseFloat(this.params_form[36].right_ver[1]);

                this.radio36 = '2';

                this.params_form[36].count = this.editForm_Self.dropout_part.count ? parseInt(this.editForm_Self.dropout_part.count) : 1;
                console.log('this.params_form[36]:', this.params_form[36]);
            }

            // coarse_dropout
            if (this.editForm_Self.coarse_dropout) {
                // 38
                this.checked_field_group.checked38 = true;

                this.params_form[38].p = this.editForm_Self.coarse_dropout.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].p[0] = parseFloat(this.params_form[38].p[0]);
                this.params_form[38].p[1] = parseFloat(this.params_form[38].p[1]);

                this.params_form[38].size = this.editForm_Self.coarse_dropout.size
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].size[0] = parseFloat(this.params_form[38].size[0]);
                this.params_form[38].size[1] = parseFloat(this.params_form[38].size[1]);

                this.params_form[38].count = this.editForm_Self.coarse_dropout.count
                    ? parseInt(this.editForm_Self.coarse_dropout.count)
                    : 1;
                this.radio38 = '1';
                console.log('this.params_form[38]:', this.params_form[38]);
            }
            // coarse_dropout_part
            if (this.editForm_Self.coarse_dropout_part) {
                // 38
                this.checked_field_group.checked38 = true;

                this.params_form[38].p = this.editForm_Self.coarse_dropout_part.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].p[0] = parseFloat(this.params_form[38].p[0]);
                this.params_form[38].p[1] = parseFloat(this.params_form[38].p[1]);

                console.log('size begin');
                this.params_form[38].size = this.editForm_Self.coarse_dropout_part.size
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].size[0] = parseFloat(this.params_form[38].size[0]);
                this.params_form[38].size[1] = parseFloat(this.params_form[38].size[1]);
                console.log('size end');

                this.params_form[38].left_hor = this.editForm_Self.coarse_dropout_part.left_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].left_hor[0] = parseFloat(this.params_form[38].left_hor[0]);
                this.params_form[38].left_hor[1] = parseFloat(this.params_form[38].left_hor[1]);

                this.params_form[38].left_ver = this.editForm_Self.coarse_dropout_part.left_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].left_ver[0] = parseFloat(this.params_form[38].left_ver[0]);
                this.params_form[38].left_ver[1] = parseFloat(this.params_form[38].left_ver[1]);

                this.params_form[38].right_hor = this.editForm_Self.coarse_dropout_part.right_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].right_hor[0] = parseFloat(this.params_form[38].right_hor[0]);
                this.params_form[38].right_hor[1] = parseFloat(this.params_form[38].right_hor[1]);

                this.params_form[38].right_ver = this.editForm_Self.coarse_dropout_part.right_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[38].right_ver[0] = parseFloat(this.params_form[38].right_ver[0]);
                this.params_form[38].right_ver[1] = parseFloat(this.params_form[38].right_ver[1]);

                this.params_form[38].count = this.editForm_Self.coarse_dropout_part.count
                    ? parseInt(this.editForm_Self.coarse_dropout_part.count)
                    : 1;
                this.radio38 = '2';
                console.log('this.params_form[38]:', this.params_form[38]);
            }

            // salt
            if (this.editForm_Self.salt) {
                // 43
                this.checked_field_group.checked43 = true;

                this.params_form[43].p = this.editForm_Self.salt.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].p[0] = parseFloat(this.params_form[43].p[0]);
                this.params_form[43].p[1] = parseFloat(this.params_form[43].p[1]);

                this.params_form[43].count = this.editForm_Self.salt.count ? parseInt(this.editForm_Self.salt.count) : 1;
                this.radio43 = '1';
                console.log('this.params_form[43]:', this.params_form[43]);
            }
            // salt_part
            if (this.editForm_Self.salt_part) {
                // 43
                this.checked_field_group.checked43 = true;

                this.params_form[43].p = this.editForm_Self.salt_part.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].p[0] = parseFloat(this.params_form[43].p[0]);
                this.params_form[43].p[1] = parseFloat(this.params_form[43].p[1]);

                this.params_form[43].left_hor = this.editForm_Self.salt_part.left_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].left_hor[0] = parseFloat(this.params_form[43].left_hor[0]);
                this.params_form[43].left_hor[1] = parseFloat(this.params_form[43].left_hor[1]);

                this.params_form[43].left_ver = this.editForm_Self.salt_part.left_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].left_ver[0] = parseFloat(this.params_form[43].left_ver[0]);
                this.params_form[43].left_ver[1] = parseFloat(this.params_form[43].left_ver[1]);

                this.params_form[43].right_hor = this.editForm_Self.salt_part.right_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].right_hor[0] = parseFloat(this.params_form[43].right_hor[0]);
                this.params_form[43].right_hor[1] = parseFloat(this.params_form[43].right_hor[1]);

                this.params_form[43].right_ver = this.editForm_Self.salt_part.right_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[43].right_ver[0] = parseFloat(this.params_form[43].right_ver[0]);
                this.params_form[43].right_ver[1] = parseFloat(this.params_form[43].right_ver[1]);

                this.params_form[43].count = this.editForm_Self.salt_part.count ? parseInt(this.editForm_Self.salt_part.count) : 1;
                this.radio43 = '2';
                console.log('this.params_form[43]:', this.params_form[43]);
            }

            // coarse_salt
            if (this.editForm_Self.coarse_salt) {
                // 44
                this.checked_field_group.checked44 = true;

                this.params_form[44].p = this.editForm_Self.coarse_salt.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].p[0] = parseFloat(this.params_form[44].p[0]);
                this.params_form[44].p[1] = parseFloat(this.params_form[44].p[1]);

                this.params_form[44].size = this.editForm_Self.coarse_salt.size
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].size[0] = parseFloat(this.params_form[44].size[0]);
                this.params_form[44].size[1] = parseFloat(this.params_form[44].size[1]);

                this.params_form[44].count = this.editForm_Self.coarse_salt.count ? parseInt(this.editForm_Self.coarse_salt.count) : 1;
                this.radio44 = '1';
                console.log('this.params_form[44]:', this.params_form[44]);
            }
            // coarse_salt_part
            if (this.editForm_Self.coarse_salt_part) {
                // 44
                this.checked_field_group.checked44 = true;

                this.params_form[44].p = this.editForm_Self.coarse_salt_part.p
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].p[0] = parseFloat(this.params_form[44].p[0]);
                this.params_form[44].p[1] = parseFloat(this.params_form[44].p[1]);

                this.params_form[44].size = this.editForm_Self.coarse_salt_part.size
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].size[0] = parseFloat(this.params_form[44].size[0]);
                this.params_form[44].size[1] = parseFloat(this.params_form[44].size[1]);

                this.params_form[44].left_hor = this.editForm_Self.coarse_salt_part.left_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].left_hor[0] = parseFloat(this.params_form[44].left_hor[0]);
                this.params_form[44].left_hor[1] = parseFloat(this.params_form[44].left_hor[1]);

                this.params_form[44].left_ver = this.editForm_Self.coarse_salt_part.left_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].left_ver[0] = parseFloat(this.params_form[44].left_ver[0]);
                this.params_form[44].left_ver[1] = parseFloat(this.params_form[44].left_ver[1]);

                this.params_form[44].right_hor = this.editForm_Self.coarse_salt_part.right_hor
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].right_hor[0] = parseFloat(this.params_form[44].right_hor[0]);
                this.params_form[44].right_hor[1] = parseFloat(this.params_form[44].right_hor[1]);

                this.params_form[44].right_ver = this.editForm_Self.coarse_salt_part.right_ver
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[44].right_ver[0] = parseFloat(this.params_form[44].right_ver[0]);
                this.params_form[44].right_ver[1] = parseFloat(this.params_form[44].right_ver[1]);

                this.params_form[44].count = this.editForm_Self.coarse_salt_part.count
                    ? parseInt(this.editForm_Self.coarse_salt_part.count)
                    : 1;
                this.radio44 = '2';
                console.log('this.params_form[44]:', this.params_form[44]);
            }

            // 场景变换
            if (this.editForm_Self.fog) {
                // 48
                this.checked_field_group.checked48 = true;

                this.params_form[48].A = this.editForm_Self.fog.A.replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[48].A[0] = parseFloat(this.params_form[48].A[0]);
                this.params_form[48].A[1] = parseFloat(this.params_form[48].A[1]);

                this.params_form[48].beta = this.editForm_Self.fog.beta
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[48].beta[0] = parseFloat(this.params_form[48].beta[0]);
                this.params_form[48].beta[1] = parseFloat(this.params_form[48].beta[1]);

                this.params_form[48].count = this.editForm_Self.fog.count ? parseInt(this.editForm_Self.fog.count) : 1;
                console.log('this.params_form[48]:', this.params_form[48]);
            }
            if (this.editForm_Self.fast_snowy_landscape) {
                console.log('this.editForm_Self.fast_snowy_landscape:', this.editForm_Self.fast_snowy_landscape);
                // 49
                this.checked_field_group.checked49 = true;

                this.params_form[49].lightness = this.editForm_Self.fast_snowy_landscape.lightness
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[49].lightness[0] = parseFloat(this.params_form[49].lightness[0]);
                this.params_form[49].lightness[1] = parseFloat(this.params_form[49].lightness[1]);

                this.params_form[49].inc = this.editForm_Self.fast_snowy_landscape.inc
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[49].inc[0] = parseFloat(this.params_form[49].inc[0]);
                this.params_form[49].inc[1] = parseFloat(this.params_form[49].inc[1]);

                this.params_form[49].count = this.editForm_Self.fast_snowy_landscape.count
                    ? parseInt(this.editForm_Self.fast_snowy_landscape.count)
                    : 1;
                console.log('this.params_form[49]:', this.params_form[49]);
            }

            // 传输异常
            if (this.editForm_Self.posterize) {
                // 52
                this.checked_field_group.checked49 = true;

                this.params_form[52].n = this.editForm_Self.posterize.n
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[52].n[0] = parseFloat(this.params_form[52].n[0]);
                this.params_form[52].n[1] = parseFloat(this.params_form[52].n[1]);

                console.log('this.params_form[52]:', this.params_form[52]);
            }

            // 模糊
            if (this.editForm_Self.motion_blur) {
                // 11
                this.checked_field_group.checked11 = true;

                this.params_form[11].radius = this.editForm_Self.motion_blur.radius
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[11].radius[0] = parseFloat(this.params_form[11].radius[0]);
                this.params_form[11].radius[1] = parseFloat(this.params_form[11].radius[1]);

                this.params_form[11].direction = this.editForm_Self.motion_blur.direction
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[11].direction[0] = parseFloat(this.params_form[11].direction[0]);
                this.params_form[11].direction[1] = parseFloat(this.params_form[11].direction[1]);

                this.params_form[11].count = this.editForm_Self.motion_blur.count ? parseInt(this.editForm_Self.motion_blur.count) : 1;
                console.log('this.params_form[11]:', this.params_form[11]);
            }

            // 形状变换
            if (this.editForm_Self.rotate) {
                // 24
                this.checked_field_group.checked24 = true;

                this.params_form[24].angle = this.editForm_Self.rotate.angle
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[24].angle[0] = parseFloat(this.params_form[24].angle[0]);
                this.params_form[24].angle[1] = parseFloat(this.params_form[24].angle[1]);

                this.params_form[24].x = this.editForm_Self.rotate.x
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[24].x[0] = parseFloat(this.params_form[24].x[0]);
                this.params_form[24].x[1] = parseFloat(this.params_form[24].x[1]);

                this.params_form[24].y = this.editForm_Self.rotate.y
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[24].y[0] = parseFloat(this.params_form[24].y[0]);
                this.params_form[24].y[1] = parseFloat(this.params_form[24].y[1]);

                this.params_form[24].count = this.editForm_Self.rotate.count ? parseInt(this.editForm_Self.rotate.count) : 1;
                console.log('this.params_form[24]:', this.params_form[24]);
            }

            if (this.editForm_Self.move) {
                // 25
                this.checked_field_group.checked25 = true;

                this.params_form[25].x = this.editForm_Self.move.x
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[25].x[0] = parseFloat(this.params_form[25].x[0]);
                this.params_form[25].x[1] = parseFloat(this.params_form[25].x[1]);

                this.params_form[25].y = this.editForm_Self.move.y
                    .replace('[', '')
                    .replace(']', '')
                    .split(',');
                this.params_form[25].y[0] = parseFloat(this.params_form[25].y[0]);
                this.params_form[25].y[1] = parseFloat(this.params_form[25].y[1]);

                this.params_form[25].count = this.editForm_Self.move.count ? parseInt(this.editForm_Self.move.count) : 1;
                console.log('this.params_form[25]:', this.params_form[25]);
            }

            if (this.editForm_Self.augmentation_method_name == '通用蜕变系列方法-合成孔径雷达') {
                this.type_value = 'first';
                console.log('this.checked_currency_group:', this.checked_currency_group);
            } else if (this.editForm_Self.augmentation_method_name == '领域蜕变系列方法-合成孔径雷达') {
                this.type_value = 'second';
                console.log('this.checked_field_group:', this.checked_field_group);
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
            this.params_form = [
                // 0
                {
                    mean: [0, 0],
                    var: [0, 0],
                    count: 1
                },
                // 1
                {
                    mean: [0, 0],
                    var: [0, 0],
                    count: 1
                },
                // 2
                {
                    lam: [0, 0],
                    count: 1
                },
                // 3
                {
                    proportion: [0, 0],
                    count: 1
                },
                // 4
                {
                    noise_num: [0, 0],
                    noise_gray_color: [0, 0],
                    noise_random: '0',
                    count: 1
                },
                // 5
                {
                    size: '(4,4)'
                },
                // 6
                {
                    size: '(4,4)'
                },
                // 7
                {
                    size: '(4,4)'
                },
                // 8
                {
                    size: '(4,4)'
                },
                // 9
                {
                    radius: [0, 0],
                    space: [0, 0],
                    graysimilarity: [0, 0],
                    count: 1
                },

                //10
                {
                    radius: [0, 0],
                    count: 1
                },
                // 11
                {
                    radius: [0, 0],
                    direction: [0, 0],
                    count: 1
                },
                // 12
                {
                    radius: [0, 0],
                    count: 1
                },

                {},
                {},
                {},
                {
                    gamma: 0.3
                },
                {},

                {},
                {},
                // 20
                {},
                // 21
                {
                    value: 1
                },
                // 22
                {
                    value: '(1, 1.6)',
                    left_hor: 270,
                    left_ver: 260,
                    right_hor: 1900,
                    right_ver: 1100,
                    count: 1
                },
                {},
                // 24
                {
                    angle: [0, 0],
                    count: 1,
                    x: [0, 0],
                    y: [0, 0]
                },
                // 25
                {
                    x: [0, 0],
                    y: [0, 0],
                    count: 1
                },
                // 26
                {
                    hx: 2,
                    wx: 2
                },
                //27
                {
                    x1: [0, 0],
                    y1: [0, 0],
                    x2: [128, 128],
                    y2: [128, 128],
                    count: 1
                },
                // 28
                {
                    h: [1, 1],
                    w: [1, 1],
                    count: 1
                },

                {},
                // 30
                {},
                {},

                {},
                {},
                {},
                //35
                {
                    p: 5
                },
                // 36
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    count: 1
                },
                // 37
                {
                    p: 0.05,
                    size: 15
                },
                // 38
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    size: [0, 0],
                    count: 1
                },
                // 39
                {
                    p: 3
                },
                // 40
                {
                    p: 0.05,
                    size: '(8,7)'
                },
                // 41
                {
                    p: '(4,9)'
                },
                // 42
                {
                    p: 2,
                    size: 5
                },
                // 43
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    count: 1
                },
                // 44
                {
                    p: [0, 0],
                    left_hor: [0, 0],
                    left_ver: [0, 0],
                    right_hor: [128, 128],
                    right_ver: [128, 128],
                    size: [0, 0],
                    count: 1
                },

                {},
                // 46
                {
                    m: 0
                },
                // 47
                {
                    m: 0,
                    left_hor: 'None',
                    left_ver: 'None',
                    right_hor: 0.8,
                    right_ver: 'None'
                },
                // 48
                {
                    A: [0, 0],
                    beta: [0, 0],
                    count: 1
                },
                {
                    lightness: [0, 0],
                    inc: [0, 0],
                    count: 1
                },
                //50
                {
                    percent: [0, 0],
                    count: 1
                },
                // 51
                {
                    p: 1
                },
                // 52
                {
                    n: [0, 0],
                    count: 1
                }
            ];
            this.checked_currency_group = {
                checked0: false,
                checked1: false,
                checked2: false,
                checked3: false,
                checked4: false,

                checked9: false,
                checked10: false,

                checked12: false,

                checked27: false,
                checked28: false,

                checked50: false
            };
            this.checked_field_group = {
                checked11: false,
                checked24: false,
                checked25: false,
                checked35: false,
                checked36: false,
                checked37: false,
                checked38: false,
                checked41: false,
                checked42: false,
                checked43: false,
                checked44: false,

                checked48: false,
                checked49: false,

                checked52: false
            };
        },
        async editTaskInfo() {
            this.editForm_Self.master = this.$store.state.userId;
            if (this.editForm_Self.epsilon) {
                this.editForm_Self.epsilon = this.editForm_Self.epsilon.replace('，', ',');
            }
            var is_empty_group = 1;
            var adddata = new FormData();

            // augmentation_method
            if (this.type_value == 'first') {
                // 通用
                adddata.append('augmentation_method', 8);
            } else {
                // 领域
                adddata.append('augmentation_method', 9);
            }

            adddata.append('task_id', this.editForm_Self.id);
            adddata.append('name', this.editForm_Self.name);
            adddata.append('master', this.editForm_Self.master);

            adddata.append('urgency_level', this.editForm_Self.urgency_level);

            var params = {};
            var checked_group = {};
            console.log('this.type_value:', this.type_value);
            if (this.type_value == 'first') {
                // 通用
                checked_group = this.checked_currency_group;
            } else {
                // 领域
                checked_group = this.checked_field_group;
            }
            console.log('checked_group:', checked_group);
            // 遍历所有方法
            for (let key in checked_group) {
                if (checked_group[key] == true) {
                    is_empty_group = 0;
                    console.log('key:', key);
                    if (key == 'checked0') {
                        // 0高斯噪声
                        var temp_params = {};
                        temp_params.mean = '[' + this.params_form[0].mean + ']';
                        temp_params.var = '[' + this.params_form[0].var + ']';
                        if (
                            this.params_form[0].mean[0] != this.params_form[0].mean[1] ||
                            this.params_form[0].var[0] != this.params_form[0].var[1]
                        ) {
                            temp_params.count = this.params_form[0].count;
                        }
                        params.gaussian_noise = temp_params;
                    } else if (key == 'checked1') {
                        // 1拉普拉斯噪声
                        var temp_params = {};
                        temp_params.mean = '[' + this.params_form[1].mean + ']';
                        temp_params.var = '[' + this.params_form[1].var + ']';
                        if (
                            this.params_form[1].mean[0] != this.params_form[1].mean[1] ||
                            this.params_form[1].var[0] != this.params_form[1].var[1]
                        ) {
                            temp_params.count = this.params_form[1].count;
                        }
                        params.laplace_noise = temp_params;
                    } else if (key == 'checked2') {
                        // 2泊松噪声
                        var temp_params = {};
                        temp_params.lam = '[' + this.params_form[2].lam + ']';
                        if (this.params_form[2].lam[0] != this.params_form[2].lam[1]) {
                            temp_params.count = this.params_form[2].count;
                        }
                        params.possion_noise = temp_params;
                    } else if (key == 'checked3') {
                        // 3椒盐噪声
                        var temp_params = {};
                        temp_params.proportion = '[' + this.params_form[3].proportion + ']';
                        if (this.params_form[3].proportion[0] != this.params_form[3].proportion[1]) {
                            temp_params.count = this.params_form[3].count;
                        }
                        params.pepper_noise = temp_params;
                    } else if (key == 'checked4') {
                        // 4随机噪声
                        var temp_params = {};
                        temp_params.noise_num = '[' + this.params_form[4].noise_num + ']';

                        if (this.params_form[4].noise_random == '1') {
                            temp_params.noise_random = this.params_form[4].noise_random;
                        } else {
                            temp_params.noise_gray_color = '[' + this.params_form[4].noise_gray_color + ']';
                        }

                        if (
                            this.params_form[4].noise_num[0] != this.params_form[4].noise_num[1] ||
                            (this.params_form[4].noise_gray_color[0] != this.params_form[4].noise_gray_color[1] &&
                                this.params_form[4].noise_random[0] == '0')
                        ) {
                            temp_params.count = this.params_form[4].count;
                        }
                        params.random_noise = temp_params;
                    } else if (key == 'checked9') {
                        // 9
                        var temp_params = {};
                        temp_params.radius = '[' + this.params_form[9].radius + ']';
                        temp_params.space = '[' + this.params_form[9].space + ']';
                        temp_params.graysimilarity = '[' + this.params_form[9].graysimilarity + ']';
                        if (
                            this.params_form[9].radius[0] != this.params_form[9].radius[1] ||
                            this.params_form[9].space[0] != this.params_form[9].space[1] ||
                            this.params_form[9].graysimilarity[0] != this.params_form[9].graysimilarity[1]
                        ) {
                            temp_params.count = this.params_form[9].count;
                        }
                        params.bilateral_blur = temp_params;
                    } else if (key == 'checked10') {
                        // 10
                        var temp_params = {};
                        temp_params.radius = '[' + this.params_form[10].radius + ']';
                        if (this.params_form[10].radius[0] != this.params_form[10].radius[1]) {
                            temp_params.count = this.params_form[10].count;
                        }
                        params.average_blur = temp_params;
                    } else if (key == 'checked11') {
                        // 11
                        var temp_params = {};
                        temp_params.radius = '[' + this.params_form[11].radius + ']';
                        temp_params.direction = '[' + this.params_form[11].direction + ']';
                        if (
                            this.params_form[11].radius[0] != this.params_form[11].radius[1] ||
                            this.params_form[11].direction[0] != this.params_form[11].direction[1]
                        ) {
                            temp_params.count = this.params_form[11].count;
                        }
                        params.motion_blur = temp_params;
                    } else if (key == 'checked12') {
                        // 12
                        var temp_params = {};
                        temp_params.radius = '[' + this.params_form[12].radius + ']';
                        if (this.params_form[12].radius[0] != this.params_form[12].radius[1]) {
                            temp_params.count = this.params_form[12].count;
                        }
                        params.median_blur = temp_params;
                    } else if (key == 'checked24') {
                        // 24
                        var temp_params = {};
                        temp_params.angle = '[' + this.params_form[24].angle + ']';
                        temp_params.x = '[' + this.params_form[24].x + ']';
                        temp_params.y = '[' + this.params_form[24].y + ']';
                        if (
                            this.params_form[24].angle[0] != this.params_form[24].angle[1] ||
                            this.params_form[24].x[0] != this.params_form[24].x[1] ||
                            this.params_form[24].y[0] != this.params_form[24].y[1]
                        ) {
                            temp_params.count = this.params_form[24].count;
                        }
                        params.rotate = temp_params;
                    } else if (key == 'checked25') {
                        // 25
                        var temp_params = {};
                        temp_params.x = '[' + this.params_form[25].x + ']';
                        temp_params.y = '[' + this.params_form[25].y + ']';
                        if (
                            this.params_form[25].y[0] != this.params_form[25].y[1] ||
                            this.params_form[25].x[0] != this.params_form[25].x[1]
                        ) {
                            temp_params.count = this.params_form[25].count;
                        }
                        params.move = temp_params;
                    } else if (key == 'checked27') {
                        // 27
                        var temp_params = {};
                        temp_params.x1 = '[' + this.params_form[27].x1 + ']';
                        temp_params.y1 = '[' + this.params_form[27].y1 + ']';
                        temp_params.x2 = '[' + this.params_form[27].x2 + ']';
                        temp_params.y2 = '[' + this.params_form[27].y2 + ']';
                        if (
                            this.params_form[27].y1[0] != this.params_form[27].y1[1] ||
                            this.params_form[27].x1[0] != this.params_form[27].x1[1] ||
                            this.params_form[27].y2[0] != this.params_form[27].y2[1] ||
                            this.params_form[27].x2[0] != this.params_form[27].x2[1]
                        ) {
                            temp_params.count = this.params_form[27].count;
                        }
                        params.crop = temp_params;
                    } else if (key == 'checked28') {
                        // 28
                        var temp_params = {};
                        temp_params.w = '[' + this.params_form[28].w + ']';
                        temp_params.h = '[' + this.params_form[28].h + ']';
                        if (
                            this.params_form[28].w[0] != this.params_form[28].w[1] ||
                            this.params_form[28].h[0] != this.params_form[28].h[1]
                        ) {
                            temp_params.count = this.params_form[28].count;
                        }
                        params.resize = temp_params;
                    } else if (key == 'checked50') {
                        // 50
                        var temp_params = {};
                        temp_params.percent_a = this.params_form[50].percent[0] + '';
                        temp_params.percent_b = this.params_form[50].percent[1] + '';
                        // temp_params.count = this.params_form[50].count;
                        console.log('this.params_form[50]:', this.params_form[50]);
                        if (this.params_form[50].percent[0] != this.params_form[50].percent[1]) {
                            console.log('this.params_form[50].count:', this.params_form[50].count);
                            temp_params.count = this.params_form[50].count;
                        }
                        params.crop_and_pad = temp_params;
                    } else if (key == 'checked36') {
                        // 36

                        var temp_params = {};
                        temp_params.p = '[' + this.params_form[36].p + ']';
                        if (this.radio36 == '2') {
                            temp_params.left_hor = '[' + this.params_form[36].left_hor + ']';
                            temp_params.left_ver = '[' + this.params_form[36].left_ver + ']';
                            temp_params.right_hor = '[' + this.params_form[36].right_hor + ']';
                            temp_params.right_ver = '[' + this.params_form[36].right_ver + ']';
                        }

                        if (
                            this.params_form[36].p[0] != this.params_form[36].p[1] ||
                            (this.radio36 == '2' &&
                                (this.params_form[36].left_hor[0] != this.params_form[36].left_hor[1] ||
                                    this.params_form[36].left_ver[0] != this.params_form[36].left_ver[1] ||
                                    this.params_form[36].right_hor[0] != this.params_form[36].right_hor[1] ||
                                    this.params_form[36].right_ver[0] != this.params_form[36].right_ver[1]))
                        ) {
                            temp_params.count = this.params_form[36].count;
                        }
                        if (this.radio36 == '1') {
                            params.dropout = temp_params;
                        } else {
                            params.dropout_part = temp_params;
                        }
                    } else if (key == 'checked38') {
                        // 38

                        var temp_params = {};
                        temp_params.p = '[' + this.params_form[38].p + ']';
                        temp_params.size = '[' + this.params_form[38].size + ']';
                        if (this.radio38 == '2') {
                            temp_params.left_hor = '[' + this.params_form[38].left_hor + ']';
                            temp_params.left_ver = '[' + this.params_form[38].left_ver + ']';
                            temp_params.right_hor = '[' + this.params_form[38].right_hor + ']';
                            temp_params.right_ver = '[' + this.params_form[38].right_ver + ']';
                        }

                        if (
                            this.params_form[38].p[0] != this.params_form[38].p[1] ||
                            (this.radio38 == '2' &&
                                (this.params_form[38].left_hor[0] != this.params_form[38].left_hor[1] ||
                                    this.params_form[38].left_ver[0] != this.params_form[38].left_ver[1] ||
                                    this.params_form[38].right_hor[0] != this.params_form[38].right_hor[1] ||
                                    this.params_form[38].right_ver[0] != this.params_form[38].right_ver[1]))
                        ) {
                            temp_params.count = this.params_form[38].count;
                        }
                        if (this.radio38 == '1') {
                            params.coarse_dropout = temp_params;
                        } else {
                            params.coarse_dropout_part = temp_params;
                        }
                    } else if (key == 'checked43') {
                        // 43
                        var temp_params = {};
                        temp_params.p = '[' + this.params_form[43].p + ']';
                        if (this.radio43 == '2') {
                            temp_params.left_hor = '[' + this.params_form[43].left_hor + ']';
                            temp_params.left_ver = '[' + this.params_form[43].left_ver + ']';
                            temp_params.right_hor = '[' + this.params_form[43].right_hor + ']';
                            temp_params.right_ver = '[' + this.params_form[43].right_ver + ']';
                        }

                        if (
                            this.params_form[43].p[0] != this.params_form[43].p[1] ||
                            (this.radio43 == '2' &&
                                (this.params_form[43].left_hor[0] != this.params_form[43].left_hor[1] ||
                                    this.params_form[43].left_ver[0] != this.params_form[43].left_ver[1] ||
                                    this.params_form[43].right_hor[0] != this.params_form[43].right_hor[1] ||
                                    this.params_form[43].right_ver[0] != this.params_form[43].right_ver[1]))
                        ) {
                            temp_params.count = this.params_form[43].count;
                        }
                        if (this.radio43 == '1') {
                            params.salt = temp_params;
                        } else {
                            params.salt_part = temp_params;
                        }
                    } else if (key == 'checked44') {
                        // 44
                        var temp_params = {};
                        temp_params.p = '[' + this.params_form[44].p + ']';
                        temp_params.size = '[' + this.params_form[44].size + ']';
                        if (this.radio44 == '2') {
                            temp_params.left_hor = '[' + this.params_form[44].left_hor + ']';
                            temp_params.left_ver = '[' + this.params_form[44].left_ver + ']';
                            temp_params.right_hor = '[' + this.params_form[44].right_hor + ']';
                            temp_params.right_ver = '[' + this.params_form[44].right_ver + ']';
                        }

                        if (
                            this.params_form[44].p[0] != this.params_form[44].p[1] ||
                            (this.radio44 == '2' &&
                                (this.params_form[44].left_hor[0] != this.params_form[44].left_hor[1] ||
                                    this.params_form[44].left_ver[0] != this.params_form[44].left_ver[1] ||
                                    this.params_form[44].right_hor[0] != this.params_form[44].right_hor[1] ||
                                    this.params_form[44].right_ver[0] != this.params_form[44].right_ver[1]))
                        ) {
                            temp_params.count = this.params_form[44].count;
                        }
                        if (this.radio44 == '1') {
                            params.coarse_salt = temp_params;
                        } else {
                            params.coarse_salt_part = temp_params;
                        }
                    } else if (key == 'checked48') {
                        // 48
                        var temp_params = {};
                        temp_params.A = '[' + this.params_form[48].A + ']';
                        temp_params.beta = '[' + this.params_form[48].beta + ']';
                        if (
                            this.params_form[48].A[0] != this.params_form[48].A[1] ||
                            this.params_form[48].beta[0] != this.params_form[48].beta[1]
                        ) {
                            temp_params.count = this.params_form[48].count;
                        }
                        params.fog = temp_params;
                    } else if (key == 'checked49') {
                        // 49
                        var temp_params = {};
                        temp_params.lightness = '[' + this.params_form[49].lightness + ']';
                        temp_params.inc = '[' + this.params_form[49].inc + ']';
                        if (
                            this.params_form[49].lightness[0] != this.params_form[49].lightness[1] ||
                            this.params_form[49].inc[0] != this.params_form[49].inc[1]
                        ) {
                            temp_params.count = this.params_form[49].count;
                        }
                        params.fast_snowy_landscape = temp_params;
                    } else if (key == 'checked52') {
                        // 52
                        var temp_params = {};
                        temp_params.n = '[' + this.params_form[52].n + ']';
                        params.posterize = temp_params;
                    }
                }
            }
            if (is_empty_group) {
                this.loading = false;
                return this.$message.error('编辑任务失败！' + '错误原因：未选定算子');
            }
            console.log('params1:', params);

            params = JSON.stringify(params);
            console.log('params2:', params);
            adddata.append('params', params);

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
